import {
    IForm,
    IFormField,
    FieldTypeInterfaceMapp,
    IFormStep,
} from '@/models/IForm';
import { FormFieldType } from '@/models/Enums';


export const FormFieldLookup = {
  /**
   * Returns which type of interface this particular field implements
   * See also FormFieldInterface
   * @param formField
   */
  getInstanceOf(formField: IFormField): string {
      const requestedFormFieldType = formField.type.toLowerCase();
      let interfaceOutput: string = '';
      Object.keys(FieldTypeInterfaceMapp).forEach(formFieldInterface => {
          const types: FormFieldType[] = FieldTypeInterfaceMapp[formFieldInterface];
          const found = types.map(type => type.toLowerCase()).indexOf(requestedFormFieldType) > -1;
          if (found && interfaceOutput !== '') {
              throw new Error('Found multiple interfaces for the same formFieldType');
          } else if (found) {
              interfaceOutput = formFieldInterface;
          }
      });
      if (interfaceOutput === '') {
          throw new Error(
              `Interface could not be found for field of type "${formField.type}".
              Please check that you have added a mapping between fields of type "${formField.type}"
              and an appropriate interface to the "FieldTypeInterfaceMapp"`
          );
      }
      return interfaceOutput;
  }
};

export function findStepIndex(form: IForm, id) {
    const steps = form.attributes.steps;
    let stepIndex;
    for (let i = 0; i < steps.length; i++) {
        const foundFields = steps[i].fields.filter(field => field.id === id);
        if (foundFields.length > 0) {
            stepIndex = i;
            break;
        }
    }
    if (stepIndex === undefined) {
        throw new Error('Unable to find any step containing a field with id "' + id + '"');
    }
    return stepIndex;
}

export function findFormFieldInStep(form: IForm, stepIndex, id): IFormField {
    // Validate StepIndex
    if (stepIndex === undefined || stepIndex < 0) {
      throw new Error('Step could not be found!');
    }

    const found = form.attributes.steps[stepIndex].fields.filter(field => field.id === id);
    if (found.length === 0) {
        throw new Error('No field found with id ' + id);
    } else if (found.length > 1) {
        throw new Error('Found multiple fields with id=' + id);
    }
    return found[0] as IFormField;
}

export function findFormFieldByGuid(form: IForm, fieldGuid: string): IFormField {
  let found;
  form.attributes.steps.every(step => {
    found = step.fields.find(f => {
      return f.guid === fieldGuid;
    });
    return found ? false : true; // if found we return false, which breaks the iteration
  });
  if (!found) {
      throw new Error('No field found with guid ' + fieldGuid);
  }
  return found as IFormField;
}


/**
 * Return the step in store
 * @param form The form in store
 * @param stepId The stepid we are looking fore
 */
export function findStep(form: IForm, stepId): IFormStep {
  const steps = form.attributes.steps;
  const step = steps.find(step => step.id === stepId);
  if (step === undefined) {
      throw new Error(`Unable to find any step with id "${stepId}"`);
  }
  return step;
}

export function sleep(milliseconds): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
