<template>
  <app-content 
    v-if="form || loadFormErrorMessage || isBusyLoadingFromServer"
    :is-loading="isBusyLoadingFromServer" 
    :errorMessage="loadFormErrorMessage" 
    :pageTitle="form ? form.attributes.title : ''" 
    class="app-form" role="form">    
    
      <v-snackbar
        v-model="sendFormError"
        top 
        color="info"
        multi-line
        role="alert"
        >       
          {{$t('app.error.general')}}
      </v-snackbar>  

      <v-card v-if="form">
        <!-- Preview/Test warning -->
        <v-toolbar card color="warning" class="preview-warning pl-2 pb-2 pt-2" v-if="previewFormId || testFormId">
          <v-toolbar-title>
            <v-layout row wrap align-center>
              <v-flex xs2 sm2 md2><v-icon>warning</v-icon></v-flex>
              <v-flex xs8 sm8 md8 text-xs-center>
                {{$t('component.appForm.' + (testFormId ? 'testWarningTitle':'previewWarningTitle'))}}
              </v-flex>
            </v-layout>
          </v-toolbar-title>
        </v-toolbar>       

        <v-toolbar card color="grey lighten-5" v-if="hasStarted">
          <!-- Title -->
          <v-toolbar-title class="header-form-nav">
            <!-- Cancel -->
            <v-btn
              v-if="isFirstStep"
              flat
              :disabled="sendingForm"
              @click="$router.push('/')"
              role="menuitem"
            >
              <v-icon left>close</v-icon>
              <span>{{$t("app.nav.cancel")}}</span>
            </v-btn>

            <!-- Go to previous step -->
            <v-btn
              v-if="!isLastStep && !isFirstStep"
              flat
              :disabled="sendingForm"
              @click="previousStep()"
              role="menuitem"
            >
              <v-icon left>arrow_back</v-icon>
              <span>{{ $t("app.nav.previous") }}</span>
            </v-btn>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- Feedback -->            
          <v-toolbar-items>
            <v-slide-x-reverse-transition>
              <v-progress-circular class="app-form-feedback"                    
                aria-hidden="true"
                v-show="hasStarted && !isLastStep"          
                :rotate="-90"
                :size="40"
                :width="6"
                :value="progress"
                color="primary"
              >{{stepId}}/{{numberSteps}}
              </v-progress-circular>
            </v-slide-x-reverse-transition>                           
          </v-toolbar-items>            
        </v-toolbar>
        <v-divider></v-divider>
        
      <v-card-text class="pa-0">

        <!-- Description -->
        <v-container class="intro" v-show="!hasStarted && form">
          <!-- Warning about this being a test -->
          <v-alert :value="testFormId" color="warning" outline class="mb-3">
            <div class="black--text">
              <strong>{{ $t('component.appForm.testWarningInfoTitle') }}</strong>
              <br>
              {{ $t('component.appForm.testWarningInfoText') }}
            </div>
          </v-alert>
          <h2 class="pb-2">{{ $t('component.appForm.startPageTitle') }}</h2>
          <!-- Form description -->
          <div class="intro-description" tabindex="0" v-html="form.attributes.description"></div>          
        </v-container>

        <!-- Display form -->
        <v-stepper v-if="stepId" v-model="stepId" v-show="hasStarted">
          <v-stepper-items>
            <v-stepper-content
              class="pa-0"
              v-for="(step, index) in formMetaData"
              v-bind:key="(index + 1)"
              :step="(index + 1)"
            >
              <!-- Summary of validation errors, WCAG (3.3.1) -->
              <v-container v-show="showValidationSummary && errors.items.length > 0">
                <form-validation-summary :validation-errors="errors.collect()"></form-validation-summary>
              </v-container>

              <v-container :class="step.id === 'review' ? 'review':''">

                <!-- Step - title & description -->
                <div class="step-title" v-if="!isLastStep" tabindex="0">
                  <h2
                    :aria-label="step.title + ': ' + $t('app.nav.stepFeedback', {currentStep: stepId, totalSteps: numberSteps})"
                  >{{step.title}}</h2>
                  <div
                    v-if="step.description"
                    class="step-description grey--text text--darken-1"
                  >{{step.description}}</div>
                </div>

                <!-- Display step in EDIT MODE -->
                <v-form v-if="index < form.attributes.steps.length">
                  <dynamic-field-component
                    v-for="field in filterOnlyVisibleFields(form.attributes.steps[index].fields)"
                    :key="field.id"
                    :field="field"
                    :validationScope="step.id.toString()"
                    mode="EDIT"
                  ></dynamic-field-component>
                </v-form>

                <!-- Display entire form in REVIEW MODE -->
                <v-form v-if="step.id === 'review'">
                  <div v-for="(stepReview) in form.attributes.steps" v-bind:key="stepReview.id">
                    <h2 class="step-title title" tabindex="0" style="background: #F2F2F2; padding: 4px; margin-bottom: 15px">{{ stepReview.title }}</h2>
                    <dynamic-field-component
                      v-for="field in filterOnlyVisibleFields(stepReview.fields)"
                      :key="field.id"
                      :field="field"
                      :validationScope="step.id.toString()"
                      mode="VIEW"
                      class="field"                      
                    ></dynamic-field-component>
                  </div>

                  <!-- Users Contact Information -->
                  <form-user-contact-info
                    v-if="isReviewStep"
                    v-bind:userContactInfo="user.userContactInfo"
                    v-bind:validationScope="step.id"
                  />

                  <!-- GDPR -->
                  <form-gdpr
                    v-bind:dataControllers="form.attributes.gDPR.dataControllers"
                    v-bind:validationScope="step.id"
                  />
                </v-form>

              </v-container>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>

        <!-- Edit button visible at bottom right when user is an administrator-->
        <aside>
          <v-fab-transition>
            <v-btn
              aria-disabled="true"
              tabindex="-1"
              v-show="isEditButtonVisible"
              @click="$router.push('/admin/' + form.id)"
              fab
              dark
              fixed
              bottom
              right
              color="accent"
              :aria-label="$t('component.appForm.editButtonTitle')"
            >
              <v-icon>create</v-icon>
            </v-btn>
          </v-fab-transition>
        </aside>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions class="grey lighten-5" role="menu">
        <v-layout pt-2 pr-2 pb-2 pl-2 row wrap align-center fill-height>
          <!-- Form has not started -->
          <v-flex v-if="!hasStarted && form" xs12 text-xs-center>
            <!-- Login to start -->
            <v-btn
              v-if="mustLoginBeforeStart"
              outline
              color="primary"
              :loading="aboutToLogin"
              @click="login(); aboutToLogin = true"
              role="menuitem"
              >
              <img :src="bankIdLogo" width="22" class="mr-2" />
              <span>{{$t("app.nav.logInToStart")}}</span>
            </v-btn> 
            
            <!-- Start form  -->
            <v-btn
              v-if="!mustLoginBeforeStart"
              color="primary"
              outline
              @click="startForm()"
              role="menuitem"
            >
              <v-icon left>play_arrow</v-icon>
              <span>{{ $t("app.nav.start") }}</span>
            </v-btn> 
          </v-flex>

          <v-flex xs4 v-if="hasStarted">
            <!-- Cancel -->
            <v-btn
              v-if="isFirstStep"
              flat
              :disabled="sendingForm"
              @click="$router.push('/')"
              role="menuitem"
            >
              <v-icon left>close</v-icon>
              <span>{{$t("app.nav.cancel")}}</span>
            </v-btn>

            <!-- Go to previous step -->
            <v-btn
              v-if="!isLastStep && !isFirstStep"
              flat
              :disabled="sendingForm"
              @click="previousStep()"
              role="menuitem"
            >
              <v-icon left>arrow_back</v-icon>
              <span>{{ $t("app.nav.previous") }}</span>
            </v-btn>
          </v-flex>

          <v-spacer></v-spacer>

          <v-flex v-if="hasStarted" text-xs-right>            
            <!-- Go to next step -->
            <v-btn
              v-if="!isLastStep && !isReviewStep"
              color="primary"
              outline
              @click="nextStep()"
              role="menuitem"
            >
              <span>{{$t("app.nav.next")}}</span>
              <v-icon right>arrow_forward</v-icon>
            </v-btn>

            <!-- Send form -->
            <v-btn
              v-if="!testFormId && isReviewStep"
              color="primary"
              outline
              :loading="sendingForm"
              :disabled="isAdmin"
              @click="confirmReview()"
              role="menuitem"
            >
              <v-icon left>send</v-icon>
              <span>{{$t("app.nav.send")}}</span>
            </v-btn>

            <!-- Test integration -->
            <v-btn
              v-if="testFormId && isReviewStep"
              color="primary"
              outline
              :loading="sendingForm"
              :disabled="!isAdmin"
              @click="sendFormToTestIntegrations()"
              role="menuitem"
            >
              <v-icon left>send</v-icon>
              <span>{{$t("app.nav.testSend")}}</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>        
    
    <!-- Print / info links -->
    <v-container v-show="!hasStarted" class="mt-4 extra-info">
      <p tabindex="0" class="mb-2" v-if="form && form.attributes.receiver">
        <v-icon small class="mr-1">info</v-icon>{{ $t('component.appDescription.text') }}
        <a v-if="form" :href="form.attributes.receiver.url" target="_blank">{{ form.attributes.receiver.title }}</a>.
      </p>
      <p class="mb-0" v-if="form && form.attributes.receiver">
        <v-icon small class="mr-1">print</v-icon> 
        Kan du inte använda dig av denna e-tjänst finns möjligheten att 
        <a :href="'/blankett/'+form.attributes.path" target="_blank">skriva ut en blankett</a>
         som du skickar in per brev till <a v-if="form" :href="form.attributes.receiver.url" target="_blank">{{ form.attributes.receiver.title }}</a>.
      </p>
    </v-container>

    <!-- Dialog prompting user to confirm cancellation of form -->    
    <!-- WCAG role="alert" added to v-card for screen reader -->
    <base-confirm-dialog 
      ref="cancelFormDialog"
      :title="$t('component.appForm.cancel.title')"
      :text="$t('component.appForm.cancel.text')"
      :yesButtonLabel="$t('app.nav.yes') +', '+ $t('app.nav.cancel')"
      :noButtonLabel="$t('app.nav.no') +', '+ $t('app.nav.back')"
      />

  </app-content>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { mapState } from 'vuex';
