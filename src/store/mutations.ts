import { MutationType } from './../models/Enums';
import { IForm, IGdprDataController, IReceiver, IGdpr, IUserContactInfo  } from './../models/IForm';
import { findStepIndex, FormFieldLookup, findFormFieldInStep, findStep} from '@/store/utils';
import {
  ISingleValueField,
  IRootState,
  IIntegration,
  IFormStep,
  IFormField
} from '@/models/IForm';
import { FormFieldInterface } from '@/models/Enums';
import { Helper } from '@/utils/helper';

export default {

  getGdpr: (state: IRootState, payload) => {
    state.gdpr = payload || [];
  },
  updateGdpr: (state: IRootState, payload) => {
    if (!state.gdpr) {
      throw new Error('Trying to update value when no form is present in the state store');
    }

    const index = state.gdpr.findIndex(
      f => f.id === payload.id
    );

    if (index === -1) {
      state.gdpr.push(payload);
    } else {
      try {
        state.gdpr.splice(index, 1, payload);
      } catch (error) {
        throw new Error('Unable to update gdpr ' + state.gdpr[index].title);
      }
    }
  },
  deleteGdpr: (state: IRootState, payload) => {
    if (!state.gdpr) {
      throw new Error('Trying to delete a gdpr when no gdpr is present in the state store!');
    }
    const gdprIndex = state.gdpr.findIndex(d => d.id === payload.id);
    if (gdprIndex > -1) {
      // Delete GDPR in store.
      state.gdpr.splice(gdprIndex, 1);
    } else {
      throw new Error('Could not find gdpr to delete in state store!');
    }
  },
  getValidationRuleTypes: (state: IRootState, payload) => {
    state.validationRuleTypes = payload;
  },
  getForms: (state: IRootState, payload) => {
    state.forms = payload;
  },
  getForm: (state: IRootState, payload: IForm | null) => {
    state.form = null;
    if (payload && payload.attributes.steps) {
      payload.attributes.steps.forEach(step => {
        step.fields = step.fields.sort((f1, f2) => f1.sortIndex - f2.sortIndex);
      });
    }
    state.form = payload;
    state.formHasUnsavedChanges = false;
  },
  getPm3: (state: IRootState, payload) => {
    state.pm3 = payload || [];
  },
  updatePm3: (state: IRootState, payload) => {
    if (!state.pm3) {
      throw new Error('Trying to update value when no form is present in the state store');
    }

    const index = state.pm3.findIndex(
      f => f.id === payload.id
    );

    if (index === -1) {
      state.pm3.push(payload);
    } else {
      try {
        state.pm3.splice(index, 1, payload);
      } catch (error) {
        throw new Error('Unable to update pm3 ' + state.pm3[index].title);
      }
    }
  },
  deletePm3: (state: IRootState, payload) => {
    if (!state.pm3) {
      throw new Error('Trying to delete a pm3 when no pm3 is present in the state store!');
    }
    const pm3Index = state.pm3.findIndex(d => d.id === payload.id);
    if (pm3Index > -1) {
      // Delete receiver in store.
      state.pm3.splice(pm3Index, 1);
    } else {
      throw new Error('Could not find pm3 to delete in state store!');
    }
  },
  getReceivers: (state: IRootState, payload) => {
    state.receivers = payload || [];
  },
  updatedReceiver: (state: IRootState, payload) => {
    if (!state.receivers) {
      throw new Error('Trying to update value when no form is present in the state store');
    }

    const index = state.receivers.findIndex(item => item.id === payload.id);

    if (index === -1) {
      state.receivers.push(payload);
    } else {
      try {
        state.receivers.splice(index, 1, payload);
      } catch (error) {
        throw new Error('Unable to update receiver ' + state.receivers[index].title);
      }
    }
  },
  deleteReceiver: (state: IRootState, payload) => {
    if (!state.receivers) {
      throw new Error('Trying to delete a receiver when no receivers is present in the state store!');
    }
    const receiverIndex = state.receivers.findIndex(d => d.id === payload.id);
    if (receiverIndex > -1) {
      // Delete receiver in store.
      state.receivers.splice(receiverIndex, 1);
    } else {
      throw new Error('Could not find receiver to delete in state store!');
    }
  },
  formSent: (state: IRootState, payload) => {
    state.result = payload;
  },
  truncateForm: (state: IRootState) => {
    state.form = null;
    state.formHasUnsavedChanges = false;
  },

  [MutationType.AddFormField]:
    (state: IRootState, o: { stepId: string, data: IFormField, nearFieldId: string | null }) => {
    if (!state.form) {
      throw new Error('Trying to update value when no form is present in the state store');
    }
    if (!o.data.id) {
      o.data.id = Helper.generateTempId();
    }
    if (!o.data.guid) {
      o.data.guid = Helper.generateUuid();
    }
    const step = findStep(state.form, o.stepId);
    if (o.nearFieldId) {
      // put field in an exact place in list
      const index = step.fields.findIndex(field => field.id === o.nearFieldId);
      step.fields.splice(index, 0, o.data);
    } else {
      // add field to list
      step.fields.push(o.data);
    }
    state.formHasUnsavedChanges = true;
  },

  /**
   * Update form field in state
   */
  updateFormField: (state: IRootState, { fieldId, newValue, fieldProperty }) => {
    if (!state.form) {
      throw new Error('Trying to update value when no form is present in the state store');
    }
    // Find stepIndex and field in state
    const stepIndex = findStepIndex(state.form, fieldId);
    const field = findFormFieldInStep(state.form, stepIndex, fieldId);
    // Update specific property on field in state
    if (fieldProperty !== undefined) {
      try {
        (field as any)[fieldProperty] = newValue;
        state.formHasUnsavedChanges = true;
      } catch (error) {
        throw new Error('Unable to update form field ' + field.title);
      }
    } else {
      console.warn('fieldProperty can not be undefined');
    }
  },

  deleteFormField: (state: IRootState, { fieldId }) => {
    if (!state.form || !state.form!.attributes.steps) {
      throw new Error('Trying to delete a field when no form or steps is present in the state store!');
    }
    const stepIndex = findStepIndex(state.form, fieldId);
    const field = findFormFieldInStep(state.form, stepIndex, fieldId);
    // Did we find a field.
    if (field) {
      const fields = state.form.attributes.steps[stepIndex].fields;
      const fieldIndex = fields.findIndex(d => d.id === fieldId);

      // Delete step in store.
      state.form.attributes.steps[stepIndex].fields.splice(fieldIndex, 1);
      state.formHasUnsavedChanges = true;
    } else {
      throw new Error('Could not find field to delete in state store!');
    }
  },
  /**
   * Add new step
   */
  addFormStep: (state: IRootState, { data }) => {
    if (state.form!.attributes!.steps) {
      const step: IFormStep = {
        // Generates new id with value less than 0
        id: Helper.generateTempId(),
        title: '',
        description: '',
        fields: [],
        type: 'step',
      };

      // Update if we passed in data that should be updated in the new step.
      if (data) {
        step.title = data.title ? data.title : step.title;
        step.description = data.description ? data.description : step.description;
      }
      // Add step
      state.form!.attributes.steps.push(step);
      state.formHasUnsavedChanges = true;
    } else {
      throw new Error('No steps in store!');
    }
  },
  /**
   * Update step information, does not update fields inside step!
   */
  updateFormStep: (state: IRootState, { id, propertyName, newValue }) => {
    if (state.form!.attributes!.steps && propertyName) {
      const step = findStep(state.form!, id);
      if (step) {
        state.formHasUnsavedChanges = true;
        step[propertyName] = newValue;
      } else {
        throw new Error('Could not find step to update!');
      }
    }
  },

  /**
   * Delete a step
   */
  deleteFormStep: (state: IRootState, { stepId }) => {
    if (state.form!.attributes!.steps && stepId) {
      const steps = state.form!.attributes.steps;
      if (!steps || steps.length === 0) {
        throw new Error('No steps in store to delete!');
      }
      const stepIndex = steps.findIndex(d => d.id === stepId);
      // Did we find a step.
      if (stepIndex >= 0) {
        // Delete step in store.
        state.formHasUnsavedChanges = true;
        state.form!.attributes.steps.splice(stepIndex, 1);
      } else {
        throw new Error('Could not delete last step in form!');
      }
    }
  },
  applyIntegrationData: (state: IRootState, { data, stepIndex, id }) => {
    if (state.form && data) {
      const field1 = findFormFieldInStep(state.form, stepIndex, id) as IIntegration;
      Object.keys(field1.dataMapping).forEach(key => {
        if (state.form) {
          const field2 = findFormFieldInStep(state.form, stepIndex, key);
          switch (FormFieldLookup.getInstanceOf(field2)) {
            case FormFieldInterface.SingleValueField:
              (field2 as ISingleValueField).value = data.attributes[key];
              break;
            default:
              throw new Error('Unable to update form field of type ' + field2.type);
          }
        }
      });
    }
  },

  /**
   * Updates a property on the form
   */
  updateFormProperty: (state: IRootState, { newValue, fieldProperty }) => {
    if (state.form!.attributes) {
      const formProperty = state.form!.attributes;
      // Update specific property on form
      if (fieldProperty !== undefined) {
        try {
          state.formHasUnsavedChanges = true;
          (formProperty as any)[fieldProperty] = newValue;
        } catch (error) {
          throw new Error('Unable to update form property ' + formProperty);
        }
      }
    }
  },

  /**
   * Updates integration on the form
   */
  updateFormIntegration: (state: IRootState, { integrationId, newValue }) => {
    if (!state.form) {
      throw new Error('Trying to update value when no form is present in the state store');
    }

    const integrations = state.form!.attributes.integrations;
    if (integrations) {
      const index = integrations.findIndex(
        f => f.id === integrationId
      );

      if (index === -1) {
        state.formHasUnsavedChanges = true;
        newValue.id = Helper.generateTempId();
        state.form!.attributes.integrations.push(newValue);
      } else {
        try {
          state.formHasUnsavedChanges = true;
          state.form!.attributes.integrations.splice(index, 1, newValue);
        } catch (error) {
          throw new Error('Unable to update integration ' + state.form!.attributes.integrations[index].id);
        }
      }
    }
  },

  /**
   * Delete integration on the form
   */
  deleteFormIntegration: (state: IRootState, { integrationId }) => {
    if (!state.form) {
      throw new Error('Trying to delete value when no form is present in the state store');
    }
    const index = state.form!.attributes.integrations.findIndex(f => f.id === integrationId);
    if (index > -1) {
      state.form!.attributes.integrations.splice(index, 1);
      state.formHasUnsavedChanges = true;
    } else {
      throw new Error('Could not find integration to delete in state store!');
    }
  },

  /**
   * Updates or create display rule
   */
  updateDisplayRule: (state: IRootState, { displayRuleGuid, newValue }) => {
    if (!state.form) {
      throw new Error('Trying to update value when no form is present in the state store');
    }
    const index = state.form.attributes.displayRules.findIndex(
      f => f.guid === displayRuleGuid
    );
    if (index === -1) {
      newValue.colorCode = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
      state.form!.attributes.displayRules.push(newValue);
    } else {
      try {
        state.form!.attributes.displayRules.splice(index, 1, newValue);
      } catch (error) {
        throw new Error('Unable to update display rule ' + state.form!.attributes.displayRules[index].guid);
      }
    }
    state.formHasUnsavedChanges = true;
  },

  /**
   * Delete display rule
   */
  deleteDisplayRule: (state: IRootState, { dispalyRuleGuid }) => {
    if (!state.form) {
      throw new Error('Trying to delete value when no form is present in the state store');
    }
    const index = state.form!.attributes.displayRules.findIndex(f => f.guid === dispalyRuleGuid);
    if (index > -1) {
      state.form!.attributes.displayRules.splice(index, 1);
      state.formHasUnsavedChanges = true;
      state.form.attributes.steps.forEach(step => {
        step.fields.forEach(element => {
        if (element.displayRuleGuid === dispalyRuleGuid) {
            element.displayRuleGuid = '';
         }
        });
      });
    } else {
      throw new Error('Could not find display rule to delete in state store!');
    }

  },

  /**
   * Updates users contact information
   */
  updateFormUserContactInfo: (state: IRootState, { newValue, item }) => {
    if (!state.user!.userContactInfo) {
      state.user!.userContactInfo = {} as IUserContactInfo;
    }
    const userContactInfo = state.user!.userContactInfo;
    (userContactInfo as any)[item] = newValue;
  },

  [MutationType.UserLogIn]: (state: IRootState, {jwtPayload, rawJwt}) => {
    const userContactInfo = {
      socialSecurityNumber: jwtPayload.socialSecurityNumber || '?',
      firstName: jwtPayload.firstName || '',
      lastName: jwtPayload.lastName || '',
      address: jwtPayload.address || '',
      postalNumber: jwtPayload.postalNumber || '',
      city: jwtPayload.city || '',
      phoneNumber: jwtPayload.phoneNumber || '',
      email: jwtPayload.email || ''
    } as IUserContactInfo;

    state.user = {...jwtPayload, userContactInfo, rawJwt};
  },

  [MutationType.UserLogOut]: (state: IRootState) => {
    state.user = null;
    state.form = null;
  },

  [MutationType.CopyField]: (state: IRootState, {fieldJson}) => {
    state.fieldCopyMemory.copiedField = fieldJson;
  },

  [MutationType.AddFieldIdToPasteHistory]: (state: IRootState, {idOfPastedField}) => {
    const history = state.fieldCopyMemory.history;
    history.push({idOfPastedField, time: new Date().getTime()});
    // We only need to remember a couple of the last pasted fields
    if (history.length > 10) {
      history.splice(0, 1); // remove first
    }
    state.fieldCopyMemory.history =  history;
  }

};
