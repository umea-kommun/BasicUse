import { IRootState } from '@/models/IForm';
import { GetterTree } from 'vuex';

export const getters: GetterTree<IRootState, IRootState> = {
  isLoggedInAdmin(state: IRootState): boolean {
    return !!state.user && state.user.isAdmin;
  },
  getFormLastSavedDate(state: IRootState): Date | null {
    if (state.form) {
      const dateString = state.form.attributes.modified || state.form.attributes.created;
      return new Date(dateString);
    }
    return null; // throw new Error('Trying to get save date of form but no form present in the store');
  }
};
