import { IIntegrationObject } from '@/plugins/integrations/form-integrations-admin/IIntegrationObject';
import _Vue from 'vue'; // <-- notice the changed import
import NavetIntegration from './NavetIntegration.vue';

export default function NavetIntegrationPlugin(Vue: typeof _Vue, options?: any): void {

  // register the available integration
  (Vue as any).registeredIntegrationComponents.push({
    type: 'Navet',
    icon: 'accessible',
    componentName: 'NavetIntegration',
    name: 'Färdtjänst (Navet)'
  } as IIntegrationObject);

  // Register admin component
  Vue.component('NavetIntegration', NavetIntegration);

}
