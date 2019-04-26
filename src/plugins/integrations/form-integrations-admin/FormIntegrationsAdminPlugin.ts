import FormIntegrationManager from './FormIntegrationManager.vue';
import _Vue from 'vue'; // <-- notice the changed import
import { IIntegrationObject } from './IIntegrationObject';
import { IFormIntegration } from '@/models/IForm';

export default function FormIntegrationsAdminPlugin(Vue: typeof _Vue, options?: any): void {

  Vue.component('FormIntegrationManager', FormIntegrationManager);

  // Where integration plugins should register them self
  (Vue as any).registeredIntegrationComponents = [];

  // Hepler class
  Vue.prototype.$formIntegrations = {

    getRegisteredIntegrationComponents() {
      return (Vue as any).registeredIntegrationComponents;
    },

    getIcon(formIntegration: IFormIntegration): string {
      const found = (Vue as any).registeredIntegrationComponents
        .find(integrationObject => integrationObject.type === formIntegration.type);
      return found ? found.icon : '';
    }

  } as IFormIntegrations;
}

interface IFormIntegrations {
  getRegisteredIntegrationComponents(): IIntegrationObject[];
  getIcon(formIntegration: IFormIntegration): string;
}

declare module 'vue/types/vue' {
  interface Vue {
    $formIntegrations: IFormIntegrations;
  }
}
