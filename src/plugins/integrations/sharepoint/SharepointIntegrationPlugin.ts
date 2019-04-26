import { IIntegrationObject } from '@/plugins/integrations/form-integrations-admin/IIntegrationObject';
import _Vue from 'vue'; // <-- notice the changed import
import SharepointIntegration from './SharepointIntegration.vue';

export default function SharepointIntegrationPlugin(Vue: typeof _Vue, options?: any): void {

  // register the available integration
  (Vue as any).registeredIntegrationComponents.push({
    type: 'Sharepoint',
    icon: 'folder',
    componentName: 'SharepointIntegration',
    name: 'Sharepoint'
  } as IIntegrationObject);

  // Register admin component
  Vue.component('SharepointIntegration', SharepointIntegration);

}
