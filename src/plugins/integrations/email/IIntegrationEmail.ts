import { IComboboxItem } from '@/models/IForm';

/**
 * Interface för en integration email
 */
export interface IIntegrationEmail {
  id?: number;
  title?: string;
  type: string;
  subject: string;
  sender: IComboboxItem[];
  receiver: IComboboxItem[];
  attachFiles: boolean;
  body: string;
}
