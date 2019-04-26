<template>
    <div class="field-file-upload">
      <!-- ADMIN -->
      <div v-if="mode === 'ADMIN'">        
        <v-text-field
          v-model="title"          
          :label="$t('app.admin.componentTitle')"
          :hint="$t('app.admin.componentTitleHint')"
          v-validate="'required'"
          :data-vv-name="getValidationId + 'title'"
          :data-vv-as="$t('app.admin.field.title')"
          :data-vv-scope="validationScope"
          :error-messages="errors.first(getValidationId + 'title', validationScope)"
          box
        >
        </v-text-field> 
        <v-text-field
          v-model="helpText"
          :label="$t('app.admin.componentHelpText')"
          :hint="$t('app.admin.componentHelpTextHint')"
          box
        >
        </v-text-field>
        <v-select
          :label="$t('component.fieldFileUpload.acceptedFileTypes')"
          v-model="fileTypeValidation"
          :items="getFileTypeValidationAlternatives()"
          item-text="label"
          item-value="value"
          menu-props="auto"          
          single-line         
        ></v-select>
        <v-checkbox        
          v-model="allowMultiple"
          :value="true"
          :checked="allowMultiple"
          :label="$t('component.fieldFileUpload.acceptMultipleFiles')"
          color="primary"
          type="checkbox"
          hide-details
          ></v-checkbox>
        <v-text-field 
          v-show="allowMultiple"
          type="number"
          v-model="maxFiles"
          :label="$t('component.fieldFileUpload.maxFiles')"
          max="10"
          min="1"
          box
        ></v-text-field>

        <!-- Validation -->
        <admin-validation-manager v-bind:value.sync="validation" :availableRules="availableRules"></admin-validation-manager>

        <!-- DisplayRule -->
        <display-rules-controls :field="field"></display-rules-controls>

      </div>

      <!-- TOOLBOX -->    
      <div v-if="mode === 'TOOLBOX'">
        <field-toolbox 
          v-on:onDoubleClick="onDoubleClick()"
          :title="$t('component.fieldFileUpload.title')"
          icon="attachment"
          :description="$t('component.fieldFileUpload.description')"
        ></field-toolbox>
      </div>

      <!-- EDIT -->
      <div v-if="mode === 'EDIT'">
        
        <!-- Titel -->
        <label class="field-title subheading" :class="{ 'error--text' : isError }">{{ title }} <span v-if="isRequired" aria-hidden="true">*</span></label>    
        
        <!-- Upload file -->
        <vue-file-pond 
          :id="getValidationId"
          :name="getValidationId"
          class-name="vue-file-pond"
          ref="pond"
          v-model="files"
          v-validate.continues="validationRules"
          :data-vv-name="getValidationId"
          :data-vv-as="title"
          :data-vv-scope="validationScope"
          :class="{ 'error--text': isError }"
          v-on:addfile="handleFileAdded"
          v-on:removefile="handleFileRemoved"
          :files="tempFiles"
          :label-idle="$t('component.filepond.label')"
          :maxFileSize="maxFileSize"
          :allow-multiple="allowMultiple"
          :maxFiles="maxFiles"
          :allow-file-type-validation="!!acceptedFileTypes"
          :accepted-file-types="acceptedFileTypes"
          :labelFileWaitingForSize ="$t('component.filepond.labelFileWaitingForSize')"
          :labelFileSizeNotAvailable ="$t('component.filepond.labelFileSizeNotAvailable')"
          :labelFileLoading ="$t('component.filepond.labelFileLoading')"
          :labelFileLoadError ="$t('component.filepond.labelFileLoadError')"
          :labelFileProcessing ="$t('component.filepond.labelFileProcessing')"
          :labelFileProcessingComplete ="$t('component.filepond.labelFileProcessingComplete')"
          :labelFileProcessingAborted ="$t('component.filepond.labelFileProcessingAborted')"
          :labelFileProcessingError ="$t('component.filepond.labelFileProcessingError')"
          :labelTapToCancel="$t('component.filepond.labelTapToCancel')"
          :labelTapToRetry="$t('component.filepond.labelTapToRetry')"
          :labelTapToUndo="$t('component.filepond.labelTapToUndo')"
          :labelButtonRemoveItem = "$t('component.filepond.labelButtonRemoveItem')"
          :labelButtonAbortItemLoad = "$t('component.filepond.labelButtonAbortItemLoad')"
          :labelButtonRetryItemLoad="$t('component.filepond.labelButtonRetryItemLoad')"
          :labelButtonAbortItemProcessing ="$t('component.filepond.labelButtonAbortItemProcessing')"
          :labelButtonUndoItemProcessing ="$t('component.filepond.labelButtonUndoItemProcessing')"
          :labelButtonRetryItemProcessing ="$t('component.filepond.labelButtonRetryItemProcessing')"
          :labelButtonProcessItem ="$t('component.filepond.labelButtonProcessItem')"
          :labelFileTypeNotAllowed ="$t('component.filepond.labelFileTypeNotAllowed')"
          :fileValidateTypeLabelExpectedTypes ="$t('component.filepond.fileValidateTypeLabelExpectedTypes')"
          :labelMaxFileSizeExceeded ="$t('component.filepond.labelMaxFileSizeExceeded')"
          :labelMaxFileSize = "$t('component.filepond.labelMaxFileSize')"
          :labelTotalFileSizeExceeded ="$t('component.filepond.labelTotalFileSizeExceeded')"
          :labelMaxTotalFileSize ="$t('component.filepond.labelMaxTotalFileSize')">
        </vue-file-pond>
      
        <!-- Help text -->
        <div class="v-messages theme--light pl-2" v-show="!isError">
          <div class="v-messages__wrapper">
            <div class="v-messages__message">
              {{ helpText }}
              </div>
          </div>
        </div>
      
        <!-- Errormessage -->
        <div>
          <div class="input-group__details adjust-bottom" v-show="isError">
            <span class="input-group__messages input-group__error error--text">{{ errors.first(getValidationId) }}</span>    
          </div>
        </div>
      </div>

      <!-- VIEW -->
      <div v-if="mode === 'VIEW'">
        <form-field-preview :title="$t('component.fieldFileUpload.title')" :value="value"></form-field-preview>
      </div>

      <!-- PRINT -->
      <div v-if="mode === 'PRINT'" style="padding-top:20px">
        <PrintTextBox 
          height="120" 
          :title="$t('component.fieldFileUpload.printAttachments')"
          :helpText="$t('component.fieldFileUpload.printInfo')"
        ></PrintTextBox>
      </div>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IFileListField, IPondFile, IFileFieldOptions } from '@/models/IForm';
