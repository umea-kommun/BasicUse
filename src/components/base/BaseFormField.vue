<template>
    <div class="component-base-form-field">
      <label class="subheading" :for="labelFor" :class="errorDisplay ? 'validation-failed':''">
        {{label}} <span v-if="isRequired" aria-hidden="true">*</span>
      </label>
      <slot></slot>
    </div> 
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * Component used to display arbitrary form elements provided by veutify.
 * It is specialized to display any type of veutify form input in the
 * manner we want
 */
@Component
export default class BaseFormField extends Vue {
  /**
   * Label text
   */
  @Prop() public label!: string;

  /**
   * Id of the input provided in the slot. Will be used
   * to connect the label-element to the input
   */
  @Prop() public labelFor!: string;

  /**
   * Should the label display that this input has a validation error
   */
  @Prop() public errorDisplay!: boolean;

  /**
   */
  @Prop() public isRequired!: boolean;
}
</script>

<style lang="scss">
// This css won't have effect if the styling is scoped!!!
.component-base-form-field {

  // All inputs
  .v-input {
    margin-top: 0 !important;
    padding-top: 0 !important;
    input {
      padding: 8px 8px 14px;
      max-height: 40px;
    }
    i {
      margin-right: 18px;
      margin-top: 4px;
    }
  }

  .v-input__slot {
    background-color: rgba(0, 0, 0, 0.06);
    border-top: 0;
    padding-top: 5px; 
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }

 

  // help text
  .v-messages {
    height: 15px;
  }

  // Select elements
  .v-select__selection {
    margin-left: 8px;
  }

  // Textarea
  .v-textarea textarea {
    padding-left: 8px;
    padding-right: 8px;
  }

  // Radio buttons / checkboxes
  .v-input--checkbox,
  .v-input--radio-group {
    
    .v-input__slot {
      background: none;
      .v-label {
        color: $black;
      }
    }
  }

  .v-input--checkbox:last-child .v-input__slot {
    padding-bottom: 15px;
  }
  
  .v-input--radio-group .v-input__control {
    padding: 0;
  }
  
  .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin-bottom: 0;
    padding-bottom: 0;
  }

  // Label    
  label {
    border-top:0;
    padding: 0px 0px 3px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    width: 100%;
    display: block;
    &.validation-failed {
      color: red;
    }
  }
}
</style>
