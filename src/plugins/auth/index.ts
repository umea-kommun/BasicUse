import Router from 'vue-router';
import store from '@/store/store';
import _Vue from 'vue'; // <-- notice the changed import
import IAuthManager from './IAuthManager';
import AuthConfig from './AuthConfig';

export default function Auth(Vue: typeof _Vue, options?: any): void {
  const config = new AuthConfig(options.config);
  const authLoader = require('./' + config.authClass);
  const auth = authLoader.default(config) as IAuthManager;
  Vue.prototype.$auth = auth;

  // Check if jwt expired every fifth second, and in that case logout
  const handleExpiredJwt = () => {
    if (store.state.user && store.state.user.exp) {
      const expireDate = new Date(store.state.user.exp * 1000);
      if (expireDate.getTime() < new Date().getTime()) {
        auth.logoutRedirectingToStartPage('logoutReason=sessionExpired');
      }
    }
  };
  handleExpiredJwt();
  setInterval(handleExpiredJwt, 5000);
}

export function authMiddleware(router: Router) {
  router.beforeEach((to: any, from, next) => {
    let loadNextMiddleware = true;
    if (to.meta && to.meta.authScope) {
      if (store.state.user) {
        if (store.state.user.scope.indexOf(to.meta.authScope) === -1) {
          throw new Error('Logged in with invalid scope');
        }
      } else {
        try {
          router.app.$auth.login(to.path, to.meta.authScope);
        } catch (err) {
          // strange... vue seems to mute thrown errors in beforeEach??
          console.error(err);
          throw err;
        }
        loadNextMiddleware = false;
      }
    }
    if (loadNextMiddleware) {
      next();
    }
  });
}

export const b64DecodeUnicode = (str: string) => {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
};

declare module 'vue/types/vue' {
  interface Vue {
    readonly $auth: IAuthManager & IAuthManager;
  }
}
