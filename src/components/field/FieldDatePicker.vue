<template>
    <div class="field-date-picker">

        <!--ADMIN -->
        <div v-if="mode === 'ADMIN'">
            <!-- Title -->            
            <v-text-field v-model="title"
              :label="$t('app.admin.field.title')"
              :hint="$t('app.admin.field.titleHelpText')"                          
              v-validate="'required'"
              :data-vv-name="getValidationId + 'title'"
              :data-vv-as="$t('app.admin.field.title')"
              :data-vv-scope="validationScope"
              :error-messages="errors.first(getValidationId + 'title', validationScope)"
              box>
            </v-text-field>
            <!-- HelpText -->
            <v-text-field v-model="helpText"
              :label="$t('app.admin.field.helpText')"
              :hint="$t('app.admin.field.helpTextHelpText')"
              box>
            </v-text-field>
            <v-dialog ref="dialog"
              v-model="showDatePicker"
              :return-value.sync="value"
              lazy
              full-width
              width="290px"
              transition="slide-y-transition">

              <v-text-field slot="activator"
                v-model="value"                              
                :label="$t('app.admin.field.defaultValue')"
                :hint="$t('app.admin.field.titleHelpText')"
                persistent-hint
                :append-icon="'event'"                              
                box>
              </v-text-field>

              <!-- Datepicker -->
              <v-date-picker v-model="value"
                :locale="locale()"
                scrollable>
                <v-spacer></v-spacer>
                <v-btn flat @click="showDatePicker = false" v-bind:title="$t('app.nav.cancel')">{{ $t("app.nav.cancel") }}</v-btn>
                <v-btn flat color="primary" @click="$refs.dialog.save(value)" v-bind:title="$t('app.nav.select')">{{ $t("app.nav.select") }}</v-btn>
              </v-date-picker>
            </v-dialog>

            <!-- Validation -->
            <admin-validation-manager v-bind:value.sync="validation" :availableRules="availableRules"></admin-validation-manager>

            <!-- DisplayRule -->
            <display-rules-controls :field="field"></display-rules-controls>

        </div>

        <!-- TOOLBOX -->
        <div v-if="mode === 'TOOLBOX'">
          <field-toolbox v-on:onDoubleClick="onDoubleClick()"
            :title="$t('component.fieldDatePicker.title')"
            icon="date_range"
            :description="$t('component.fieldDatePicker.description')">
          </field-toolbox>
        </div>

        <!-- EDIT -->
        <base-form-field 
          v-if="mode === 'EDIT'"
          :label="title" 
          :label-for="getValidationId"
          :isRequired="isRequired"
          :errorDisplay="errors.first(getValidationId, validationScope) ?  true:false">

          <!-- Text field that displays the date -->
          <v-text-field 
            v-model="value"
            :id="getValidationId"                            
            :hint="helpText"
            v-validate="validationRules + '|date_format:YYYY-MM-DD'"
            :data-vv-name="getValidationId"
            :data-vv-as="field.title"    
            :data-vv-scope="validationScope"
            :data-vv-value-path="value"
            :error-messages="errors.first(getValidationId, validationScope)"
            :error="isError"
            :required="isRequired"
            :append-icon="isSuccess? 'check_circle_outline' : isError ? 'warning' : 'event'"
            @click:append="showDatePicker = true"
            @keydown.space.native.prevent="showDatePicker = true"
            @keydown.enter.native.prevent="showDatePicker = true"
            :success="isSuccess"
            persistent-hint
            >
          </v-text-field>

          <v-dialog 
            ref="dialog"
            v-model="showDatePicker"
            :return-value.sync="value"
            lazy
            full-width
            width="290px"
            transition="slide-y-transition"                     
            >

            <!-- Datepicker -->
            <v-date-picker 
              v-model="value"
              :locale="locale()"
              scrollable                           
              >
              <v-spacer></v-spacer>
              <v-btn flat @click="showDatePicker = false">{{ $t("app.nav.cancel") }}</v-btn>
              <v-btn flat color="primary" @click="$refs.dialog.save(value)">{{ $t("app.nav.select") }}</v-btn>
            </v-date-picker>
          </v-dialog>        
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
import { Component } from 'vue-property-decorator';
import AbstractSingleValueField from './AbstractSingleValueField';
import { FormFieldType, MutationType } from '@/models/Enums';
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
export default class FieldDatePicker extends AbstractSingleValueField {
  public type = FormFieldType.DatePicker;
  private errors: any; // Supplied by $validator added in parent class
  private showDatePicker: boolean = false;

  public locale() {
    return this.$i18n ? this.$i18n.locale : null;
  }

  /**
   * Get title from state
   * @return {string} Title for field
   */
  get title(): string {
    if (!this.field.title) {
      return this.field.title + this.$t('component.fieldDatePicker.dateExpression');
    } else {
      return this.field ? (this.field.title ? this.field.title : '') : '';
    }
  }

  /**
   * Set title in state
   * @param {string} title - Title to set
   */
  set title(title: string) {
    this.$store.commit(MutationType.UpdateFormField, { fieldId: this.id, newValue: title, fieldProperty: 'title'} );
  }

  get value(): string {
    const dateString = (this.field.value || '').trim();
    return /^(\d{4})\-(\d{2})\-(\d{2})$/.test(dateString) ? dateString : '';
  }

  set value(value: string) {
    this.storeUpdateFormField(value, 'value');
  }
}
</script>

<style scoped lang="scss">
.field-date-picker {
  .field {
    padding-bottom: 24px;
  }
  .field-title {
    display: block;    
    padding-bottom: 8px;
  }
}
</style>
