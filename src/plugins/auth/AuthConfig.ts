
export default class AuthConfig {

  public clientId: string;
  public clientIdAdmin: string;
  public clientSecret: string;
  public loginUrl: string;
  public redirectUrl: string;
  public fetchTokenApiUrl: string;
  public logoutUrl: string;
  public scopePublic: string;
  public scopeAdmin: string;
  public authClass: string;

  public constructor(config: any) {
    this.clientId = config.VUE_APP_AUTH_PUBLIC_CLIENT_ID;
    this.clientIdAdmin = config.VUE_APP_AUTH_ADMIN_CLIENT_ID;
    this.clientSecret = config.VUE_APP_AUTH_CLIENT_SECRET;
    this.loginUrl = config.VUE_APP_AUTH_LOGIN_URL;
    this.redirectUrl = config.VUE_APP_AUTH_REDIRECT_URL;
    this.fetchTokenApiUrl = config.VUE_APP_AUTH_FETCH_TOKEN_API_URL;
    this.logoutUrl = config.VUE_APP_AUTH_LOGOUT_URL;
    this.scopePublic = config.VUE_APP_AUTH_SCOPE_PUBLIC;
    this.scopeAdmin = config.VUE_APP_AUTH_SCOPE_ADMIN;
    this.authClass = config.VUE_APP_AUTH_CLASS;
    Object.keys(this).forEach(key => {
      if (!this[key]) {
        console.dir(this);
        throw new Error('No ' + key + ' is configured for oauth');
      }
    });
  }

  public getClientIdByScope(scope): string {
    switch (scope) {
      case this.scopePublic:
        return this.clientId;
      case this.scopeAdmin:
        return this.clientIdAdmin;
      default:
        throw new Error('Unable to resolve client id for scope ' + scope);
    }
  }
}
