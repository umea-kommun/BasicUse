<template>
  <div class="admin-form-title">
    <!-- Title -->
    <v-text-field
      v-model="title"
      :title="title"
      :label="$t('component.adminFormProperties.properties.titleOnForm')"
      v-validate="'required'"
      data-vv-name="title"
      data-vv-scope="admin"
      :error-messages="errors.first('admin.title')"
      box
    ></v-text-field>

    <!-- Path -->
    <v-layout align-center row class="special-path-field">
      <div v-if="form.attributes.status === 'Published'" class="pb-4">
        {{ $t('component.adminFormProperties.publicLink') }}<br>
        <span class="grey--text">{{ getAbsoluteUrlToForm() }}</span>
      </div>
      <v-text-field
        v-model="path"
        v-if="form.attributes.status !== 'Published'"
        :label="$t('component.adminFormProperties.properties.path')"
        v-validate="'required'"
        data-vv-name="path"
        data-vv-scope="admin"
        :error-messages="errors.first('admin.path')"
        class="input--is-disabled"
        box
      ></v-text-field>
    </v-layout>
    <p style="padding: 0; margin:0; margin-top:-15px; text-align: right">
      <v-btn title="alt + s" small flat style="padding:0 3px; margin:0" @click="openPublicForm">
        <v-icon small class="mr-1">launch</v-icon> {{ $t('component.adminFormProperties.goToEservice') }}
      </v-btn>
    </p>
    <!-- Confirm opening e-service even though we have unsaved changes -->
    <base-confirm-dialog ref="confirmOpeningEservice"
      :title="$t('component.adminFormTitle.confirmOpenEserviceTitle')"
      :text="$t('component.adminFormTitle.confirmOpenEserviceText')" />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import {
  IFormProperties,
  IForm,
  IItem,
  IGdprDataController,
  IGdpr,
  IRootState
} from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { FormStatus, GdprDataController } from '@/models/Enums';
import { MutationType } from '@/models/Enums';
import { KeyBoardCommandMixin, KeyCommands } from '@/plugins/keyboard-command-mixin';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';

/**
 * Edit name of form in adminstration
 */
@Component({
  components: {
    BaseConfirmDialog
  },
  mixins: [KeyBoardCommandMixin]
})
export default class AdminFormTitle extends Vue {
  @Prop() public form!: IForm;

  /**
   * Run when component is created
   */
  public async created() {
    this.$on(KeyCommands.ALT_S, evt => { this.openPublicForm(); });
  }

  public async openPublicForm() {

    // Let used know that we're opening a e-service that has unsaved changes
    if (this.$store.state.formHasUnsavedChanges) {
      const openEvenThoughUnsaved = await (this.$refs.confirmOpeningEservice as BaseConfirmDialog).confirm();
      if (!openEvenThoughUnsaved) {
        return;
      }
    }

    if (this.form.attributes.status === FormStatus.Published) {
      window.open('/' + this.form.attributes.path);
    } else {
      const previewRoute = this.$router.resolve({ name: 'AppFormTest', params: {testFormId: this.form.id} });
      window.open(previewRoute.href);
    }
  }

  public getAbsoluteUrlToForm() {
    return window.location.protocol + '//' + window.location.host + '/' + this.form.attributes.path;
  }

  /**
   * Make a computed copy of form or create an empty form
   */
  get formCopy(): IForm {
    return this.form ? Helper.deepCopy<IForm>(this.form) : ({} as IForm);
  }

  /**
   * Get computed title on form
   */
  get title(): string {
    return this.formCopy.attributes.title;
  }

  /**
   * Set computed title on form
   */
  set title(newTitle: string) {
    this.formCopy.attributes.title = newTitle;
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: newTitle,
      fieldProperty: 'title'
    });
  }

  /**
   * Get computed path on form
   */
  get path(): string {
    return this.formCopy.attributes.path;
  }

  /**
   * Set computed path on form
   */
  set path(newPath: string) {
    this.formCopy.attributes.path = newPath;
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: newPath,
      fieldProperty: 'path'
    });
  }
}
</script>
<style scoped lang='scss'>
</style>