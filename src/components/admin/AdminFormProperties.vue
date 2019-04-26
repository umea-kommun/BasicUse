<template>
  <div class="admin-form-properties">
      
    <!-- Status (published/draft) -->
    <v-select
      v-model="formStatus"
      :items="formStatuses"
      item-value="value"
      item-text="label"
      :label="$t('component.adminFormProperties.properties.status')"
      box
      @change="$emit('statusUpdate')"
    ></v-select>

    <!-- Description -->
    <v-text-field
      v-model="descriptionStrippedHtml"
      :hint="$t('component.adminFormProperties.properties.descriptionHelpText')"
      :label="$t('component.adminFormProperties.properties.description')"
      v-validate="'required'"
      data-vv-name="description"
      data-vv-scope="admin"
      :error-messages="errors.first('admin.description')"
      append-icon="border_color"
      @keydown.enter.native="openEditDescriptionDialog"
      @keydown.space.native.prevent="openEditDescriptionDialog"
      @click="openEditDescriptionDialog"
      @click:append="openEditDescriptionDialog"
      :readonly="true"
      box
    ></v-text-field>

    <!-- Dialog edit description -->
    <v-dialog
      transition="slide-y-transition"
      v-model="isShowEditDescriptionDialog"
      persistent
      @keydown.esc="isShowEditDescriptionDialog = false"
      maxWidth="1000px"
    >
      <v-card>
        <v-card-title>
          <strong>{{ $t("component.adminFormProperties.descriptionDialog.title") }}</strong>
        </v-card-title>
        <v-card-text>
          <base-html-editor v-model="descriptionInDialog"></base-html-editor>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="error"
            @click="isShowEditDescriptionDialog = false"
            v-bind:title="$t('app.nav.cancel')"
          >{{ $t("app.nav.cancel") }}</v-btn>
          <v-btn
            flat
            @click="onDescriptionOkSaveClick(true, $event)"
            v-bind:title="$t('app.nav.ok')"
          >{{ $t("app.nav.ok") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Receivers -->
    <v-layout align-center row class="receiver-field">
      <v-select
        v-model="selectedRecieverItem"
        :items="receiverItems"
        item-value="id"
        item-text="title"
        :return-object="true"
        :label="$t('component.adminFormProperties.properties.receiver')"
        v-validate="'required'"
        data-vv-name="receiver"
        data-vv-scope="admin"
        :error-messages="errors.first('admin.receiver')"
        box
      ></v-select>
    </v-layout>

    <!-- PM3  -->
    <v-layout align-center row class="pm3-field">
      <v-select
        v-model="selectedPm3Item"
        :items="pm3Items"
        item-value="id"
        item-text="title"
        :return-object="true"
        :label="$t('component.adminFormProperties.properties.pm3')"
        v-validate="'required'"
        data-vv-name="pm3"
        data-vv-scope="admin"
        :error-messages="errors.first('admin.pm3')"
        box
      ></v-select>
    </v-layout>

    <v-layout>
      <!-- gdpr -->
      <v-select
        v-model="selectedGdprItem"
        :items="gdprItems"
        item-value="id"
        item-text="title"
        chips
        :return-object="true"
        :label="$t('component.adminFormProperties.properties.gdpr')"
        v-validate="'required'"
        data-vv-name="gdpr"
        data-vv-scope="admin"
        :data-vv-as="$t('component.adminFormProperties.properties.gdpr')"
        :error-messages="errors.first('admin.gdpr')"
        multiple
      >
        <template slot="no-data">
          <v-layout>
            <label>&nbsp;&nbsp;{{$t('component.adminFormProperties.gdprNoData')}}</label>
          </v-layout>
        </template>
      </v-select>
    </v-layout>
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
import BaseHtmlEditor from '@/components/base/BaseHtmlEditor.vue';
import { KeyBoardCommandMixin, KeyCommands } from '@/plugins/keyboard-command-mixin';

/**
 * Edit properties in adminstration
 */
@Component({
  components: {
    BaseHtmlEditor
  },
  mixins: [KeyBoardCommandMixin]
})
export default class AdminFormProperties extends Vue {
  @Prop() public form!: IForm;

  private isShowEditDescriptionDialog: boolean = false;
  private descriptionInDialog: string = '';
  private showAdvancedProperties: boolean = false;

  /**
   * Run when component is created
   */
  public async created() {
    this.$on(KeyCommands.ALT_S, evt => { this.openPublicForm(); });
    this.showAdvancedProperties = window.localStorage.getItem('adminshowAdvancedProperties') === 'on';
    await this.$store.dispatch('getPm3List');
    await this.$store.dispatch('getGdprList');
    await this.$store.dispatch('getReceiverList');
  }

  public openPublicForm() {
    if (this.form.attributes.status === FormStatus.Published) {
      window.open('/' + this.form.attributes.path);
    } else {
      this.openTestLink();
    }
  }

  public toggleAdvancedProperties() {
    this.showAdvancedProperties = !this.showAdvancedProperties;
    window.localStorage.setItem('adminshowAdvancedProperties', this.showAdvancedProperties ? 'on' : 'off');
  }

  public getAbsoluteUrlToForm() {
    return window.location.protocol + '//' + window.location.host + '/' + this.form.attributes.path;
  }

  get formStatuses() {
    return [
      {value: FormStatus.Draft, label: this.$t('component.adminFormProperties.draft')},
      {value: FormStatus.Published, label: this.$t('component.adminFormProperties.published')},
      {value: FormStatus.Unpublished, label: this.$t('component.adminFormProperties.unPublished')},
    ];
  }

  get formStatus() {
    return this.form.attributes.status;
  }

  set formStatus(newStatus) {
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: newStatus,
      fieldProperty: 'status'
    });
  }

  get gdprItems() {
    if (this.$store.state.gdpr !== null) {
      const temp: IItem[] = [];
      this.$store.state.gdpr.forEach(element => {
        temp.push({
          id: element.id,
          title: element.title,
          value: element.url,
          isChecked: false
        });
      });
      return this.sortArrayList(temp);
    } else {
      return [] as IItem[];
    }
  }

  /** Get selected item in pm3
   * @return {IItem} Item that is selected
   */
  get selectedGdprItem(): IItem[] {
    // Check if form have a gdpr
    const temp: IItem[] = [];
    if (this.formCopy.attributes.gDPR.dataControllers.length > 0) {
      this.formCopy.attributes.gDPR.dataControllers.forEach(item => {
        this.gdprItems.forEach(element => {
          if (Number(item.id) === element.id) {
            temp.push({
              id: element.id,
              title: element.title,
              isChecked: element.isChecked,
              value: element.value
            });
          }
        });
      });
    }
    return temp as IItem[];
  }

  /**
   * Set selected items in mutation to form for PM3.
   * @param {IItem} item - Item that is selected in PM3
   */
  set selectedGdprItem(selectedItems: IItem[]) {
    // Send items to store
    const selectedIds: number[] = selectedItems.map(i => i.id || -1) || [];
    const availableGpdrs = (this.$store.state as IRootState).gdpr;
    if (!availableGpdrs) {
      throw new Error('Nop gdprs fetched from backend');
    }
    const temp: IGdpr[] = availableGpdrs.filter((gdpr: IGdpr) => {
      if (selectedIds.indexOf(gdpr.id) > -1) {
        return Helper.shallowCopy(gdpr);
      }
    });
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: { dataControllers: temp },
      fieldProperty: 'gDPR'
    });
  }

  /**
   * Make a computed copy of form or create an empty form
   */
  get formCopy(): IForm {
    return this.form ? Helper.deepCopy<IForm>(this.form) : ({} as IForm);
  }

  /**
   * Get computed description on form
   */
  get description(): string {
    return this.formCopy.attributes.description;
  }

  /**
   * Get description without html
   */
  get descriptionStrippedHtml(): string {
    const html = document.createElement('div');
    html.innerHTML = this.description;
    return html.innerText;
  }

  /**
   * Click to alter description
   */
  public openEditDescriptionDialog() {
    // Create a copy the text that we can work with.
    this.descriptionInDialog = Helper.deepCopy<string>(this.description);
    this.isShowEditDescriptionDialog = true;
  }

  /**
   * Click Ok in description dialog
   */
  public onDescriptionOkSaveClick(isCloseDialog: boolean, event: Event) {
    try {
      // Save description to store
      this.$store.commit(MutationType.UpdateFormProperty, {
        newValue: this.descriptionInDialog,
        fieldProperty: 'description'
      });
    } catch (error) {
      const errMsg = '';
      this.$emit('onError', {
        error: new Error('Could not update form-description in store!'),
        errorDisplayMessage: errMsg
      });
    }

    if (isCloseDialog) {
      this.isShowEditDescriptionDialog = false;
    }
  }

  /**
   * Get pm3Items from state
   * @return {IItem[]} A list with pm3Items
   */
  get pm3Items(): IItem[] {
    if (this.$store.state.pm3 !== null) {
      const temp: IItem[] = [];
      this.$store.state.pm3.forEach(element => {
        temp.push({
          id: element.id,
          title: element.title,
          value: '',
          isChecked: false
        });
      });
      return this.sortArrayList(temp);
    } else {
      return [] as IItem[];
    }
  }

  /** Get selected item in pm3
   * @return {IItem} Item that is selected
   */
  get selectedPm3Item(): IItem {
    // Check if form have a pm3
    if (this.formCopy.attributes.pM3) {
      return this.pm3Items.find(
        item => item.title === this.formCopy.attributes.pM3.title
      ) as IItem;
    }
    return this.pm3Items.find(item => item.isChecked || false) as IItem;
  }

  /**
   * Set selected items in mutation to form for PM3.
   * @param {IItem} item - Item that is selected in PM3
   */
  set selectedPm3Item(selectedItem: IItem) {
    // We must update isChecked since this isn't done when binding.
    this.pm3Items.forEach(item => {
      let isChecked = false;
      // We could set item.isChecked direct, but this way we only change the one that needs change?
      isChecked = item.id === selectedItem.id;

      // Set isChecked flag in the computed items
      if (isChecked !== item.isChecked) {
        item.isChecked = isChecked;
      }
    });
    // Send item to store
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: { id: selectedItem.id, title: selectedItem.title },
      fieldProperty: 'pM3'
    });
  }

  /**
   * Get receiverItems from state
   * @return {IItem[]} A list with receiverItems
   */
  get receiverItems(): IItem[] {
    if (this.$store.state.receivers !== null) {
      const temp: IItem[] = [];
      this.$store.state.receivers.forEach(element => {
        temp.push({
          id: element.id,
          title: element.title,
          value: element.url,
          isChecked: false
        });
      });
      return this.sortArrayList(temp);
    } else {
      return [] as IItem[];
    }
  }

  /** Get selected item in receiver
   * @return {IItem} Item that is selected
   */
  get selectedRecieverItem(): IItem {
    // Check if form have a receiver
    if (this.formCopy.attributes.receiver) {
      return this.receiverItems.find(
        item => item.id === this.formCopy.attributes.receiver.id
      ) as IItem;
    }
    return this.receiverItems.find(item => item.isChecked || false) as IItem;
  }

  /**
   * Set selected item in mutation to form for receiver.
   * @param {IItem} item - Item that is selected in receivers
   */
  set selectedRecieverItem(selectedItem: IItem) {
    // We must update isChecked since this isn't done when binding.
    this.receiverItems.forEach(item => {
      let isChecked = false;
      // We could set item.isChecked direct, but this way we only change the one that needs change?
      isChecked = item.id === selectedItem.id;

      // Set isChecked flag in the computed items
      if (isChecked !== item.isChecked) {
        item.isChecked = isChecked;
      }
    });
    // Send item to store
    this.$store.commit(MutationType.UpdateFormProperty, {
      newValue: { id: selectedItem.id, title: selectedItem.title, url: selectedItem.value },
      fieldProperty: 'receiver'
    });
  }

  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }

  private openTestLink() {
    const previewRoute = this.$router.resolve({ name: 'AppFormTest', params: {testFormId: this.form.id} });
    window.open(previewRoute.href);
  }

  private sortArrayList(list) {
    // tslint:disable-next-line:only-arrow-functions
    return list.sort(function(a, b) {
      const x = a.title!.toLowerCase();
      const y = b.title!.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
  }
}
</script>
<style scoped lang='scss'>
  .theme--light.v-chip {
    &.success {
      background-color: $success-bg !important;
      border-color: $success-bg !important;
      color: $success !important;
    }
    &.warning {
      background-color: $warning-bg !important;
      border-color: $warning-bg !important;
      color: $warning !important;
    }
    &.info {
      background-color: $info-bg !important;
      border-color: $info-bg !important;
      color: $info !important;
    }
    &.error {
      background-color: $error-bg !important;
      border-color: $error-bg !important;
      color: $error !important;
    }
  }
</style>