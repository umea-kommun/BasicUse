<template>
  <div class="field-check-box">

    <!-- ADMIN -->    
      <div v-if="mode === 'ADMIN'">          
          <!-- Title -->
          <v-text-field v-model="title"
            :label="$t('app.admin.componentTitle')"
            :hint="$t('app.admin.componentTitleHint')"
            v-validate="'required'"
            :data-vv-name="getValidationId + 'title'"
            :data-vv-as="$t('app.admin.field.title')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(getValidationId + 'title', validationScope)"
            box
          ></v-text-field>
          <!-- HelpText -->
          <v-text-field v-model="helpText"
            :label="$t('app.admin.componentHelpText')"
            :hint="$t('app.admin.componentHelpTextHint')"
            box
          ></v-text-field>

          <!-- List-Items -->
          <admin-item-list-manager :items.sync="items" :fieldId="id" :allowMultipleChecked="true"></admin-item-list-manager>

          <!-- Validation -->
          <admin-validation-manager v-bind:value.sync="validation" :availableRules="availableRules"></admin-validation-manager>

          <!-- DisplayRule -->
          <display-rules-controls :field="field"></display-rules-controls>

      </div>

    <!-- TOOLBOX -->    
    <div v-if="mode === 'TOOLBOX'">
      <field-toolbox 
        v-on:onDoubleClick="onDoubleClick()"
        :title="$t('component.fieldCheckBox.title')"
        icon="check_box"
        :description="$t('component.fieldCheckBox.description')"
      ></field-toolbox>
    </div>
    
    <!-- EDIT -->
    <base-form-field 
      v-if="mode === 'EDIT'"
      :label="title" 
      :label-for="getValidationId"
      :isRequired="isRequired"
      :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">

      <!-- Checkbox i redigeringsläge -->
      <v-checkbox        
        :aria-describedby="getValidationId"        
        v-for="item in items"
        v-model="checkedItems"        
        :value="item"
        :label="item.title"
        :key="item.id"            
        :hint="helpText" 
        color="primary" 
        type="checkbox" 
        v-validate.continues="isRequired ? { oneOrMoreIsChecked: [items] } : null" 
        :required="isRequired"
        :error="isError"
        :data-vv-name="getValidationId" 
        :data-vv-as="title" 
        :data-vv-scope="validationScope"  
        hide-details
        persistent-hint
      ></v-checkbox>

      <!-- Help text -->
      <div class="v-messages theme--light" v-if="helpText && !isError ">
        <div class="v-messages__wrapper">
          <div class="v-messages__message">
            {{ helpText }}
            </div>
        </div>
      </div>

      <!-- Error message -->
      <div class="input-group__details" v-if="isError">
        <span class="input-group__messages input-group__error error--text">{{ errors.first(getValidationId, validationScope) }}</span><v-icon>{{ getValidationIcon }}</v-icon>    
      </div>

    </base-form-field>

    <!-- VIEW -->
    <div v-if="mode === 'VIEW'">
      <form-field-preview :title="title" :value="checkedItemsPreviewValue"></form-field-preview>
    </div>

    <!-- PRINT -->
    <div v-if="mode === 'PRINT'">
      <PrintCheckBoxList :title="title" :helpText="helpText" :items="items" :multiple="true"></PrintCheckBoxList>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import AbstractItemListField from './AbstractItemListField';
import { IItem, IItemListField } from '@/models/IForm';
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
 * Komponent för en eller flera kryssrutor i ett formulär.
 * @extends AbstractItemListField
 */

@Component({
  components: {
    AdminItemListManager,
    AdminValidationManager,
    FieldToolbox,
    BaseScreenReader,
    BaseFormField,
    PrintCheckBoxList,
    FormFieldPreview,
    DisplayRulesControls
  }
})
export default class FieldCheckBox extends AbstractItemListField {
  public type = FormFieldType.CheckBox;

  private itemsToOptionsArray() {
    return this.items.map(item => {
      return {text: item.title, value: item.title};
    });
  }
}
</script>

<style scoped lang="scss">
.field-check-box {
  .v-input--selection-controls {
    padding: 0;
    margin-top: 0;
    margin-bottom: 8px;
  }
}
</style>
