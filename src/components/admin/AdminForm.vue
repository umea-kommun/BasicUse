<template>    
  <app-content 
    :isLoading="!this.form" 
    :size="contentSize" 
    :class="'admin-form' + (sendingFormToServer ? ' saving' : '')" 
    :pageTitle="this.form ? form.attributes.title : 'Redigera e-tjänst'">

    <!-- Errormessage that is shown on error. -->
    <v-snackbar          
      v-model="isError"
      top        
      color="info"                             
      multi-line
      role="alert"
      >
        {{ errorMessage }}
        <v-btn dark flat
                @click="isError = false">
            {{ $t('app.nav.close')}}
        </v-btn>
    </v-snackbar>

    <!-- Edit e-service -->
    <v-card v-if="form !== null">
        <v-toolbar card color="grey lighten-5" height="80px">
            <!-- Status of form -->
            <v-chip label
                    class="status"
                    small
                    :color="helper.getStatus(this.form.attributes.status).statusColorBg"
                    :title="this.getStatusText(this.form.attributes.status)">
                {{ this.getStatusText(this.form.attributes.status) }}
            </v-chip>
            <v-chip class="truncated-chip" small v-if="form.attributes.receiver">
              <span>{{ form.attributes.receiver.title }}</span>
            </v-chip>
            <v-chip class="truncated-chip" small v-if="form.attributes.pM3">
              <span>{{ form.attributes.pM3.title }}</span>
            </v-chip>
            <v-spacer></v-spacer>
            <v-chip small label class="saved-message"><em>{{ lastSaveMessage }}</em></v-chip>
            <v-btn :loading="sendingFormToServer"
              title="ctrl + s"
              color="primary"
              flat
              @click="saveForm"
              style="margin-left: 0"
              :disabled="!canSaveForm()">
                <v-icon left>cloud_upload</v-icon>
                {{ $t('app.nav.save') }}
            </v-btn>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="pa-0">
            <v-layout>
                <!-- Main content-area, left -->
                <v-flex xs8>
                    <v-container class="content">
                        <!-- steps -->
                        <admin-steps v-if="steps"
                            :steps="steps"
                            v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
                            v-on:onStepIndexChanged="selectedStepIndex = $event.newIndex">
                        </admin-steps>
                    </v-container>
                </v-flex>
                <v-divider vertical></v-divider>
                <v-flex class="sidebar grey lighten-5" xs4>
                    <!-- Right sidebar for properties & list fields -->
                    <v-layout column>

                        <!-- Title & URL -->
                        <v-flex>
                          <base-toggle-container containerId="name" :title="$t('component.adminForm.formTitle')">
                            <admin-form-title
                              :form="form"
                              @onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
                              @statusUpdate="updateStatus">
                            </admin-form-title>
                          </base-toggle-container>
                        </v-flex>
                        <v-divider></v-divider>

                        <!-- Properties -->
                        <v-flex class="properties">
                          <base-toggle-container containerId="props" :title="$t('component.adminFormProperties.properties.title')">
                            <admin-form-properties 
                              :form="form"
                              @onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
                              @statusUpdate="updateStatus">
                            </admin-form-properties>
                          </base-toggle-container>
                        </v-flex>
                        <v-divider></v-divider>

                        <!-- Integration -->
                        <v-flex class="integration">
                          <base-toggle-container containerId="integration" :title="$t('component.adminIntegration.properties.title')">
                            <form-integration-manager
                              v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)">
                            </form-integration-manager>
                          </base-toggle-container>
                        </v-flex>
                        <v-divider></v-divider>
                         <!-- Display rule -->
                        <v-flex class="displayrule">
                            <base-toggle-container containerId="displayrule" :title="$t('component.adminDisplayRule.properties.title')">
                              <admin-display-rule v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)">
                              </admin-display-rule>
                            </base-toggle-container>
                        </v-flex>
                        <!-- Divider -->
                        <v-divider></v-divider>
                        <!-- List fields -->
                        <v-flex class="fields">
                          <base-toggle-container containerId="fields" :title="$t('component.adminForm.fields.title')">
                            <admin-form-toolbox v-on:onAddField="onAddField"></admin-form-toolbox>
                          </base-toggle-container>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
  
    <!-- Confirm discard of unsaved changes if leaving without saving -->
    <base-confirm-dialog ref="discardChangesDialog"
                          :title="$t('component.adminForm.confirmDiscardChanges')"
                          :text="$t('component.adminForm.confirmDiscardChangesInfo')" />
  </app-content>
</template>

