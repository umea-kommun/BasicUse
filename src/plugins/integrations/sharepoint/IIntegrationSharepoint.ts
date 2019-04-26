
/**
 * Interface för en integration email
 */
export interface IIntegrationSharepoint {
  id?: number;
  type: string;
  title?: string;
  siteTitle?: string;
  userEmail: string;
}
