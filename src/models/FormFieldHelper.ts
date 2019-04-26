import { FormMode } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import { IFormField } from './IForm';

export default class FormFieldHelper {

  public static createEmptyField(fieldType: string): IFormField {
    const fieldTemplate = {} as IFormField;
    fieldTemplate.type = fieldType;
    fieldTemplate.id = Helper.generateTempId();
    fieldTemplate.guid = Helper.generateUuid();
    fieldTemplate.title = '';
    fieldTemplate.helpText = '';
    fieldTemplate.sortIndex = 0;
    fieldTemplate.mode = FormMode.Toolbox;
    fieldTemplate.fieldOptions = {};
    return fieldTemplate;
  }

  public static createFromCopy(originalField: IFormField): IFormField {
    const newField = Helper.deepCopy<IFormField>(originalField);
    newField.guid = Helper.generateUuid();
    // todo: this should in the future be taken away, we should only rely on guid
    newField.id = Helper.generateTempId();
    return newField;
  }
}