<script lang="ts">
import { Prop, Vue, Provide } from 'vue-property-decorator';
import Component from 'vue-class-component';
import AppContent from '@/components/app/AppContent.vue';
import AdminSteps from '@/components/admin/AdminSteps.vue';
import { MutationType, ErrorCode, AppContentSize, FormStatus } from '@/models/Enums';
import { IForm, IFormField, IFormStep } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import { EventBus, EventBusEvent, IEventAddFieldDblClick } from '@/utils/EventBus';
import AdminFormProperties from '@/components/admin/AdminFormProperties.vue';
import AdminFormTitle from '@/components/admin/AdminFormTitle.vue';
import AdminFormToolbox from '@/components/admin/AdminFormToolbox.vue';
import BaseToggleContainer from '@/components/base/BaseToggleContainer.vue';
import AdminDisplayRule from '@/components/admin/AdminDisplayRule.vue';

import VueScrollTo from 'vue-scrollto';
import {KeyBoardCommandMixin, KeyCommands} from '@/plugins/keyboard-command-mixin';
import { Moment } from 'moment';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';


/**
 * Administration of form
 * @prop {string} formId - Identification of form. Used for getting form-data. Is set through route.
 */
@Component({
  components: {
    AppContent,
    AdminSteps,
    AdminFormProperties,
    AdminFormToolbox,
    BaseConfirmDialog,
    AdminFormTitle,
    BaseToggleContainer,
    AdminDisplayRule
  },
  mixins: [KeyBoardCommandMixin]
})
export default class AdminForm extends Vue {
  @Provide('validator') public $validator = this.$validator;
  @Prop() public formId!: string;
  private isError: boolean = false;
  private errorMessage: string = '';
  // selectedStepIndex has base 1
  private selectedStepIndex: number = 1;
  private showCancelDialog: boolean = false;
  private sendingFormToServer: boolean = false;
  private haveSavedAnyChanges: boolean = false;
  private contentSize!: AppContentSize;

