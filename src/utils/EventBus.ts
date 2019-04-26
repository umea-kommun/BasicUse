import Vue from 'vue';
import { IFormField } from '@/models/IForm';
/**
 * Used when we want to communicate between components that are not in a parent-child-relationship
 * or we do not want to pass event as params to a child that will stay as parameter until i changes.
 * In normal circumstances this should not be used.
 * --
 * Uses publish/subscription
 * ex: adminform.adminStep.adminFields wants to know when we doubleclick in component adminForm.
 * --
 * To publish ex:
 *    const eventBusValue = {
 *       field: itemToAdd,
 *       stepId: this.currentStep.id
 *    } as IEventAddFieldDblClick;
 *    EventBus.$emit(EventBusEvent.onAddFieldDblClick, eventBusValue);
 * --
 * To subscribe ex:
 *    public async created() {
 *       EventBus.$on(EventBusEvent.onAddFieldDblClick, this.onAddFieldDblClick);
 *    }
 * --
 * Important that subscription is destroyed when not needed anymore, ex:
 *    public async beforeDestroy() {
 *      EventBus.$off(EventBusEvent.onAddFieldDblClick);
 *    }
 */
export const EventBus = new Vue();

/**
 * Name of the event's we can listen on
 */
export enum EventBusEvent {
  onAddFieldDblClick = 'onAddFieldDblClick',
}

/**
 * Interface for object return from event onAddFieldDblClick
 */
export interface IEventAddFieldDblClick {
  field: IFormField;
  stepId: any;
}
