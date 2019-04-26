import * as Enums from '@/models/Enums';
import { IValidationRule } from './IValidation';

/**
 * Beskriver metadata för formulär
 */
export default class FormMetaDataModel {
  public id: string;
  public title: string;
  public description: string;

  constructor(id: string, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }
}

/**
 * Datastructure of a form/e-service
 */
export interface IForm {
  type: string;
  id: string;
  attributes: IFormAttribute;
}

/**
 * Interface for the message that can be sent to backend
 */
export interface IFormMessage {
  form: IForm;
  userContactInfo: IUserContactInfo;
  id: string;
}

/**
 * Interface for IUserContactInfo
 */
export interface IUserContactInfo {
  socialSecurityNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  postalNumber: string;
  city: string;
  phoneNumber: string;
  email: string;
}

/**
 * User En inloggad användare
 */
export interface IUser {
  socialSecurityNumber: string;
  fullName: string;
  firstName: string;
  lastName: string;
  rawJwt: string;
  email: string|null;
  scope: string[];
  isAdmin: boolean;
  userContactInfo: IUserContactInfo|null;

  /**
   * Unix timestamp telling when user session expires
   */
  exp?: number;
}

/**
 * Attribut-data för ett formulär
 */
export interface IFormAttribute {
  title: string;
  description: string;
  allowsAnonymousSender: boolean;
  path: string;
  gDPR: IGdprDataController;
  status: Enums.FormStatus;
  pM3: any;
  receiver: any;
  integrations: IFormIntegration[];
  displayRules: IDisplayRule[];
  steps: IFormStep[];
  modified: string; // date string
  modifiedBy: string;
  created: string; // date string
  createdBy: string;
}

/**
 * Datastrukturen för varje steg i fomuläret
 */
export interface IFormStep {
  type: string;
  id: string;
  title: string;
  description: string;
  fields: Array<ISingleValueField | IItemListField | IFileListField | IIntegration | IFormField>;
}

/**
 * Datastrukturen för GDPR i formuläret
 */
export interface IGdprDataController {
  dataControllers: IGdpr[];
}

/**
 * Datastrukturen för GDPR data-controllers i formuläret
 */
export interface IGdpr {
  type: string;
  id: number;
  title: string;
  url: string;
}

/**
 * Bas-interface för fält i ett formulär
 */
export interface IFormField {
  type: Enums.FormFieldType | string;
  id: string;
  guid: string;
  title: string;
  helpText: string;
  sortIndex: number;
  mode: Enums.FormMode | string;
  fieldOptions: any;
  displayRuleGuid: string;
}

 /**
  * Interface för den enklaste formen av fält, som bara har ett värde
  */
export interface ISingleValueField extends IFormField {
  value: string;
  fieldOptions: IFieldOptions;
}

/**
 * Interface för fält som håller en lista med alternativ
 */
export interface IItemListField extends IFormField {
  fieldOptions: IItemFieldOptions;
}

export interface IItem {
    title?: string;
    isChecked?: boolean;
    value?: string;
    id?: number;
}

/**
 * Interface för fält med en lista av filer.
 */
export interface IFileListField extends ISingleValueField {
  files?: IPondFile[];
  fieldOptions: IFileFieldOptions;
}

export interface IFieldOptions {
  validation?: | IValidationRule[];
}

export interface IItemFieldOptions extends IFieldOptions {
  items?: IItem[];
}
export interface IFileFieldOptions extends IFieldOptions {
  maxFiles?: number;
  allowMultiple?: boolean;
  fileTypeValidation?: string;
}

export interface IPondFile {
  options: IPondOption;
}

export interface IPondOption {
  type: string;
  file: File;
}

export interface IPm3 {
  id?: number;
  title: string;
}
export interface IReceiver {
  id: number;
  title: string;
  url: string;
}

/**
 * Interface för komponenter som kan mappa extern (integrerad) data
 * mot fält i formuläret
 */
export interface IIntegration extends ISingleValueField {
  serviceUrl: string;
  dataMapping: any;
}

/** Interface för resultatat av ett anrop till integration */
export interface IIntegrationResult {
  errors?: IError[];
  data?: IIntegrationResultData;
}

/** Interface för data i integrationsresultatet */
export interface IIntegrationResultData {
  type: string;
  id: string;
  attributes?: any;
}

/**
 * Interface för en integration
 */
export interface IFormIntegration {
  id: number;
  type: string;
  options: IFormIntegrationOption[];
}


/**
 * Interface för en intergrations inställningar
 */
export interface IFormIntegrationOption {
  id?: number;
  key: string;
  value: string;
}


/**
 * Interface för visningsregel, kopplingsbara frågor
 */
export interface IDisplayRuleQuestion {
  fieldGuid: string;
  fieldTitle: string;
  responseItems: IItem[];
  isChecked?: boolean;
}
/**
 * Interface för visningsregel, svarsalternativ
 */
export interface IDisplayRuleResponse {
  fieldOptionId: number;
  fieldOptionTitle: string;
  isChecked?: boolean;
}
/**
 * Interface för data i visningsregeldata
 */
export interface IDisplayRule {
  id?: number;
  guid: string;
  title: string;
  fieldGuid: string;
  fieldOptionId: number;
  formId: number;
  colorCode: string;
}

/** Generellt interface för ett felmeddelande */
export interface IComboboxItem {
  title: string;
  color: string;
}

/** Generellt interface för ett felmeddelande */
export interface IError {
  status: number;
  code: number;
  title: string;
}

export interface FieldCopyMemory {
  copiedField: string;
  history: any[];
}

/**
 * State för vuex-store
 */
export interface IRootState {
  form: null | IForm;
  user: null | IUser;
  forms: null | IForm[];
  formHasUnsavedChanges: boolean;
  validationRuleTypes: null | IValidationRule[];
  pm3: null | IPm3[];
  receivers: null | IReceiver[];
  result: any;
  gdpr: null | IGdpr[];
  fieldCopyMemory: FieldCopyMemory;
}

export const FieldTypeInterfaceMapp: { [FormFieldInterface: string]: Enums.FormFieldType[]; } = {
  [Enums.FormFieldInterface.SingleValueField]: [
    Enums.FormFieldType.TextBox,
    Enums.FormFieldType.DatePicker,
    Enums.FormFieldType.TextArea,
    Enums.FormFieldType.Integration,
    Enums.FormFieldType.Section
  ],
  [Enums.FormFieldInterface.FileListField]: [
    Enums.FormFieldType.FileUpload
  ],
  [Enums.FormFieldInterface.ItemListField]: [
    Enums.FormFieldType.CheckBox,
    Enums.FormFieldType.RadioButton,
    Enums.FormFieldType.SelectList
  ]
};

/**
 * Interface för tabellrubriker
 */
export interface IHeader {
  text: string;
  align?: string;
  sortable?: boolean;
  value: string;
}

/**
 * Interface för tabellraderna
 */
export interface IListItem {
  id: string;
  path: string;
  value: boolean;
  title: string;
  receiver: string;
  status: string;
  statustext: string;
  savedDate: string;
}

/**
 * Interface for breadcrumbs
 */
export interface IBreadCrumb {
  name: string;
  text: string;
  disabled: boolean;
  to: string;
}

/**
 * Interface for AdminFormProperies
 */
export interface IFormProperties {
  title: string;
  path: string;
  status: string;
}

/**
 * Interface for IFormStatus
 */
export interface IFormStatus {
  statusText?: string;
  statusColorBg?: string;
  statusColorText?: string;
}
