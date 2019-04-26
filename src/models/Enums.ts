/**
 * Tillgängliga typer av interface för formulärfält
 */
export enum FormFieldInterface {
    SingleValueField = 'SingleValueField',
    FileListField = 'FileListField',
    ItemListField = 'ItemListField'
}

/**
 * Tillgängliga typer av formulärfält, ex. TextBox, CheckBox etc.
 */
export enum FormFieldType {
    TextBox = 'FieldTextBox',
    TextArea = 'FieldTextArea',
    Section = 'FieldSection',
    SelectList = 'FieldSelectList',
    CheckBox = 'FieldCheckBox',
    RadioButton = 'FieldRadioButton',
    Integration = 'FieldIntegration',
    DatePicker = 'FieldDatePicker',
    FileUpload = 'FieldFileUpload'
}

export enum FormFieldIcon {
  FieldTextBox = 'short_text',
  FieldTextArea = 'view_headline',
  FieldSection = 'title',
  FieldSelectList = 'arrow_drop_down_circle',
  FieldCheckBox = 'check_box',
  FieldRadioButton = 'radio_button_checked',
  FieldIntegration = 'ballot',
  FieldDatePicker = 'date_range',
  FieldFileUpload = 'attachment'
}

/** Läge för formulär - visning, redigering, admin eller toolbox */
export enum FormMode {
    View = 'VIEW',
    Edit = 'EDIT',
    Admin = 'ADMIN',
    Toolbox = 'TOOLBOX'
}

/**
 * Typer av valideringar, mappar mot Vee-Validate
 */
export enum ValidationRuleType {
    Required = 'required',
    Length = 'length',
    OneOrMoreIsChecked = 'oneOrMoreIsChecked'
}

/**
 * DataControllers för GDPR, ex. nämnder inom kommunen
 */
export enum GdprDataController {
    Fritid = 'Fritidsnämnden',
    Bygg = 'Byggnadsnämnden',
    Teknik = 'Tekniska nämnden'
}

/** Status för integration, dvs hur processes går */
export enum IntegrationStatus {
    NotStarted = 'NotStarted',
    Started = 'Started',
    Success = 'Success',
    Error = 'Error'
}

/** Mutationtypes for store */
export enum MutationType {

  // Form
  GetForm = 'getForm',
  SendForm = 'sendForm',
  TruncateForm = 'truncateForm',
  UpdateFormProperty = 'updateFormProperty',

  // Form step
  AddFormStep = 'addFormStep',
  UpdateFormStep = 'updateFormStep',
  DeleteFormStep = 'deleteFormStep',

  // Form Field
  AddFormField = 'addFormField',
  UpdateFormField = 'updateFormField',
  DeleteFormField = 'deleteFormField',

  // Integration
  ApplyIntegrationData = 'applyIntegrationData',

  // User
  UserLogIn = 'userLogIn',
  UserLogOut = 'userLogOut',

  // Gdpr
  GetGdpr = 'getGdpr',
  UpdateGdpr = 'updateGdpr',
  DeleteGdpr = 'deleteGdpr',

  // Receivers
  GetReceivers = 'getReceivers',
  UpdatedReceiver = 'updatedReceiver',
  DeleteReceiver = 'deleteReceiver',

  // Field copying in admin
  CopyField = 'copyField',
  AddFieldIdToPasteHistory = 'addToPasteHistory'
}

/** Status för ett formulär */
export enum FormStatus {
  Draft = 'Draft',
  Published = 'Published',
  Unpublished = 'Unpublished'
}

/** ErrorCode som kommer från FormService */
export enum ErrorCode {
    FormPathNotUnique = 'FormPathNotUnique',
    FormNotFound = 'FormNotFound',
    FormNotPublished = 'FormNotPublished',
    FormNoPath = 'FormNoPath',
    MissingTitle = 'MissingTitle',
    CannotDeleteObject = 'CannotDeleteObject',
    MissingUrl = 'MissingUrl'
}

/**
 * Size for app content. Default is used to show a public form.
 * Wide is used to provide more space for content, for example in admin.
 */
export enum AppContentSize {
  Default = 'Default',
  Wide = 'Wide'
}

/**
 * Enum for aria roles, see http://karlgroves-sandbox.com/CheatSheets/ARIA-Cheatsheet.html about aria roles-
 */
export enum AriaRole {
  Alert = 'alert', // Show important and time sensitive information. Use for notifications, validation errors etc.
  Status = 'status', // Show status information whose content is of less importance as alert.
                    // Use for navigation information and feedback to user etc.
  Dialog = 'dialog' // Show a dialog that requires the user to enter information or require a response.

}
