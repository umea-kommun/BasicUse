<template>
  <div class="form-validation-summary">    
    <v-alert type="error" outline :value="true" transition="slide-y-transition">
      <!-- Empty link used to place focus -->
      <base-screen-reader slot="default" aria-role="alert" :visible-on-screen="true">  
        <a href="#" id="form-validation-summary" aria-hidden="true"></a>
        <label class="field-title body-2">
          <span>{{ $tc('component.formValidationSummary.error', errors.items.length, { count: errors.items.length }) }}. </span>
          <span aria-hidden="true">{{ $t('component.formValidationSummary.resolution') }}.</span>
        </label>
        <ul>         
          <li v-for="(error, index) in errors.items" :key="index" ><a :href="'#' + error.field" :aria-labelledby="error.field">{{ error.msg }}</a>        
          </li>      
        </ul>   
      </base-screen-reader> 
    </v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { AriaRole } from '@/models/Enums';
import BaseScreenReader from '@/components/base/BaseScreenReader.vue';

/**
 * Component to render a summary of validation errors. List errors and provide shortcut to input field.
 * @description WCAG: show where validation error occurs and give clear instructions (3.3.1)
 * @doc See https://cantina.co/form-errors-screen-readers-can-access how to use validation summary with screen readers
 * @prop {Array<string>} validationErrors - Array with validation error messages
 */

@Component({
  components: {
    BaseScreenReader
  }
})
export default class FormValidationSummary extends Vue {
  @Provide('validator') public $validator = this.$validator;
  @Prop() public validationErrors!: object[];
}
</script>

<style scoped lang="scss">
.form-validation-summary { 
  .field-title {
    padding-bottom: 8px;
    display: block;
  }  
}
</style>