  public onAddField(itemToAdd: IFormField) {
    try {
      itemToAdd.sortIndex = this.currentStep.fields.length + 1;
      this.$store.commit(MutationType.AddFormField, {
        stepId: this.currentStep.id,
        data: itemToAdd
      });

      // Tell anyone that subscribes to event that
      // field has been added through doubleclick
      const eventBusValue = {
        field: itemToAdd,
        stepId: this.currentStep.id
      } as IEventAddFieldDblClick;
      EventBus.$emit(EventBusEvent.onAddFieldDblClick, eventBusValue);
    } catch (err) {
      const errMsg = this.$t('component.adminFields.field.error.onAddField').toString();
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg });
    }
  }

  public async beforeRouteLeave(to, from, next) {
    let moveOnToNextRoute = true;
    if (this.formHasUnsavedChanges) {
      moveOnToNextRoute = await (this.$refs.discardChangesDialog as BaseConfirmDialog).confirm();
    }
    if (moveOnToNextRoute) {
      this.$store.commit(MutationType.TruncateForm);
      next();
    }
  }

  public get lastSaveMessage() {
    if (this.formHasUnsavedChanges) {
      return this.$t('component.appForm.notSaved');
    } else {
      const lastSaveDate = this.$store.getters.getFormLastSavedDate;
      if (!lastSaveDate) {
        return '';
      }
      const moment = (this as any).$moment(lastSaveDate) as Moment;
      const savedToday = moment.isSame(new Date(), 'day');
      if (this.haveSavedAnyChanges) {
        return this.$t('component.appForm.allChangesSaved');
      } else if (savedToday) {
        return this.$t('component.appForm.savedToday');
      } else {
        return this.$t('component.appForm.saved') + moment.fromNow();
      }
    }
  }

  public get formHasUnsavedChanges() {
    return this.$store.state.formHasUnsavedChanges;
  }

  /**
   * Get component-data on creation.
   */
  private async created() {
    this.contentSize = this.$route.meta.contentSize;
    this.errorMessage = this.$i18n.t('app.error.general').toString();
    // Dispatched by keyboard-command-mixin
    this.$on(KeyCommands.CTRL_S, evt => this.saveForm());
    await this.getData();
  }

  private mounted() {
    window.onbeforeunload = () => {
      if (this.formHasUnsavedChanges) {
        return this.$t('component.adminForm.confirmDiscardChangesInfo');
      }
    };
  }

  private async beforeDestroy() {
    this.$off(KeyCommands.CTRL_S);
    window.onbeforeunload = () => {
      // unsetting beforeunload
    };
  }

  /**
   * Get data from api and save to store.
   */
  private async getData() {
    try {
      await this.$store.dispatch('getValidationRuleTypes');
      await this.$store.dispatch('getForm', { id: this.formId });
      this.isError = false;
    } catch (err) {
      this.setErrorMessage(err);
    }
  }

  private async saveForm() {
    if (this.canSaveForm()) {
      this.validateForm();
      this.sendingFormToServer = true;
      try {
        await this.$store.dispatch('updateForm');
        // re-validate so the validator will get access to the fields
        // that have gotten the temp-id replaced with a db id
        this.$validator.validate();
        this.haveSavedAnyChanges = true;
      } catch (err) {
        this.setErrorMessage(err);
      }
      this.sendingFormToServer = false;
    }
  }

  /**
   * You're only allowed to save form when it contains unsaved changes
   */
  private canSaveForm() {
    return !this.sendingFormToServer && this.formHasUnsavedChanges;
  }

  /**
   * Set errormessage depending on error-status.
   * When setting message it will always display in snackbar
   * @return { string } Errormessage
   */
  private setErrorMessage(err: any, errDisplayMsg?: string): string {
    // Log error to console
    if (err) {
      console.error(err);
    }

    if (errDisplayMsg) {
      this.errorMessage = errDisplayMsg;
      this.isError = true;
    } else if (err === ErrorCode.FormPathNotUnique) {
      this.errorMessage = this.$i18n
        .t('app.error.400.FormPathNotUnique')
        .toString();
    } else if (err.response && err.response.status === 404) {
      this.errorMessage = this.$i18n.t('app.error.404').toString();
    } else {
      this.errorMessage = this.$i18n.t('app.error.general').toString();
    }
    // Display Error-Message in snackbar
    this.isError = true;

    return this.errorMessage;
  }

  /**
   * Get form-data from store.
   * @return { IForm } Form.
   */
  get form(): IForm {
    return this.$store.state.form;
  }

  /**
   * Get all the steps in the form.
   * @return { IFormStep } Step.
   */
  get steps(): IFormStep[] {
    return this.form.attributes.steps;
  }

  /**
   * Get the current selected step.
   * @return { IFormStep } Step.
   */
  get currentStep(): IFormStep {
    // selectedStepIndex has 1 as base
    return this.form.attributes.steps[this.selectedStepIndex - 1];
  }

  /**
   * Validate form and scroll to field if in current-step.
   */
  private async validateForm(stepId?: string) {
    this.$validator.errors.clear();

    if (stepId) {
      await this.$validator.validateAll(stepId);
    } else {
      await this.$validator.validate();
    }

    if (this.$validator.errors.items.length > 0) {
      // Scroll view to first element that is not valid
      const firstErrOnCurrentStep = this.$validator.errors.items.find(
        d => d.scope === this.currentStep.id
      );
      if (firstErrOnCurrentStep) {
        const topErrorElement = this.$el.querySelector(
          '[data-vv-name="' + firstErrOnCurrentStep.field + '"]'
        );
        VueScrollTo.scrollTo(topErrorElement, 1500, {
          offset: -90
        });
      } else {
        // We could change step.. to show what step has error
        const errorOnStepId = this.$validator.errors.items[0].scope;
      }
      // Show error message
      this.setErrorMessage(
        null,
        this.$t('app.validation.messages.formIsNotValid').toString()
      );

      return false;
    } else {
      return true;
    }
  }

  /**
   * Update form-status
   */
  private async updateStatus(newStatus: FormStatus) {
    const isFormValid = await this.validateForm();
    if (!isFormValid) {
      this.setErrorMessage(
        null,
        this.$t('app.validation.messages.errorOnPublish').toString()
      );
    }
  }

  /**
   * Get the text depending of the form status.
   */
  private getStatusText(status) {
    return status === FormStatus.Published
      ? this.$i18n.tc('app.status.published')
      : status === FormStatus.Draft
        ? this.$i18n.tc('app.status.draft')
        : status === FormStatus.Unpublished
          ? this.$i18n.tc('app.status.unpublished')
          : '';
  }

  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }
}
</script>

<style scoped lang="scss">

.saved-message {
  background: none !important; 
  margin-right:0; 
  padding-right:0;
  color: #aaaaaa !important;  
}

.theme--light.v-list .v-list--disabled {
  opacity: 0.6;
}

.admin-form.saving {
  opacity: 0.7;
}

.truncated-chip {
  opacity: 0.75;
  span {
    max-width: 120px; 
    text-overflow: ellipsis;
     white-space: nowrap; 
     overflow: hidden;
  }
}

.theme--light.v-chip {
  &.success {
    background-color: $success-bg !important;
  }
  &.warning {
    background-color: $warning-bg !important;
  }
  &.info {
    background-color: $info-bg !important;
  }
  &.error {
    background-color: $error-bg !important;
  }
}
</style>
