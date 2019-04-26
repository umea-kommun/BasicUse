import { IFormIntegrationOption } from '@/models/IForm';

export interface IIntegrationObject {
  type: string;
  icon: string;
  componentName: string;
  name: string;
  options: IFormIntegrationOption[];
}
