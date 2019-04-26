import { IIntegrationObject } from './../form-integrations-admin/IIntegrationObject';
import _Vue from 'vue'; // <-- notice the changed import
import EmailIntegration from './EmailIntegration.vue';

export default function EmailIntegrationPlugin(Vue: typeof _Vue, options?: any): void {

  // register the available integration
  (Vue as any).registeredIntegrationComponents.push({
    type: 'Email',
    icon: 'mail_outline',
    componentName: 'EmailIntegration',
    name: 'E-mail'
  } as IIntegrationObject);

  // Register admin component
  Vue.component('EmailIntegration', EmailIntegration);

}
