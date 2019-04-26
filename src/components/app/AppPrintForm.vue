<template>
  <app-content
    :is-loading="isBusyLoadingFromServer" 
    :errorMessage="loadFormErrorMessage" 
    :pageTitle="form ? form.attributes.title : ''" 
    class="app-form" role="form">    
    <div v-if="form">
      <header>
        <router-link to="/">
          <img class="logo" width="200" :src="logotypeUrl" :alt="$t('component.appHeader.logoAlt')" />
        </router-link>
      </header>

      <div v-if="form.attributes.status === 'Unpublished' ||  form.attributes.status === 'Draft'">
        <h2 class="print-warning-title">{{ $t('component.AppPrintForm.warningUnpublished') }}</h2>
      </div>

      <div>
        <h1>{{form.attributes.title}}</h1>
        <p style="margin-top:12px">
          {{ $t('component.AppPrintForm.sendInfo') }}
          &quot;<a :href="form.attributes.receiver.url" target="_blank">{{ form.attributes.receiver.title }}</a>&quot;.
        </p>
      </div>

      <div v-for="(step, index) in form.attributes.steps" v-bind:key="(index + 1)">
        <h2 class="print-title">
          {{ index+1 }}) {{ step.title }}
        </h2>
        <div v-for="field in groupFollowUpQuestions(form.attributes.steps[index].fields)" :key="field.id">
          <div v-if="hasChildFields(field)">
            <print-follow-up-questions :field="field"></print-follow-up-questions>
          </div>
          <dynamic-field-component
            v-if="!hasChildFields(field)"
            :field="field" 
            mode="PRINT"
            >
          </dynamic-field-component>
        </div>
      </div>

      <!-- GDPR -->
      <form-gdpr :dataControllers="form.attributes.gDPR.dataControllers" mode="PRINT" />

      <!-- Contact info -->
      <div id="contact-info">
        <h2 class="print-title">{{ $t('component.AppPrintForm.contactInfo') }}</h2>
        <PrintTextBox 
        :title="$t('component.AppPrintForm.contactInfoSender')" 
        :helpText="$t('component.AppPrintForm.contactInfoHelp')"
        height="100" />
      </div>

      <!-- Signature -->
      <div id="paper-signature">
        <h2 class="print-title">{{ $t('component.AppPrintForm.signature') }}</h2>
        <PaperSignature />
      </div>
      
      <div v-if="form.attributes.status === 'Unpublished' ||  form.attributes.status === 'Draft'">
        <h2 class="print-warning-title">{{ $t('component.AppPrintForm.warningUnpublished') }}</h2>
      </div>

      <!-- Printing info -->
      <div id="print-alert">
        <v-snackbar
          v-model="showPrintSnackBar"
          :timeout="0"
          multi-line
          bottom
        >
          {{ $t('component.AppPrintForm.notice') }} &quot;{{ form.attributes.title }}&quot;.
          <v-btn
            color="pink"
            flat
            @click="openBrowserPrintDialog()"
          >
            <v-icon class="pr-1">print</v-icon>
            Skriv ut
          </v-btn>
        </v-snackbar>
      </div>    
    </div>
  </app-content>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import AppContent from '@/components/app/AppContent.vue';
import { IForm, IFormField, IDisplayRule, IItemListField } from '@/models/IForm';
import FormGdpr from '@/components/form/FormGdpr.vue';
import { Helper } from '@/utils/helper';
import { ErrorCode } from '@/models/Enums';
import PaperSignature from '@/components/field/print/PaperSignature.vue';
import PrintTextBox from '@/components/field/print/PrintTextBox.vue';
import PrintFollowUpQuestions from '@/components/field/print/PrintFollowUpQuestions.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';

/**
 * Renders a form suitable for printing
 */
@Component({
  components: {
    AppContent,
    FormGdpr,
    PaperSignature,
    PrintTextBox,
    DynamicFieldComponent,
    PrintFollowUpQuestions
  }
})
export default class AppForm extends Vue {

  // The validator is not used in this form but the field components
  // demands the validator to be present any way.
  @Provide('validator') public $validator = this.$validator;

  @Prop() public formPath!: string;

  private logotypeUrl: string = require('@/assets/logo.png');
  private loadFormErrorMessage: string = '';
  private isBusyLoadingFromServer: boolean = true;
  private showPrintSnackBar: boolean = true;