import AppContent from '@/components/app/AppContent.vue';
import FormMetaDataModel, { IUserContactInfo, IFormField, IItemListField } from '@/models/IForm';
import { IUser, IForm } from '@/models/IForm';
import FormGdpr from '@/components/form/FormGdpr.vue';
import VueScrollTo from 'vue-scrollto';
import { Helper } from '@/utils/helper';
import { ErrorCode, MutationType, FormStatus, FormFieldInterface } from '@/models/Enums';
import FormValidationSummary from '@/components/form/FormValidationSummary.vue';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';
import FormUserContactInfo from '@/components/form/FormUserContactInfo.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import { findFormFieldByGuid, FormFieldLookup } from '@/store/utils';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import { Route } from 'vue-router';

/**
 * AppForm ansvarar för att rita ut ett formulär bestående av steg med olika typer av fält.
 * @prop {string} formId - Identifikation av formulär. Används för att hämta data för formulär. Sätts via router.
 * @prop {string} stepId - Vilket steg som ska visas. Sätts via router.
 */

@Component({
  components: {
    AppContent,
    FormGdpr,
    FormValidationSummary,
    BaseScreenReader,
    DynamicFieldComponent,
    FormUserContactInfo,
    BaseConfirmDialog
  },
  computed: mapState(['user'])
})
export default class AppForm extends Vue {
  @Provide('validator') public $validator = this.$validator;

