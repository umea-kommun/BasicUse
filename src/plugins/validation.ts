import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import i18n from '@/plugins/i18next';

/**
 * Installera Vee-Validate
 * @link https://baianat.github.io/vee-validate
 * Configuration of vee: https://baianat.github.io/vee-validate/configuration.html
 */
Vue.use(VeeValidate, {
  i18n,
  i18nRootKey: 'app.validation',
  // Default fieldsBagName is 'fields' https://github.com/ratiw/vuetable-2/issues/60
  fieldsBagName: 'veeFields',
  // When we leave a fild that is incorrect show validation error.
  events: 'input|blur',
  inject: true,
  delay: 125 // Debounce validation to improve performance
});

const Validation = {
  install() {
    /**
     * Validera om en eller flera kryssrutor är förbockade
     */
    Validator.extend('oneOrMoreIsChecked', {
      getMessage: (field, params, data) => 'The ' + field + ' value is not truthy.',
      validate: (value, params) => {
        let items;
        let checkedItems: number = 0;
        if (params.length > 0) {
          items = params[0];
        }
        if (items) {
          items.forEach(item => {
            if (item.isChecked) {
              checkedItems++;
            }
          });
        } else {
          return false;
        }
        return checkedItems > 0 ? true : false;
      }
    });
    /**
     * Validate filecount
     */
    Validator.extend('filesRequired', {
      getMessage: (field, params, data) => 'The ' + field + ' value is not truthy.',
      validate: (value, params) => {
        let fileCount: number|null = null;
        if (params.length > 0) {
          fileCount = params[0];
          if (fileCount && fileCount > 0) {
            return true;
          }
        }
        return false;
      }
    });
    /**
     * Validate array
     */
    Validator.extend('emailComboboxItem', {
      getMessage: (field, params, data) => 'The ' + field + ' value is not truthy.',
      validate: (value, params) => {
        let valid = true;
        /* tslint:disable */
        const regexp = new RegExp(
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        /* tslint:enable */
        value.forEach(element => {
          if (valid) {
            valid = !!regexp.exec(element.title);
          }
        });
        return valid;
      }
    });
    /**
     * Validate phonenumber
     */
    Validator.extend('phonenumber', {
      getMessage: (field, params, data) => 'The ' + field + ' value is not truthy.',
      validate: (value, params) => {
        let valid = true;
        /* tslint:disable */
        const regexp = new RegExp(/^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/);
        /* tslint:enable */
        valid = !!regexp.exec(value);
        return valid;
      }
    });
  }
};
export default Validation;
