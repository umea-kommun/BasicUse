
export default interface IAuthManager {

  /**
   * Login user as some one using e-services (web forms)
   * @param routeAfterLogin
   */
  loginCitizen(routeAfterLogin: string);

  /**
   * Login user as administrator, someone creating e-services (web forms)
   * @param routeAfterLogin
   */
  loginAdmin(routeAfterLogin);

  /**
   * Method that should logout the user, both in this app and over at the central authorization server.
   * After the user is logged out the user should be redirected back to the start page of the app.
   *
   * @param extraQueryParams Query parameters that should be sent along in the
   * URL when the user is redirected back to the startpage
   */
  logoutRedirectingToStartPage(extraQueryParams: string);

  /**
   * Params "state" and "code" comes from authorization server as query parameters
   * after the user have been redirected back to the app after login.
   *
   * This method should return the path of the route that the user should be redirect
   * after login is handled.
   *
   * @param state
   * @param code
   */
  handleLoginCallbackAsync(state: string, code: string): Promise<string>;

  /**
   * @param routeAfterLogin Path of route that the user should be redirected to after login
   * @param scope The scope under which this user should be logged in.
   */
  login(routeAfterLogin: string, scope: string);
}
