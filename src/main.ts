import '@babel/polyfill';
import 'url-search-params-polyfill'; // Behövs till URLSearchParams
import Vue from 'vue';
import VueScrollTo from 'vue-scrollto'; // För smooth scrolling: https://github.com/rigor789/vue-scrollto
import VueAxe from 'vue-axe';
import IdleVue from 'idle-vue';
import VueAppInsights from 'vue-application-insights';
import App from '@/App.vue';
import i18n from '@/plugins/i18next';
import router from '@/router';
import store from '@/store/store';
import '@/plugins/moment';
import '@/plugins/vuetify';
import Validation from '@/plugins/validation';
import Auth from '@/plugins/auth';
import EmailIntegrationPlugin from '@/plugins/integrations/email/EmailIntegrationPlugin';
import FormIntegrationsAdminPlugin from '@/plugins/integrations/form-integrations-admin/FormIntegrationsAdminPlugin';
import SharepointIntegrationPlugin from '@/plugins/integrations/sharepoint/SharepointIntegrationPlugin';
import NavetIntegrationPlugin from '@/plugins/integrations/navet/NavetIntegrationPlugin';

/** Install form integration plugins */
Vue.use(FormIntegrationsAdminPlugin); // <-- needs to be registered first
Vue.use(EmailIntegrationPlugin);
Vue.use(SharepointIntegrationPlugin);
Vue.use(NavetIntegrationPlugin);

/** Install other plugins */
Vue.use(Auth, {config: process.env});
Vue.use(Validation);
Vue.use(VueScrollTo, {
  duration: 1500
});
const inactivityTimeLimit = process.env.VUE_APP_INACTIVITY_TIME_LIMIT as any || 60;
Vue.use(IdleVue, {
  idleTime: inactivityTimeLimit * 60 * 1000,
  startAtIdle: false,
  store
});

if ('appInsights' in window) {
  Vue.use(VueAppInsights, {
    appInsights: (window as any).appInsights,
    trackInitialPageView: false,
    basePath: '(BasicUse Vue)',
    router
  });
}

// Axe-plugin for accessibility validation in development
// if (process.env.NODE_ENV !== 'production') {
//   Vue.use(VueAxe, {
//     config: {
//       branding: {
//         brand: 'Umea kommun',
//         application: 'e.umea.se'
//       },
//       rules: []
//     },
//     clearConsoleOnUpdate: false
//   });
// }

Vue.config.productionTip = false;
// Performance testing
// Vue.config.devtools = true;
// Vue.config.performance = true;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