import AbstractItemListField from './AbstractItemListField';
import { FormFieldType, MutationType } from '@/models/Enums';
import FilePond from 'vue-filepond'; // Import FilePond
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import { Helper } from '@/utils/helper';
import AdminValidationManager from '@/components/admin/ValidationManager.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

// To support IE11 we need to install the filepond-polyfill files.
import 'filepond-polyfill/dist/filepond-polyfill.esm.js';

// Import plugins for FilePond
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type';

// Import styles for FilePond
import 'filepond/dist/filepond.min.css';
import { Validator } from 'vee-validate';
import AbstractSingleValueField from '@/components/field/AbstractSingleValueField';


/**
 * Component to upload files
 * @extends AbstractItemListField
 * @prop {IPondFile[]} files - Uploaded files
 */
@Component({
  components: {
    VueFilePond: FilePond(
      FilePondPluginFileValidateSize,
      FilePondPluginFileValidateType
    ),
    FieldToolbox,
    AdminValidationManager,
    PrintTextBox,
    FormFieldPreview,
    DisplayRulesControls
  }
})
export default class FieldFileUpload extends AbstractSingleValueField implements IFileListField {
  public type = FormFieldType.FileUpload;
  public tempFiles: IPondFile[] = [];
  public maxFileSize: string|undefined = process.env.VUE_APP_MAX_FILE_UPLOAD_SIZE;
  public maxFilesDefault: number = 10;

  @Prop() public field!: IFileListField;
  @Prop({ default: () => [] }) public files!: IPondFile[];

  public getFileTypeValidationAlternatives() {
    return [
      {label: this.$i18n.tc('component.fieldFileUpload.allowAnyFileType'), value: ''},
      {label: this.$i18n.tc('component.fieldFileUpload.allowOnlyImages'), value: 'Images'},
      {label: this.$i18n.tc('component.fieldFileUpload.allowOnlyPdfAndWord'), value: 'PdfAndWord'},
    ];
  }