  private async created() {
    await this.getData();
    this.openBrowserPrintDialog();
  }

  private openBrowserPrintDialog() {
    (window as any).print();
  }

  private groupFollowUpQuestions(stepFields: IFormField[]) {

    const displayRules = this.form.attributes.displayRules;
    const newFieldList: IFormField[] = [];
    const childFieldsMap: Map<string | number, IFormField[]> = new Map();

    // Collect all child fields and create a new field list, excluding these child fields
    stepFields.forEach(field => {
      const displayRule = field.displayRuleGuid ? displayRules.find(r => r.guid === field.displayRuleGuid) : null;
      if (displayRule && this.hasMotherFieldInSameStep(stepFields, displayRule)) {
        const itemIdString = displayRule.fieldOptionId.toString();
        const childFieldList = childFieldsMap.get(itemIdString);
        if (!childFieldList) {
          childFieldsMap.set(itemIdString, [field]);
        } else {
          childFieldList.push(field);
        }
      } else {
        newFieldList.push(field);
      }
    });

    // Monkey-patch the child fields onto field.fieldOptions.items (the items belonging to the "mother" question)
    newFieldList.forEach(field => {
      field = field as IItemListField;
      if (field.fieldOptions && field.fieldOptions.items) {
        field.fieldOptions.items.forEach(item => {
          const itemIdString = item.id.toString();
          if (childFieldsMap.has(itemIdString)) {
            item.childFields = childFieldsMap.get(itemIdString);
          }
        });
      }
    });

    return newFieldList;
  }

  private hasMotherFieldInSameStep(stepFields: IFormField[], displayRule: IDisplayRule): boolean {
    return stepFields.find(f => f.guid === displayRule.fieldGuid) ? true : false;
  }

  /**
   * Load data from server into store
   */
  private async getData() {
    try {
      await this.$store.dispatch('getFormByPath', { path: this.formPath });
    } catch (error) {
      switch (error.message) {
        case ErrorCode.FormNotFound:
          this.loadFormErrorMessage = this.$i18n.t('app.error.formNotFound').toString();
          break;
        case ErrorCode.FormNotPublished:
          this.loadFormErrorMessage = this.$i18n.t('app.error.formNotPublished').toString();
          break;
        default:
          this.loadFormErrorMessage = (error.message || error.toString()) + '\n' + error.stack;
      }
    }
    this.isBusyLoadingFromServer = false;
  }

  private hasChildFields(field: IItemListField | any): boolean {
    if (
      field.fieldOptions &&
      field.fieldOptions.items
    ) {
      return field.fieldOptions.items.find(item => 'childFields' in item);
    }
    return false;
  }

  get form(): IForm {
    return this.$store.state.form;
  }

  get helper(): Helper {
    return Helper;
  }
}
</script>

<style lang="scss">
#app.route-AppPrintForm {
  background: #FFF !important;

  .content-layout {
    display: block;
    -ms-flex: none;
    flex: none;
    -ms-flex-wrap: none;
    flex-wrap: none;
    min-width: 0;
    max-width: 900px;
    margin: 0;
  }

  .content-flex {
    display: block !important;
    max-width: none !important;
    width: 90% !important;
    flex: none !important;
    margin: 0 !important;
  }

  h1 {
    width: 700px !important;
    max-width: none !important;
  }

  header {
    padding:120px 0 100px;
  }

  .app-horizontal-nav,
  .app-header,
  .app-footer {
    display: none;
  }
  
  h1 {
    max-width: 500px;
  }
  
  .container {
    max-width: none !important;
  }

  .print-title {
    background-color: $primary-bg;
    -webkit-print-color-adjust: exact;
    page-break-after: avoid;
    break-after: avoid;
    margin: 58px 0 20px;
  }

  .v-alert.v-alert,
  .v-alert.v-alert--outline {
      border: 0 !important;
      font-style: italic;
  }

  .field-section {
    margin-bottom: 0;
    padding-bottom:0 !important;
  }
  
  .print-warning-title {    
    margin-bottom: 20px;
    border: #333 solid 5px;
    padding: 20px;
  }
  
  #paper-signature {
    page-break-inside: avoid;
  }

  #contact-info {
    page-break-inside: avoid;
  }
}

@media print {
  #print-alert {
    display: none;
  }  
  @page {
    size: A4;
  }
}

</style>