  @Prop() public formPath!: string;
  @Prop() public previewFormId!: number; // Used only when wanting to preview a form as admin
  @Prop() public testFormId!: number; // Used only when wanting to test an unpublished form
  @Prop({ default: '0' }) public stepId!: string;

  public user!: IUser;

  private hasSentFormToServer: boolean = false;
  private hasStarted: boolean = false;
  private formMetaData: FormMetaDataModel[] = new Array();
  private numberSteps: number = 0;
  private sendingForm: boolean = false;
  private sendFormError: boolean = false;
  private isBusyLoadingFromServer: boolean = true;
  private loadFormErrorMessage: string = '';
  private isEditButtonVisible: boolean = false;
  private showValidationSummary: boolean = false;
  private bankIdLogo = require('@/assets/bankid_high_rgb.png');
  private aboutToLogin = false;

  public beforeRouteUpdate(to: Route, from, next) {
    if (!to.params.stepId) {
      // Stepping back in browser to start page
      this.hasStarted = false;
    }
    next();
  }


 public async beforeRouteLeave(to, from, next) {
   if (!this.hasSentFormToServer) {
    const cancelConfirmed = await (this.$refs.cancelFormDialog as BaseConfirmDialog).confirm();
    if (cancelConfirmed) {
      this.clearFormData();
      next();
    } else {
      next(false);
    }
  } else {
     next();
  }
 }

  private async created() {
    await this.loadFormDataFromServer();

    if (this.stepId === '1' && this.user) {
      this.hasStarted = true;
    } else if (this.stepId !== '0') {
      // dont allow users to jump to a specific step via url
      this.$router.push('/' + this.form.attributes.path);
    }

    // Set if edit button should be visible
    this.setEditButton();
  }

