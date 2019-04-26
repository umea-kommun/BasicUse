<template>
  <div class="field-select-list">
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
          box>
        </v-text-field>
        <!-- HelpText -->
        <v-text-field v-model="helpText"
          :label="$t('app.admin.componentHelpText')"
          :hint="$t('app.admin.componentHelpTextHint')"
          box>
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
        :title="$t('component.fieldSelectList.title')"
        icon="arrow_drop_down_circle"
        :description="$t('component.fieldSelectList.description')"
      ></field-toolbox>
    </div>

    <!-- EDIT -->
    <base-form-field 
      v-if="mode === 'EDIT'"
      :label="title" 
      :label-for="getValidationId"
      :isRequired="isRequired"
      :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">
      <v-select
        v-model="selectedItem"
        :items="items"      
        item-value="id"
        item-text="title"  
        :return-object="true"
        :id="getValidationId"                
        :hint="helpText"
        v-validate="validationRules"
        :data-vv-name="getValidationId"    
        :data-vv-as="title"    
        :data-vv-scope="validationScope" 
        :error-messages="errors.first(getValidationId, validationScope)"
        :append-icon="isSuccess? 'check_circle_outline' : isError ? 'warning' : '$vuetify.icons.dropdown'"
        :success="isSuccess"
        persistent-hint
      />
    </base-form-field>
    
    <!-- VIEW -->
    <div v-if="mode === 'VIEW'">
      <form-field-preview :title="title" :value="selectedItemTitle"></form-field-preview>
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
import { FormFieldType } from '@/models/Enums';
import AdminItemListManager from '@/components/admin/AdminItemListManager.vue';
import AdminValidationManager from '@/components/admin/ValidationManager.vue';
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import AbstractItemListField from '@/components/field/AbstractItemListField';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';
import PrintCheckBoxList from './print/PrintCheckBoxList.vue';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';
import BaseFormField from '@/components/base/BaseFormField.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

/**
 * Drop down list alá HMTL select element
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
export default class FieldSelectList extends AbstractItemListField {
  public type = FormFieldType.SelectList;

  get selectedItemTitle(): string {
    if (this.selectedItem) {
      return this.selectedItem.title || '';
    }
    return '';
  }
}
</script>

<style scoped lang="scss">
.field-select-list {
   .field {
    padding-bottom: 24px;
  }
  .field-title {
    display: block;    
    padding-bottom: 8px;
  }
}
</style>