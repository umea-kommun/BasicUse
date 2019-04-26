import { FieldCopyMemory } from './../models/IForm';
import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { IRootState } from '@/models/IForm';
import actions from './actions';
import mutations from './mutations';
import { getters } from './getters';
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const state = {
    pm3: null,
    form: null,
    user: null,
    result: null,
    forms: null,
    formHasUnsavedChanges: false,
    validationRuleTypes: null,
    receivers: null,
    gdpr: null,
    selectedDisplayRule: null,
    fieldCopyMemory: {
      copiedField: '',
      history: []
    } as FieldCopyMemory
};

// Persistera User-state i localStorage
const vuexPersistUser = new VuexPersist({
  key: 'VueAppUserStore',
  reducer: (state: IRootState) => ({ user: state.user, fieldCopyMemory: state.fieldCopyMemory }),
  storage: window.localStorage
});

/** Initialize Vuex store.
 * Strict-mode means that state could only be updated through mutations, otherwise throw an error.
 * Don't use strict mode in production due to performance cost.
 */
const store: StoreOptions<IRootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state,
  getters,
  mutations,
  actions,
  plugins: [vuexPersistUser.plugin as any]
};

export default new Vuex.Store<IRootState>(store);