  private mounted() {
    window.onbeforeunload = () => {
      if (this.hasStarted) {
        return this.$t('component.appForm.cancel.text');
      }
    };
  }

  private async beforeDestroy() {
    window.onbeforeunload = () => {
      // unsetting beforeunload
    };
  }

  private login() {
    this.$auth.loginCitizen(this.$route.path + '/1' ); // start on first step after login
  }

  private get isAdmin(): boolean {
    return this.$store.getters.isLoggedInAdmin;
  }

  private filterOnlyVisibleFields(fields: IFormField[]) {
    return fields.filter(f => this.isVisible(f));
  }

  private isVisible(field: IFormField): boolean {
    if (field.displayRuleGuid) {
      const displayRule = this.form.attributes.displayRules.filter(r => r.guid === field.displayRuleGuid)[0];
      if (displayRule) {

        // Evaluate found display rule (this could possibly be cached)

        const motherField = findFormFieldByGuid(this.form, displayRule.fieldGuid);
        const fieldInterface = FormFieldLookup.getInstanceOf(motherField);
        if (fieldInterface !== FormFieldInterface.ItemListField) {
          console.warn(
            'Trying to evaluate a displayRule connected to a "mother" field which type is not supported. ' +
            'Only ItemListFields are supported, this field is a ' + fieldInterface
          );
        } else {
          const motherFieldItems = ((motherField as IItemListField).fieldOptions || {}).items;
          // We have found the items that will decide whether or not to display this child
          if (motherFieldItems) {
            const checkedItems = motherFieldItems.filter(item => item.isChecked);
            if (!checkedItems.find(item => item.id!.toString() === displayRule.fieldOptionId.toString())) {
              // the checked items does not include the one expected by the display rule,
              // hence this child field shout not be visible
              return false;
            }
          }
        }
      } else {
        console.warn('Field refering to a displayRule which is not present in the form');
      }
    }
    return true;
  }

  /**
   * Load data from server into store
   */
  private async loadFormDataFromServer() {
    try {
      if (this.previewFormId || this.testFormId) {
        const id = this.previewFormId || this.testFormId;
        await this.$store.dispatch('getForm', { id });
        // Redirect to public view if trying to test a published form (you cant test something that is already live!)
        if (
          this.testFormId &&
          this.form.attributes.status === FormStatus.Published
        ) {
          this.$router.push('/' + this.form.attributes.path);
        }
      } else {
        await this.$store.dispatch('getFormByPath', { path: this.formPath });
      }
      this.createFormMetaData();
    } catch (error) {
      switch (error.message) {
        case ErrorCode.FormNotFound:
          this.loadFormErrorMessage = this.$i18n
            .t('app.error.formNotFound')
            .toString();
          break;
        case ErrorCode.FormNotPublished:
          this.loadFormErrorMessage = this.$i18n
            .t('app.error.formNotPublished')
            .toString();
          break;
        default:
          throw error;
      }
    }
    this.isBusyLoadingFromServer = false;
  }

  private get mustLoginBeforeStart() {
    return (
      !this.user &&
      !this.form.attributes.allowsAnonymousSender
    );
  }

  private startForm() {
    this.hasStarted = true;
    this.$router.push({ name: this.$route.name, params: { stepId: '1' } });
  }

  private async clearFormData() {
    await this.clearValidation();
    this.hasStarted = false;
    this.$store.commit(MutationType.TruncateForm);
  }

  private openFormForPrinting() {
    this.$router.push('/blankett/' + this.form.attributes.path);
  }

  private async goToStart() {
    this.$router.push({ path: '/' });
  }

  private async isValidForm() {
    await this.$validator.reset();
    return await this.$validator.validateAll(this.currentStep.id.toString());
  }

  private async clearValidation() {
    await this.$validator.reset();
    return;
  }

  get form(): IForm {
    return this.$store.state.form;
  }

  get isFirstStep() {
    return parseInt(this.stepId, 10) === 1;
  }

  get isLastStep() {
    return parseInt(this.stepId, 10) === this.formMetaData.length;
  }

  get isReviewStep() {
    return parseInt(this.stepId, 10) === this.formMetaData.length - 1;
  }

  get currentStep() {
    return this.formMetaData[parseInt(this.stepId, 10) - 1];
  }

  /**
   * Compute how much progress that have been made
   */
  get progress() {
    return Math.ceil((parseInt(this.stepId, 10) / this.numberSteps) * 100);
  }