  public handleFileAdded(error, file) {
    if (!error) {
      const pondFile: IPondFile = {
        options: { type: 'limbo', file: file.file }
      };
      this.files.push(pondFile);
      this.updateFilesInStore();
    }
  }

  public handleFileRemoved(file) {
    const index = this.files.findIndex(
      element => element.options.file.name === file.file.name
    );
    if (index !== -1) {
      this.files.splice(index, 1);
      this.updateFilesInStore();
    }
  }

  private updateFilesInStore() {
    this.storeUpdateFormField(this.files, 'files');
    this.storeUpdateFormField((this.files || []).map(v => v.options.file.name).join(', '), 'value');
  }

  get getLabelIdle() {
    return this.files!.length === 0 ?
      this.$i18n.t('component.filepond.viewLabelIdleEmpty').toString()
      : this.files.length + this.$i18n.t('component.filepond.viewLabelIdle').toString();
  }

  get acceptedFileTypes(): string {
    const fileTypes = {
      PdfAndWord: [
        // support.office.com/en-us/article/file-formats-that-work-with-irm-d5d82a8e-e257-4518-a282-6ed0ae13eb63
        // https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-word.document.macroEnabled.12'
      ],
      Images: [
        'image/jpeg',
        'image/jpg',
        'image/png'
      ]
    };
    if (this.fileTypeValidation in fileTypes) {
      return fileTypes[this.fileTypeValidation].join(', ');
    } else {
      return fileTypes.Images.concat(fileTypes.PdfAndWord).join(', ');
    }
  }

  get fileTypeValidation(): string {
    return this.fieldOptions.fileTypeValidation || '';
  }

  set fileTypeValidation(fileTypeValidation: string) {
    this.$store.commit(MutationType.UpdateFormField, {
      fieldId: this.id,
      newValue: {...this.fieldOptions, fileTypeValidation},
      fieldProperty: 'fieldOptions'
    });
  }

  get allowMultiple(): boolean {
    return !!this.fieldOptions.allowMultiple;
  }

  set allowMultiple(allowMultiple: boolean) {
    this.$store.commit(MutationType.UpdateFormField, {
      fieldId: this.id,
      newValue: {...this.fieldOptions, allowMultiple},
      fieldProperty: 'fieldOptions'
    });
  }

  get maxFiles(): number {
    return this.fieldOptions.maxFiles || this.maxFilesDefault;
  }

  set maxFiles(newMaxFiles: number) {
    this.$store.commit(MutationType.UpdateFormField, {
      fieldId: this.id,
      newValue: {...this.fieldOptions, maxFiles: newMaxFiles},
      fieldProperty: 'fieldOptions'
    });
  }
}
</script>

<style scoped lang="scss">
.field-file-upload { 
  padding-bottom: 16px;

  /* error state color */
  [data-filepond-item-state*="error"] .filepond--item-panel,
  [data-filepond-item-state*="invalid"] .filepond--item-panel {
    background-color: $error;
  }
  /* success state color */
  [data-filepond-item-state*="complete"] .filepond--item-panel,
  [data-filepond-item-state="idle"] .filepond--item-panel {
    background-color: $success;
  }
  /* the border radius of the drop area */
  .filepond--panel-root {
    border-radius: 4px 4px 0px 0px;
    border-style: dashed;
    border-color: gray;
    border-top-width: 2px;
    border-right-width: 2px;
    border-bottom-width: 2px;
    border-left-width: 2px;
  }
  .error--text {
    .filepond--drop-label {
      color: $error;
    }
    .filepond--panel-root {
      border-color: $error;
    }
  }

  .filepond--root {
      margin-bottom: 8px;
    }

  /* the border radius of the file item */
  .filepond--item-panel {
    border-radius: 4px;
  }
  .filepond--drop-label label {
    cursor: pointer;
  }

  .field-file-upload-view {
    /* the border radius of the drop area */
    .filepond--panel-root {
      border-radius: 4px 4px 0px 0px;
      border: none;
    }
  }

  .field-title {
    display: block;
    padding-bottom: 8px;
  }
}
</style>
