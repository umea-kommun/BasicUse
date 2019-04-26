<template>
    <div class="field-text-box">
        <!-- ADMIN -->
        <div v-if="mode === 'ADMIN'">            
          <v-text-field 
            v-model="title"
            :label="$t('app.admin.field.title')"
            :hint="$t('app.admin.field.titleHelpText')"                          
            v-validate="'required'"
            :data-vv-name="getValidationId + 'title'"
            :data-vv-scope="validationScope"
            :data-vv-as="$t('app.admin.field.title')"
            :error-messages="errors.first(getValidationId + 'title', validationScope)"
            box>
          </v-text-field>
          <v-text-field 
            v-model="helpText"
            :label="$t('app.admin.field.helpText')"
            :hint="$t('app.admin.field.helpTextHelpText')"
            box>
          </v-text-field>
          <v-text-field 
            v-model="value"
            :label="$t('app.admin.field.defaultValue')"
            :hint="$t('app.admin.field.defaultValueHelpText')"
            box>
          </v-text-field>

          <!-- Validation -->
          <admin-validation-manager v-bind:value="validation" v-on:update:value="validation = $event" :availableRules="availableRules"></admin-validation-manager>

          <!-- DisplayRule -->
          <display-rules-controls :field="field"></display-rules-controls>

        </div>

        <!-- TOOLBOX -->
        <div v-if="mode === 'TOOLBOX'">
            <field-toolbox 
              v-on:onDoubleClick="onDoubleClick()"
              :title="$t('component.fieldTextBox.title')"
              icon="short_text"
              :description="$t('component.fieldTextBox.description')">
            </field-toolbox>
        </div>

        <!-- EDIT -->
        <base-form-field 
          v-if="mode === 'EDIT'"
          :label="title" 
          :label-for="getValidationId"
          :isRequired="isRequired"
          :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">
          <v-text-field 
            v-model="value"
            :id="getValidationId"                        
            :hint="helpText"
            v-validate="validationRules"
            :data-vv-name="getValidationId"
            :data-vv-as="title"
            :data-vv-scope="validationScope"
            data-vv-value-path="value"
            :error-messages="errors.first(getValidationId, validationScope)"
            :append-icon="getValidationIcon"
            :success="isSuccess"
            :required="isRequired">
          </v-text-field>
        </base-form-field>        

        <!-- VIEW -->
        <div v-if="mode === 'VIEW'">
          <form-field-preview :title="title" :value="value"></form-field-preview>
        </div>

        <!-- PRINT -->
        <div v-if="mode === 'PRINT'">
          <PrintTextBox :title="title" :helpText="helpText"></PrintTextBox>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import AbstractSingleValueField from './AbstractSingleValueField';
import {FormFieldType, MutationType} from '@/models/Enums';
import AdminValidationManager from '@/components/admin/ValidationManager.vue';
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import PrintTextBox from './print/PrintTextBox.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

/**
 * Component textbox in a form
 * @extends AbstractSingleValueField
 */
@Component({
  components: {
    AdminValidationManager,
    FieldToolbox,
    BaseScreenReader,
    PrintTextBox,
    FormFieldPreview,
    BaseFormField,
    DisplayRulesControls
  }
})
export default class FieldTextBox extends AbstractSingleValueField {
  public type = FormFieldType.TextBox;
  public showTooltip: boolean = true;
}

</script>

<style scoped lang="scss">

</style>
