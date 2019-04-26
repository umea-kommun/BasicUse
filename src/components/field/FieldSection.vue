<template>
  <div class="field-section">
    
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
        box
      ></v-text-field>
        <v-textarea v-model="value"
        :label="$t('app.admin.field.description')"
        :hint="$t('app.admin.field.descriptionHelpText')"
        box>
      </v-textarea>

      <!-- DisplayRule -->
      <display-rules-controls :field="field"></display-rules-controls>

    </div>
    
    <!-- TOOLBOX -->    
    <div v-if="mode === 'TOOLBOX'">
      <field-toolbox 
        v-on:onDoubleClick="onDoubleClick()"
        :title="$t('component.fieldSection.title')"
        icon="title"
        :description="$t('component.fieldSection.description')"
      ></field-toolbox>
    </div>

    <!-- VIEW/EDIT/PRINT -->
    <BaseTitle 
      v-if="mode === 'VIEW' || mode === 'EDIT' || mode === 'PRINT'" 
      :title="title" 
      :alert="mode === 'VIEW' ? '':value"
      :mode="mode === 'PRINT' ? 'PRINT':'DEFAULT'"
    ></BaseTitle>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AbstractSingleValueField from '@/components/field/AbstractSingleValueField';
import FieldToolbox from '@/components/field/FieldToolbox.vue';
import BaseTitle from '@/components/base/BaseTitle.vue';
import DisplayRulesControls from '@/components/admin/DisplayRulesControls.vue';

/**
 * Component to divide a form in sections. A section contains a title and an optional description.
 */

@Component({
  components: {
    FieldToolbox,
    BaseTitle,
    DisplayRulesControls
  }
})
export default class FieldSection extends AbstractSingleValueField {
}
</script>

<style scoped lang="scss">


</style>