  /**
   * Go on to next step, or review step
   */
  private async nextStep() {
    const validationResult = await this.isValidForm();
    if (validationResult) {
      // Go to next step
      this.showValidationSummary = false;
      const nextStep = (parseInt(this.stepId, 10) + 1).toString();
      this.$router.push({
        name: this.$route.name,
        params: { stepId: nextStep }
      });

      // Scroll to top of form
      VueScrollTo.scrollTo('.step-title', 1500, {
        offset: -20,
        onDone: element => {
          element.focus();
        }
      });
    } else {
      // Show validation summary, scroll and place focus there
      this.showValidationSummary = true;
      VueScrollTo.scrollTo('#form-validation-summary', 1500, {
        offset: -20,
        onDone: element => {
          element.focus();
        }
      });
    }
  }

  private async confirmReview() {
    await this.sendInForm('sendForm');
  }

  private async sendFormToTestIntegrations() {
    await this.sendInForm('sendFormToTestIntegrations');
  }

  private async sendInForm(dispatchMethod: string) {
    let error = false;
    this.sendingForm = true;
    try {
      const blob = await this.$store.dispatch('getPdf', {form: this.form,  userContactInfo: this.user.userContactInfo});
      await this.$store.dispatch(dispatchMethod, { blob });
      this.hasSentFormToServer = true;
    } catch (err) {
      error = err;
    }
    this.sendingForm = false;
    if (error) {
      console.error(error);
      this.sendFormError = true;
    } else {
      // Go to confirm page
      this.$router.push({ name: 'AppFormConfirmation' });
    }
  }

  private previousStep() {
    let previousStep = parseInt(this.stepId, 10) - 1;
    if (previousStep < 0) {
      previousStep = 0;
    }
    this.$router.replace({
      name: this.$route.name,
      params: { stepId: previousStep.toString() }
    });
    // Scroll to top of form
    VueScrollTo.scrollTo('.step-title', 1500, {
      offset: -20,
      onDone: element => {
        element.focus();
      }
    });
  }

  /**
   * Skapa metadata för formulär. Behövs för att bygga upp steg och navigering.
   */
  private createFormMetaData() {
    // Rensa metadata
    this.formMetaData = [];

    // Skapa metadata för alla steg
    this.numberSteps = this.form.attributes.steps.length + 2;
    for (const step of this.form.attributes.steps) {
      this.formMetaData.push(
        new FormMetaDataModel(step.id.toString(), step.title, step.description)
      );
    }
    // Meta data för granskning och bekräftelse
    this.formMetaData.push(new FormMetaDataModel('review', 'Granskning', ''));
    this.formMetaData.push(
      new FormMetaDataModel('confirmation', 'Bekräftelse', '')
    );
  }

  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }

  /**
   * Set if edit bottom be visible after a small timeout
   */
  private setEditButton() {
    setTimeout(() => {
      if (this.isAdmin && this.formPath) {
        this.isEditButtonVisible = true;
      }
    }, 1000);
  }
}
</script>

<style lang="scss">
.app-form {
  .preview-warning {
    .v-toolbar__title {
      width: 100%;
    }
  }
  // Justera layout för Toolbar
  .v-toolbar__content {
    padding: 0;
    height: auto !important; // very important or else long titles won't fit in the toolbar on small screens
  }
  .v-toolbar__title {
    white-space: normal;
  }
  .v-toolbar__items {
    padding: 10px;
  }

  .extra-info {
    border: #BBB solid 1px;
    border-radius: 3px; 
    opacity: 0.8;
  }

  // Make buttons a bit less wide (except primary)
  .v-card__actions button,
  .v-toolbar button {
    padding-left: 8px;
    padding-right: 8px;
    &.primary--text {
      padding-left: 15px;
      padding-right: 15px;
    }

    .v-icon {
      margin-right: 3px;
    }
  }

  // Öka marginal nedanför stegtitel
  .step-title {
    padding-bottom: 30px;
  }
  .step-description {
    margin-top: 6px;
  }
  // Ta bort skugga för stegbakgrund
  .v-stepper {
    box-shadow: none;
  }
  // Container for field
  .field {
    padding-bottom: 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid $grey-lighten-3;
  }

  .review {
    .field.field-section {
      border-bottom: 0;
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }

  // Fix för att input-fält som är inaktiverade i IOS ska ha full opacity
  .v-input input[disabled],
  .v-input textarea[disabled] {
    opacity: 1 !important;
  }

  .print-btn {
    text-transform: none; 
    font-weight: normal;
  }
}
</style>
