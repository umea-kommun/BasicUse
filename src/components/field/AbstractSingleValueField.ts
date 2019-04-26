import { IFormAttribute } from './../../models/IForm';
import { Helper } from '@/utils/helper';
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { ISingleValueField, IItem } from '@/models/IForm';
import { IValidation, IValidationRule } from '@/models/IValidation';
import { FormMode, FormFieldType, MutationType } from '@/models/Enums';
import Debounce from 'debounce-decorator';
import data from '@/mock/data';

/**
 * Base class that represents a field based on a single value and implements ISingleValueField.
 */

@Component
export default class AbstractSingleValueField extends Vue {

  // Inject validation object
  @Inject('validator') public $validator: any;
  public type!: FormFieldType;

  // Set mode for field, for example EDIT, VIEW or ADMIN
  @Prop({ default: 'EDIT' }) public mode!: FormMode;

  // Reference to data for ISingleValueField in Vuex state.
  // Data from state should not be accessed with two way bindings but instead
  // through getters/setters.
  @Prop() public field!: ISingleValueField;

  // Set validation to scope stepId
  @Prop({ default: '' }) public validationScope!: string;

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
    this.storeUpdateFormField({...this.fieldOptions, validation: validation.rules}, 'fieldOptions');
  }

  get value(): string {
    return this.field.value;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set value(value: string) {
    this.storeUpdateFormField(value, 'value');
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
      return Array.prototype.map.call(this.validation.rules, s => s.type).join('|');
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
   * Validation icon to show if field was validated correctly or has error
   */
  get getValidationIcon(): string {
    return this.isSuccess ? 'check_circle_outline' : this.isError ? 'warning' : '';
  }

  /**
   * Get validation id for field. Used by Vee-validation.
   * @return {string} Id for field used in validation
   */
  get getValidationId(): string {
    return this.validationScope + '.' + this.id;
  }

  /**
   * Updates store NO debounce
   * @param value The value we want to update in the store
   * @param property Name of the property we want to update. ex: 'title'
   */
  protected storeUpdateFormField(value: any, property: string) {
    this.$store.commit(MutationType.UpdateFormField, { fieldId: this.id, newValue: value, fieldProperty: property} );
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
  private storeDebounceUpdateFormField(value: string|number, property: string) {
    this.$store.commit(MutationType.UpdateFormField, { fieldId: this.id, newValue: value, fieldProperty: property} );
  }
}

