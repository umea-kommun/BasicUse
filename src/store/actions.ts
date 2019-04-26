import { MutationType } from '@/models/Enums';
import { Helper } from './../utils/helper';
import { getters } from './getters';
import { FormStatus, ErrorCode } from './../models/Enums';
import { IFormStep, IPondFile, IUser, IForm, IPm3, IReceiver, IGdpr, IFormMessage } from './../models/IForm';
import Axios from 'axios';
import { findStepIndex, sleep } from '@/store/utils';
import setupMock from '@/store/mock';

// Mock backend used to fetch form data
const mockedAxios = Axios.create();
setupMock(mockedAxios);
const isMocked = (process.env.VUE_APP_MOCK_DATA || '').trim() === 'yes';

export default {

  async getGdprList(context) {
    if (context.state.gdpr === null) {
      let response;
      if (isMocked) {
        response = await mockedAxios.get('/gdpr');
      } else {
        response = await Axios.get(process.env.VUE_APP_GDPR_API_ROUTE);
      }
      context.commit('getGdpr', response.data.gdpr);
    }
  },

  async createGdpr(context, payload: { gdpr: IGdpr }) {
    if (isMocked) {
      context.commit('updateGdpr', payload.gdpr);
      return;
    }
    try {
      const response = await Axios.post(
        process.env.VUE_APP_GDPR_API_ROUTE,
        JSON.stringify(payload.gdpr),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        }
      );
      context.commit('updateGdpr', response.data.gdpr);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },
  async updateGdpr(context, payload: { gdpr: IGdpr }) {
    if (isMocked) {
      context.commit('updateGdpr', payload.gdpr);
      return;
    }
    try {
      const response = await Axios.patch(process.env.VUE_APP_GDPR_API_ROUTE +
        '/' + payload.gdpr.id, JSON.stringify(payload.gdpr), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        });
      context.commit('updateGdpr', response.data.gdpr);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },
  async deleteGdpr(context, payload: { gdpr: IGdpr }) {
    if (isMocked) {
      context.commit('deleteGdpr', payload.gdpr);
      return;
    }
    try {
      const response = await Axios.delete(process.env.VUE_APP_GDPR_API_ROUTE + '/' + payload.gdpr.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.user.rawJwt
        }
      });
      context.commit('deleteGdpr', payload.gdpr);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },
  async getValidationRuleTypes(context) {
    const response = await mockedAxios.get('/validationruletypes');
    context.commit('getValidationRuleTypes', response.data.validationRuleTypes);
  },
  async getForms(context) {
    let response;
    if (isMocked) {
      response = await mockedAxios.get('/forms');
    } else {
      response = await Axios.get(process.env.VUE_APP_FORM_API_ROUTE);
    }
    context.commit('getForms', response.data.forms.map(f => f.data));
  },
  async getPm3List(context) {
    if (context.state.pm3 === null) {
      if (isMocked) {
        const response = await mockedAxios.get('/pm3');
        context.commit('getPm3', response.data.pm3);
      } else {
        const response = await Axios.get(process.env.VUE_APP_PM3_API_ROUTE);
        context.commit('getPm3', response.data.pm3);
      }
    }
  },
  async createPm3(context, payload: { pm3: IPm3 }) {
    try {
      const response = await Axios.post(
        process.env.VUE_APP_PM3_API_ROUTE,
        JSON.stringify(payload.pm3),
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        }
      );
      context.commit('updatePm3', response.data.pm3);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },
  async updatePm3(context, payload: { pm3: IPm3 }) {
    try {
      const response = await Axios.patch(process.env.VUE_APP_PM3_API_ROUTE +
        '/' + payload.pm3.id, JSON.stringify(payload.pm3), {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        });
      context.commit('updatePm3', response.data.pm3);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },
  async deletePm3(context, payload: { pm3: IPm3 }) {
    try {
      const response = await Axios.delete(process.env.VUE_APP_PM3_API_ROUTE + '/' + payload.pm3.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.user.rawJwt
        }
      });
      context.commit('deletePm3', payload.pm3);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errorCode) {
        throw err.response.data.errorCode;
      }
      throw err;
    }
  },

  async getReceiverList(context) {
    if (context.state.receivers === null) {
      let response;
      if (isMocked) {
        response = await mockedAxios.get('/receivers');
      } else {
        response = await Axios.get(process.env.VUE_APP_RECEIVER_API_ROUTE);
      }
      context.commit('getReceivers', response.data.receivers);
    }
  },

  async createReceiver(context, payload: { receiver: IReceiver }) {
    if (isMocked) {
      payload.receiver.id = Helper.generateTempIdInteger();
      context.commit('updatedReceiver', payload.receiver);
    } else {
      try {
        const response = await Axios.post(
          process.env.VUE_APP_RECEIVER_API_ROUTE,
          JSON.stringify(payload.receiver),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + context.state.user.rawJwt
            }
          }
        );
        context.commit('updatedReceiver', response.data.receiver);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errorCode) {
          throw err.response.data.errorCode;
        }
        throw err;
      }
    }
  },
  async updateReceiver(context, payload: { receiver: IReceiver }) {
    if (isMocked) {
      context.commit('updatedReceiver', payload.receiver);
    } else {
      try {
        const response = await Axios.patch(process.env.VUE_APP_RECEIVER_API_ROUTE +
          '/' + payload.receiver.id, JSON.stringify(payload.receiver), {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + context.state.user.rawJwt
            }
          });
        context.commit('updatedReceiver', response.data.receiver);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errorCode) {
          throw err.response.data.errorCode;
        }
        throw err;
      }
    }
  },
  async deleteReceiver(context, payload: { receiver: IReceiver }) {
    if (isMocked) {
      context.commit('deleteReceiver', payload.receiver);
    } else {
      try {
        const response = await Axios.delete(process.env.VUE_APP_RECEIVER_API_ROUTE + '/' + payload.receiver.id, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        });
        context.commit('deleteReceiver', payload.receiver);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errorCode) {
          throw err.response.data.errorCode;
        }
        throw err;
      }
    }
  },

  async createForm(context) {
    if (!context.getters.isLoggedInAdmin) {
      throw new Error('Trying to create form but is not logged in as admin');
    }
    const form = { attributes: {} } as IForm;
    const step = {} as IFormStep;
    step.fields = [];
    step.title = 'Steg...';
    form.attributes.path = 'form-' + new Date().toISOString().replace(' ', '');
    form.attributes.steps = [step];
    const json = JSON.stringify(form);
    let response;
    if (isMocked) {
      response = await mockedAxios.post('/new-form', json);
    } else {
      response = await Axios.post(process.env.VUE_APP_FORM_API_ROUTE, json, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + context.state.user.rawJwt
        }
      });
    }
    return response.data.form.id;
  },
  async updateForm(context) {
    if (!context.getters.isLoggedInAdmin) {
      throw new Error('Trying to update form but is not logged in as admin');
    }
    if (!context.state.form) {
      throw new Error('Trying to update form, but no form is present in state');
    }
    // Update sort index
    const formData = Helper.deepCopy(context.state.form) as IForm;
    formData.attributes.steps.forEach(step => {
      let i = 1;
      (step.fields || []).forEach(field => {
        field.sortIndex = i++;
      });
    });
    const json = JSON.stringify(formData);
    let response;
    if (isMocked) {
      response = await mockedAxios.post('/update-form/' + context.state.form.id, json);
      context.commit('getForm', response.data.form.data);
    } else {
      try {
        response = await Axios.patch(process.env.VUE_APP_FORM_API_ROUTE + '/' + context.state.form.id, json, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + context.state.user.rawJwt
          }
        });
        context.commit('getForm', response.data.form.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.errorCode) {
          throw err.response.data.errorCode;
        }
        throw err;
      }
    }
  },
  async getForm(context, { id }) {
    // Do not reload form state if user has this particular form in the store already
    if (!context.state.form || (context.state.form.id !== null && context.state.form.id !== id)) {
      let response;
      if (isMocked) {
        response = await mockedAxios.get('/forms/' + id);
      } else {
        response = await Axios.get(process.env.VUE_APP_FORM_API_ROUTE + '/' + id);
      }
      context.commit('getForm', response.data.form.data);
    }
  },
  async getFormByPath(context, { path }) {
    if (isMocked) {
      if (!context.state.form || (context.state.form.id !== null && context.state.form.id !== path)) {
        const response = await mockedAxios.get('/form-by-path/' + path);
        context.commit('getForm', response.data.form.data);
      }
    } else {
      const response = await Axios.get(process.env.VUE_APP_FORM_API_ROUTE + '/?pathFilter=' + encodeURIComponent(path));
      if (response.status !== 200 || !response.data.forms || !(response.data.forms instanceof Array)) {
        throw new Error('Unexpected response from server when trying to fetch list of forms filtered on path');
      } else if ((response.data as any).forms.length === 0) {
        throw new Error(ErrorCode.FormNotFound);
      } else {
        // Do not reload form state if user has this particular form in the store already
        if (!context.state.form || context.state.form.attributes.path !== path) {
          const form = (response.data as any).forms[0].data as IForm;
          if (form.attributes.status !== FormStatus.Published) {
            throw new Error(ErrorCode.FormNotPublished);
          }
          context.commit('getForm', form);
        }
      }
    }
  },
  async getIntegrationData(context, { id, serviceUrl }) {
    if (!context.state.form) {
      throw new Error('Trying to update value when no form is present in the state store');
    }
    const stepIndex = findStepIndex(context.state.form, id);
    const response = await mockedAxios.get(serviceUrl);
    if (response.data.data) {
      context.commit('applyIntegrationData', { data: response.data.data, stepIndex, id });
    } else {
      throw new Error(response.data.console.error.title);
    }
  },
  async getPdf(context, { form, userContactInfo }): Promise<Blob> {
    if (isMocked) {
      return new Blob();
    } else {
      const json = JSON.stringify({form, userContactInfo});
      const response = await Axios.post(process.env.VUE_APP_FORM_API_ROUTE + '/pdf', json, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        responseType: 'blob'
      });
      return response.data;
    }
  },
  async sendFormToTestIntegrations(context, { blob }) {
    const apiUrl = process.env.VUE_APP_TEST_SEND_FORM_API_URL;
    if (!apiUrl && !isMocked) {
      throw new Error('Config parameter VUE_APP_TEST_SEND_FORM_API_URL not declared');
    }
    return await sendFormToServer(context, apiUrl, blob);
  },
  async sendForm(context, { blob }) {
    const apiUrl = process.env.VUE_APP_SEND_FORM_API_URL;
    if (!apiUrl && !isMocked) {
      throw new Error('Config parameter VUE_SEND_FORM_API_URL not declared');
    }
    return await sendFormToServer(context, apiUrl, blob);
  }
};
const sendFormToServer = async (context, apiUrl, formPdfBlob) => {

  if (isMocked) {
    context.commit('formSent', {});
    return;
  }

  const form = new FormData();
  let uploadIndex = 1;
  const formMessage = {
    form: Helper.deepCopy(context.state.form),
    userContactInfo: context.state.user.userContactInfo,
    id: Helper.generateUuid()
  } as IFormMessage;

  // Add formMessage as json file
  const jsonFile = new Blob(
    [JSON.stringify(formMessage)],
    { type: 'application/vnd.umeakommun.basicUseformmessage+json' }
  );
  form.append('upload' + uploadIndex, jsonFile, 'form.json');

  // Append pdf-blob
  uploadIndex++;
  form.append('upload' + uploadIndex, formPdfBlob, 'formular.pdf');

  // Append files to be uploaded
  context.state.form.attributes.steps.forEach(step => {
    (step as IFormStep).fields.forEach((field: any) => {
      (field.files || []).forEach((element: IPondFile) => {
        if (element.options && element.options.file) {
          uploadIndex++;
          form.append('upload' + uploadIndex, element.options.file);
        }
      });
    });
  });
  // Request backend with retries in case of network error (app being disabled
  // or loss of internet connection)
  let tries = 4;
  let response;
  while (tries > 0) {
    try {
      response = await Axios.post(apiUrl, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + context.state.user.rawJwt
        }
      });
      tries = 0;
    } catch (err) {
      tries--;
      if (err.response && err.response.status === 401) {
        alert('Du har blivit utloggad under pågående arbete');
        // will probably never happen!
        // todo: show popup that lets you either throw away the form data or login and comeback to form
        throw err;
      }
      if (err.message !== 'Network Error' || tries < 1) {
        throw err;
      } else {
        window.console.warn('Network error, attempting retry');
      }
      await sleep(2000 * tries);
    }
  }
  if (response.status >= 200 && response.status < 300) {
    if (!response.data || response.data.id !== 'form-result') {
      throw new Error('Got unexpected json from server');
    } else {
      context.commit('formSent', response.data);
    }
  } else {
    throw new Error('Got unexpected response status from server: ' + response.status);
  }

  return true;
};
