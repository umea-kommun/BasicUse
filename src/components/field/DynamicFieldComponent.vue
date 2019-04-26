<template>
  <component
    :is="componentName" 
    :field="field" 
    :mode="mode"
    :class="classList"
    :validationScope="validationScope"
    tabindex="0"
    ></component>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IFormField } from '@/models/IForm';
import { Helper } from '@/utils/helper';
import FieldRadioButton from '@/components/field/FieldRadioButton.vue';
import FieldDatePicker from '@/components/field/FieldDatePicker.vue';
import FieldCheckBox from '@/components/field/FieldCheckBox.vue';
import FieldIntegration from '@/components/field/FieldIntegration.vue';
import FieldFileUpload from '@/components/field/FieldFileUpload.vue';
import FieldTextArea from '@/components/field/FieldTextArea.vue';
import FieldTextBox from '@/components/field/FieldTextBox.vue';
import FieldSection from '@/components/field/FieldSection.vue';
import FieldSelectList from '@/components/field/FieldSelectList.vue';

/**
 * Load a field component dynamically
 * @prop {IFormField} field - Field data, implementing IFormField
 * @prop {string} mode - PRINT|VIEW|EDIT|ADMIN
 */

@Component({
  components: {
    FieldTextBox,
    FieldDatePicker,
    FieldRadioButton,
    FieldCheckBox,
    FieldIntegration,
    FieldFileUpload,
    FieldTextArea,
    FieldSection,
    FieldSelectList
  }
})
export default class DynamicFieldComponent extends Vue {
  @Prop() public field!: IFormField;
  @Prop() public mode!: string;
  @Prop({default: ''}) public classList!: string;
  @Prop({default: ''}) public validationScope!: string;

  get componentName() {
    return Helper.getComponentName(this.field.type);
  }
}
</script>

<style scoped lang="scss">
.base-image img {
  max-width: 100%;  
}
</style>
