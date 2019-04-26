<template>
    <div class="field-text-area">

        <!-- ADMIN -->
        <div v-if="mode === 'ADMIN'">            
            <v-text-field 
              v-model="title"
              :label="$t('app.admin.field.title')"
              :hint="$t('app.admin.field.titleHelpText')"
              v-validate="'required'"
              :data-vv-name="getValidationId + 'title'"
              :data-vv-as="$t('app.admin.field.title')"
              :data-vv-scope="validationScope"
              :error-messages="errors.first(getValidationId + 'title', validationScope)"
              box>
            </v-text-field>
            <v-text-field v-model="helpText"
              :label="$t('app.admin.field.helpText')"
              :hint="$t('app.admin.field.helpTextHelpText')"
              box>
            </v-text-field>
            <v-textarea 
              v-model="value"
              :label="$t('app.admin.field.defaultValue')"
              :hint="$t('app.admin.field.defaultValueHelpText')"
              box>
            </v-textarea>

            <!-- Validation -->
            <admin-validation-manager v-bind:value="validation" v-on:update:value="validation = $event" :availableRules="availableRules"></admin-validation-manager>

            <!-- DisplayRule -->
            <display-rules-controls :field="field"></display-rules-controls>

        </div>

        <!-- TOOLBOX -->
        <div v-if="mode === 'TOOLBOX'">
            <field-toolbox 
              v-on:onDoubleClick="onDoubleClick()"
              :title="$t('component.fieldTextArea.title')"
              icon="view_headline"
              :description="$t('component.fieldTextArea.description')">
            </field-toolbox>
        </div>

        <!-- EDIT -->
        <base-form-field 
          v-if="mode === 'EDIT'"
          :label="title" 
          :label-for="getValidationId"
          :isRequired="isRequired"
          :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">

          <v-textarea 
            v-model="value"
            v-validate="validationRules"
            :id="getValidationId"
            :hint="helpText"
            :data-vv-name="getValidationId"
            :data-vv-as="title"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(getValidationId, validationScope)"
            :required="isRequired"
            :append-icon="getValidationIcon"
            :success="isSuccess">
          </v-textarea>

        </base-form-field>
        
        <!-- VIEW -->
        <div v-if="mode === 'VIEW'">
          <form-field-preview :title="title" :value="value"></form-field-preview>
        </div>

        <!-- PRINT -->
        <div v-if="mode === 'PRINT'">
          <PrintTextBox :title="title" :helpText="helpText" height="240"></PrintTextBox>
        </div>

    </div> 
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import AbstractSingleValueField from './AbstractSingleValueField';
import { FormFieldType } from '@/models/Enums';
import AdminValidationManager from '@/components/admin/ValidationManager.vue';
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

/**
 * @extends AbstractSingleValueField
 */
@Component({
  components: {
    AdminValidationManager,
    FieldToolbox,
    BaseScreenReader,
    BaseFormField,
    PrintTextBox,
    FormFieldPreview,
    DisplayRulesControls
  }
})
export default class FieldTextArea extends AbstractSingleValueField {
  public type = FormFieldType.TextArea;
}
</script>

<style lang="scss">
.field-text-area {
  .v-messages__message {
    line-height: inherit;
  }
  .field {
    padding-bottom: 24px;
  }
  .field-title {
    display: block;    
  }
}
</style>
