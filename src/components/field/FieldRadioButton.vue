<template>
  <div class="field-radio-button">
    
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

      <!-- List-Items -->
      <admin-item-list-manager :items.sync="items" :fieldId="id"></admin-item-list-manager>

      <!-- Validation -->
      <admin-validation-manager v-bind:value.sync="validation" :availableRules="availableRules"></admin-validation-manager>

      <!-- DisplayRule -->
      <display-rules-controls :field="field"></display-rules-controls>

    </div>

    <!-- TOOLBOX -->    
    <div v-if="mode === 'TOOLBOX'">
      <field-toolbox 
        v-on:onDoubleClick="onDoubleClick()"
        :title="$t('component.fieldRadioButton.title')"
        icon="radio_button_checked"
        :description="$t('component.fieldRadioButton.description')"
      ></field-toolbox>
    </div>

    <!-- EDIT -->
    <base-form-field 
      v-if="mode === 'EDIT'"
      :label="title" 
      :label-for="getValidationId"
      :isRequired="isRequired"
      :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">
      
      <v-radio-group 
        v-model="selectedItem"
        v-validate.continues="isRequired ? { oneOrMoreIsChecked: [items] } : null" 
        :id="getValidationId"
        :data-vv-name="getValidationId"
        :data-vv-as="title" 
        :data-vv-scope="validationScope"
        :required="isRequired"
        :error="isError"   
        :error-messages="errors.first(getValidationId, validationScope)"  
        :hint="helpText" 
        persistent-hint
      > 
        <v-radio
          v-for="item in items"
          :value="item" 
          :label="item.title"          
          :key="item.id" 
          color="primary"           
        ></v-radio>
      </v-radio-group>

    </base-form-field>

    <!-- VIEW -->
    <div v-if="mode === 'VIEW'">
      <form-field-preview :title="title" :value="checkedItemsPreviewValue"></form-field-preview>
    </div>

    <!-- PRINT -->
    <div v-if="mode === 'PRINT'">
      <PrintCheckBoxList :title="title" :helpText="helpText" :items="items" :multiple="false"></PrintCheckBoxList>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IItem, IItemListField } from '@/models/IForm';
import AbstractItemListField from './AbstractItemListField';
import { FormFieldType } from '@/models/Enums';
import AdminItemListManager from '@/components/admin/AdminItemListManager.vue';
import AdminValidationManager from '@/components/admin/ValidationManager.vue';
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

/**
 * Component for a list Radio buttons
 * @extends AbstractItemListField
 */

@Component({
  components: {
    AdminItemListManager,
    AdminValidationManager,
    FieldToolbox,
    BaseScreenReader,
    PrintCheckBoxList,
    BaseFormField,
    FormFieldPreview,
    DisplayRulesControls
  }
})
export default class FieldRadioButton extends AbstractItemListField {
    public type = FormFieldType.RadioButton;
}
</script>

<style scoped lang="scss">
.field-radio-button {
  .v-input--selection-controls {
    padding: 0;
    margin-top: 0px;
    margin-bottom: 8px;
  }
}

</style>