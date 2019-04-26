import { IForm } from './../models/IForm';
import { Helper } from './../utils/helper';
import MockedDefaultData from '@/mock/data';
import MockAdapter from 'axios-mock-adapter';
import { FormStatus } from '@/models/Enums';

/**
 * Mockadapter för Axios. Tar hand om anrop till Axios och levererar mockdata istället för riktig data.
 */
export default function(axios) {
  const delay = 200;
  const mock = new MockAdapter(axios, { delayResponse: delay });
  const data = loadDataFromLocalStorage() || MockedDefaultData as any;
  const pm3 = data.forms.map(f => f.data.attributes.pM3);
  const receivers = data.forms.map(f => f.data.attributes.receiver);
  const gdprList: any[] = [];

  data.forms.forEach(f => {
    f.data.attributes.gDPR.dataControllers.forEach(gdpr => {
      gdprList.push(gdpr);
    });
  });

  mock.onGet(/\/forms\/\d+/).reply(config => {
    const url = config.url || '';
    const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
    const form = data.forms.find(f => f.id === id);
    if (form) {
      return [200, { form }];
    } else {
      return [404];
    }
  });

  mock.onGet(/\/form\-by\-path\/.+/).reply(config => {
    const url = config.url || '';
    const path = url.substr(url.lastIndexOf('/') + 1);
    const form = data.forms.find(f => f.data.attributes.path === path);
    if (form) {
      return [200, { form }];
    } else {
      return [404];
    }
  });

  mock.onGet('/forms').reply(config => {
    return [200, {  forms: data.forms }];
  });

  mock.onGet('/validationruletypes').reply(delay, {
    validationRuleTypes: data.validationRuleTypes
  });

  mock.onGet('/pm3').reply(delay, {
    pm3
  });

  mock.onGet('/receivers').reply(delay, {
    receivers
  });

  mock.onGet('/gdpr').reply(delay, {
    gdpr: gdprList
  });

  mock.onPost('/new-form').reply(config => {
    const formId = Helper.generateTempIdInteger() * -1;
    const newForm = {
      id: formId,
      errors: [],
      links: {},
      data: JSON.parse(config.data) as IForm,
    };
    newForm.data.type = 'form',
    newForm.data.id = formId.toString();
    newForm.data.attributes.steps[0].id = (Helper.generateTempIdInteger() * - 1).toString();
    Object.keys(data.forms[0].data.attributes).forEach(key => {
      if (key !== 'steps' && key !== 'path') {
        newForm.data.attributes[key] = data.forms[0].data.attributes[key] instanceof Array ? [] : '';
      }
    });
    newForm.data.attributes.status = FormStatus.Draft;
    newForm.data.attributes.gDPR = {
      dataControllers: []
    };
    newForm.data.attributes.createdBy = 'some-admin@website.com';
    newForm.data.attributes.created = new Date().toISOString();
    newForm.data.attributes.modified = new Date().toString();
    newForm.data.attributes.modifiedBy = 'some-admin@website.com';
    data.forms.push(newForm);
    saveDataToLocalStorage(data);
    return [201, {  form: newForm }];
  });

  mock.onPost(/\/update\-form\/\d+/).reply(config => {
    const url = config.url || '';
    const id = parseInt(url.substr(url.lastIndexOf('/') + 1), 10);
    const form = data.forms.find(f => f.id === id);
    const newData = JSON.parse(config.data);
    form.data = newData;
    form.data.id = id;
    form.data.attributes.modified = new Date().toISOString();
    form.data.attributes.modifiedBy = 'some-admin@website.com';
    saveDataToLocalStorage(data);
    if (form) {
      return [200, { form }];
    } else {
      return [404];
    }
  });

}

const loadDataFromLocalStorage = () => {
  const dataString = (window as any).localStorage.getItem('basicUseMockData');
  return dataString ? JSON.parse(dataString) : null;
};

const saveDataToLocalStorage = (data: any) => {
  (window as any).localStorage.setItem('basicUseMockData', JSON.stringify(data));
};

export const resetSavedMockData = () => {
  (window as any).localStorage.setItem('basicUseMockData', null);
};
