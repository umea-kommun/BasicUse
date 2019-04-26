import { IValidationRule } from '@/models/IValidation';
import { IValidation } from './../../models/IValidation';
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { IItemListField, IItem } from '@/models/IForm';
import { FormFieldType, MutationType } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import Debounce from 'debounce-decorator';

/**
 * Base class that represents a field based on a list and implements IItemListField.
 */
@Component
export default class AbstractItemListField extends Vue implements IItemListField {

    // Inject validation object
    @Inject('validator') public $validator: any;
    public type!: FormFieldType;

    // Set mode for field, for example EDIT, VIEW or ADMIN
    @Prop({ default: 'EDIT' }) public mode!: string;

    // Reference to data for IItemListField in Vuex state.
    // Data from state should not be accessed with two way bindings but instead
    // through getters/setters.
    @Prop() public field!: IItemListField;

    // Set validation to scope stepId
    @Prop( { default: '' }) public validationScope!: string;

    get fieldOptions(): any {
      return this.field.fieldOptions ? Helper.deepCopy(this.field.fieldOptions) : {};
    }
    /**
     * Get Id from state
     * @return {string} Id for field
     */
    get id(): string {
      return this.field ? (this.field.id ? this.field.id : '') : '';
    }
    /**
     * Get Id from state
     * @return {string} Id for field
     */
    get guid(): string {
      return this.field ? (this.field.guid ? this.field.guid : '') : '';
    }
    /**
     * Get title from state
     * @return {string} Title for field
     */
    get title(): string {
      return this.field ? (this.field.title ? this.field.title : '') : '';
    }
    /**
     * Set title in state
     * @param {string} title - Title to set
     */
    set title(title: string) {
      this.storeDebounceUpdateFormField(title, 'title');
    }
    /**
     * Get Id from state
     * @return {string} Id for field
     */
    get displayRuleGuid(): string {
      return this.field ? (this.field.displayRuleGuid ? this.field.displayRuleGuid : '') : '';
    }

    /**
     * Get sortIndex from state
     */
    get sortIndex(): number {
      return this.field ? (this.field.sortIndex ? this.field.sortIndex : 0) : 0;
    }

    /**
     * Set sortIndex in state
     * @param {string} sortIndex - SortIndex to set
     */
    set sortIndex(sortIndex: number) {
      this.storeDebounceUpdateFormField(sortIndex, 'sortIndex');
    }

    /**
     * Get helpText from state
     * @return {string} HelpText for field
     */
    get helpText(): string {
      return this.field ? (this.field.helpText ? this.field.helpText : '') : '';
    }

    /**
     * Set helpText in state
     * @param {string} helpText - HelpText to set
     */
    set helpText(helpText: string) {
      this.storeDebounceUpdateFormField(helpText, 'helpText');
    }

    // Get/set for validation in state
    get validation() {
      return {
        rules: this.fieldOptions.validation || []
      } as IValidation;
    }

    /**
     * Save valition in state
     * @param {string} validation - New validation that should be set
     */
    set validation(validation: IValidation) {
      const options = this.fieldOptions;
      options.validation = validation.rules || [];
      this.storeUpdateFormField(options, 'fieldOptions');
    }

    // /**
    //  * Get value in state
    //  * @return {string} Value from state
    //  */
    // get value(): string {
    //   if (this.field && this.field.items) {
    //     return this.field.items.filter(d => d.isChecked === true)
    //                             .map(d => `${d.id}:${d.isChecked}`)
    //                             .join('|');
    //   }
    //   return '';
    // }

    /**
     * Get items from state
     * @return {IItem[]} A list with items
     */
    get items(): IItem[] {
      return Helper.deepCopy(this.fieldOptions.items || []) as IItem[];
    }

    /**
     * Set items in state
     * @param {IItem} items - Items to set
     */
    set items(items: IItem[]) {
      const options = this.fieldOptions;
      options.items = items;
      this.storeUpdateFormField(options, 'fieldOptions');
    }

    get checkedItemsPreviewValue() {
      return this.checkedItems.map(element => element.title).join('<br />');
    }

    /**
     * Get checked items in state
     * @return {IItem[]} Items that are checked
     */
    get checkedItems(): IItem[] {
      return this.items.filter(item => item.isChecked);
    }

