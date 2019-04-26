import { IUser, IUserContactInfo } from './../../models/IForm';
import { MutationType } from '../../models/Enums';
import store from '@/store/store';
import IAuthManager from './IAuthManager';
import AuthConfig from './AuthConfig';

class FakeDemoAuth implements IAuthManager {

  private config: AuthConfig;

  public constructor(config: AuthConfig) {
    this.config = config;
  }

  public loginCitizen(routeAfterLogin: string) {
    this.login(routeAfterLogin, this.config.scopePublic);
  }

  public loginAdmin(routeAfterLogin) {
    this.login(routeAfterLogin, this.config.scopeAdmin);
  }

  public logoutRedirectingToStartPage(extraQueryParams: string = '') {
    store.commit(MutationType.UserLogOut);
    let urlAfterLogout = window.location.origin;
    urlAfterLogout +=  extraQueryParams === '' ? '/' : '/?' + extraQueryParams;
    (window as any).location = urlAfterLogout;
  }

  public async handleLoginCallbackAsync(state: string, code: string): Promise<string> {
    throw new Error('This method should not have to be implemented...');
  }

  public login(routeAfterLogin: string, scope: string) {
    const isAdminLogin = scope === this.config.scopeAdmin;
    const userContactInfo = {
      socialSecurityNumber: isAdminLogin ? '' : '19831108xxyy',
      firstName: isAdminLogin ? 'Admin' : 'Uma',
      lastName: isAdminLogin ? '' : 'Svensson',
      email: 'test@website.com',
      address: 'Myceliegatan 110',
      postalNumber: '90740',
      city: 'Umeå',
    } as IUserContactInfo;
    const jwtPayload = {
      ...userContactInfo,
      fullName: userContactInfo.firstName + ' ' + userContactInfo.lastName,
      rawJwt: 'fake-demo-jwt',
      scope: [scope],
      userContactInfo,
      isAdmin: isAdminLogin,
      exp: new Date().getTime() + (10 * 60 * 60)  // 10h expiretime on token
    } as IUser;
    store.commit(MutationType.UserLogIn, {jwtPayload, rawJwt: 'fake-demo-jwt'});
    window.location.replace(routeAfterLogin);
  }
}

const loader = config => {
  return new FakeDemoAuth(config);
};

export default loader;
