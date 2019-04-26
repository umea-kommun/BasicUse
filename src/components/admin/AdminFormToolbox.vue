<template>
  <div class="admin-form-toolbox">      
    <v-container pa-0>
      <draggable class="flex-container" 
        v-model="list" 
        :clone="addNewFieldToFormByDragging" 
        :options="draggableOptions">
        <div
            v-for="field in list" 
            v-bind:key="field.id" 
            v-bind:is="helper.getComponentName(field.type)" 
            v-bind="field" 
            mode="TOOLBOX"
            v-on:onDoubleClick="addNewFieldToForm(field)"       
            class="flex-item"     
          >
        </div>
      </draggable>
    </v-container>
  </div>          
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { IFormField, IListItem } from '@/models/IForm';
import { FormFieldType, FormMode } from '@/models/Enums';
import { Helper} from '@/utils/helper';
import FormFieldHelper from '@/models/FormFieldHelper';
import FieldRadioButton from '@/components/field/FieldRadioButton.vue';
import FieldDatePicker from '@/components/field/FieldDatePicker.vue';
import FieldCheckBox from '@/components/field/FieldCheckBox.vue';
import FieldIntegration from '@/components/field/FieldIntegration.vue';
import FieldFileUpload from '@/components/field/FieldFileUpload.vue';
import FieldTextArea from '@/components/field/FieldTextArea.vue';
import FieldTextBox from '@/components/field/FieldTextBox.vue';
import FieldSelectList from '@/components/field/FieldSelectList.vue';
import FieldSection from '@/components/field/FieldSection.vue';
import Draggable from 'vuedraggable';

/**
 * Administration of E-service
 */
@Component({
  components: {
    Draggable,
    FieldTextBox,
    FieldDatePicker,
    FieldRadioButton,
    FieldCheckBox,
    FieldIntegration,
    FieldFileUpload,
    FieldTextArea,
    FieldSelectList,
    FieldSection
  }
})
export default class AdminFormToolbox extends Vue {
  public list: IFormField[] = [];
  public clone: string = '';

  private draggableOptions = {
    sort: false,
    element: 'testar',
    group: {name: 'draggableField', pull: 'clone', put: false}
  };

  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }

  /**
   * Reading data when component is created.
   */
  public async created() {
    for (const fieldType of Object.values(FormFieldType)) {
      // Skipping FieldIntegration for now
      if (fieldType === FormFieldType.Integration) {
        continue;
      }
      const fieldTemplate = FormFieldHelper.createEmptyField(fieldType);
      this.list.push(fieldTemplate);
    }
  }

  public addNewFieldToForm(itemToAdd: IFormField) {
    const newItem = FormFieldHelper.createFromCopy(itemToAdd);
    this.$emit('onAddField', newItem);
  }

  public addNewFieldToFormByDragging(itemToAdd) {
    return FormFieldHelper.createFromCopy(itemToAdd);
  }
}
</script>

<style scoped lang='scss'>
.admin-form-toolbox {

  .flex-container {    
    height: 100%;
    display: flex;
    flex-wrap: wrap;    
  }

  .flex-item {
    width: 100px;    
    padding-right: 10px;
    padding-bottom: 10px;
    flex-grow: 1;
  }
}
</style>