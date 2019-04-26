import { IUser } from '@/models/IForm';
import { b64DecodeUnicode } from './index';
import { MutationType } from '@/models/Enums';
import Axios from 'axios';
import store from '@/store/store';
import IAuthManager from './IAuthManager';
import AuthConfig from './AuthConfig';

class Oauth implements IAuthManager {

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
    window.location.replace(this.config.logoutUrl + '?redirect=' + encodeURIComponent(urlAfterLogout));
  }

  public async handleLoginCallbackAsync(state: string, code: string): Promise<string> {

    if (!code) {
      throw new Error('No code supplied');
    }

    // Validate that we have come back with the same state as when we started
    // the login process(to prevent cross site forgery)
    const storedState = window.localStorage.getItem('OauthState');
    if (storedState !== state) {
      throw new Error('State not known...');
    }

    // extract state data
    const stateData = JSON.parse(b64DecodeUnicode(state));

    // Build API request
    const clientId = this.config.getClientIdByScope(stateData.scope);
    const data = new FormData();
    data.append('client_id', clientId);
    data.append('client_secret', this.config.clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', this.config.redirectUrl);
    data.append('code', code);

    let response: any;
    try {
      response = await Axios.post(this.config.fetchTokenApiUrl, data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
    } catch (err) {
      throw new Error('Got unexpected response from server when trying to fetch auth token');
    }

    // parse jwt and send payload to store
    const rawJwt = response.data.access_token;
    const jwtPayload = JSON.parse(b64DecodeUnicode(rawJwt.split('.')[1])) as IUser;
    jwtPayload.isAdmin = jwtPayload.scope.indexOf(this.config.scopeAdmin) > -1;
    store.commit(MutationType.UserLogIn, {jwtPayload, rawJwt});

    return stateData.routeAfterLogin;
  }

  public login(routeAfterLogin: string, scope: string) {
    // Store information needed when coming back from sso in our state variable
    // add a random id to make it unique, be vary of 414 Request URI too long
    const stateData = {routeAfterLogin, scope, id: Math.random()};
    const state = btoa(JSON.stringify(stateData));

    // Save state locally, to be verified when coming back from sso
    window.localStorage.setItem('OauthState', state);

    // Build login url
    const clientId = this.config.getClientIdByScope(scope);
    const loginUrl = this.config.loginUrl + '?client_id=' + clientId + '&scope=' +
      scope + '+offline_access' + '&response_type=code&redirect_uri=' + this.config.redirectUrl +
      '&state=' + state;

    // Redirect to sso login
    window.location.replace(loginUrl);
  }
}

const loader = config => {
  return new Oauth(config);
};

export default loader;