    /**
     * Set checked items in state
     * Used for checkbox that want's a array for v-model binding.
     * @param {IItem[]} item - Items (checkbox) that are checked
     */
    set checkedItems(checkedItems: IItem[]) {
      // We must update isChecked since this isn't done when binding.
      // Parameter checkedItems is only a list of checkbox's that are checked but boolean isChecked is not changed
      this.items.forEach(item => {
        let isChecked = false;
        // We could set item.isChecked direct, but this way we only change the one that needs change
        isChecked = checkedItems.some(d => d.id === item.id);

        // Set isChecked flag in the computed items
        if (isChecked !== item.isChecked) {
          item.isChecked = isChecked;
        }
      });

      // Send all items to store
      this.storeUpdateFormField({...this.fieldOptions, items: this.items}, 'fieldOptions');
    }

    /** Get selected item in state
     * @return {IItem} Item that is selected
     */
    get selectedItem(): IItem {
      return this.items.find(item => item.isChecked || false) as IItem;
    }

    /**
     * Set selected items in state.
     * Used for radiobutton and selectlist that want's a single value for v-model binding.
     * @param {IItem} item - Item (ex: radiobutton) that is selected
     */
    set selectedItem(selectedItem: IItem) {

      // We must update isChecked since this isn't done when binding.
      this.items.forEach(item => {
        let isChecked = false;
        // We could set item.isChecked direct, but this way we only change the one that needs change?
        isChecked = (item.id === selectedItem.id);

        // Set isChecked flag in the computed items
        if (isChecked !== item.isChecked) {
          item.isChecked = isChecked;
        }
      });

      // Send all items to store
      this.storeUpdateFormField({...this.fieldOptions, items: this.items}, 'fieldOptions');
    }

    /**
     * Get list of available validation rules. Translate title using type.
     */
    get availableRules(): IValidationRule[] {
      const validationRuleTypes = this.$store.state.validationRuleTypes ? this.$store.state.validationRuleTypes : [];
      const rules: IValidationRule[] =  [];
      validationRuleTypes.forEach(element => {
        // Create copy from state
        rules.push({
          title: this.$i18n.tc(`component.adminValidationManager.validation.types.${element.type}`),
          type: element.type,
          value: '',
          requiresValue: element.requiresValue
        });
      });
      return rules;
    }

    /**
     * Get validation rules for this field
     * @return {string} Validation rules separated with |
     */
    get validationRules(): string {
      if (this.validation && this.validation.rules && this.validation.rules.length > 0) {
        return this.validation.rules.map(s => s.type + (s.value ? ':' + s.value : '')).join('|');
      } else {
        return '';
      }
    }

    /**
     * Check if this field is required
     * @return {boolean} True if required, false if not
     */
    get isRequired(): boolean {
        return this.validationRules.indexOf('required') !== -1;
    }

    /**
     * Check if the value has any errors
     */
    get isError(): boolean {
      return this.$validator.errors.has(this.getValidationId, this.validationScope);
    }

    /**
     * Check if the value has changed and validation is correct
     */
    get isSuccess(): boolean {
      const field =  this.$validator.fields.find({ name: this.getValidationId, scope: this.validationScope });
      const isValid: boolean = field ? field.flags.valid : false;
      const isChanged: boolean = field ? field.flags.changed : false;
      return isValid && isChanged;
    }

    /**
     * Success icon to show if field is validated correctly
     */
    get getValidationIcon(): string {
      return this.isSuccess ? 'check_circle_outline' : '';
    }

    /**
     * Get validation id for field. Used by Vee-validation.
     * @return {string} Id for field used in validation
     */
    get getValidationId(): string {
      if (!this.validationScope) {
        // todo: fieldupload, something is wrong..
        console.error('Missing validationscope..' + this.id);
        return this.id.toString();
      }
      return this.validationScope.toString() + '.' + this.id;
    }

    /**
     * Throws the event further up
     */
    private onDoubleClick() {
      this.$emit('onDoubleClick', this);
    }

    /**
     * Updates store after a debounce
     * @param value The value we want to update in the store
     * @param property Name of the property we want to update. ex: 'title'
     */
    @Debounce(250)
    private storeDebounceUpdateFormField(value: any, property: string) {
      this.$store.commit(MutationType.UpdateFormField, { fieldId: this.id, newValue: value, fieldProperty: property} );
    }

    /**
     * Updates store NO debounce
     * @param value The value we want to update in the store
     * @param property Name of the property we want to update. ex: 'title'
     */
    private storeUpdateFormField(value: any, property: string) {
      this.$store.commit(MutationType.UpdateFormField, { fieldId: this.id, newValue: value, fieldProperty: property} );
    }
}
