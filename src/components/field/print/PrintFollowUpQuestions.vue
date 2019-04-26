<template>
  <table class="mt-5 mb-5" cellspacing="0">
    <tr>
      <th colspan="2">
        {{ field.title }}          
        <small>
          <br>
           {{ $t('component.PrintFollowUpQuestion.info') }}
        </small>  
        <small v-if="informOnlyOneSelectionAllowed()"> 
          <br>
          {{ $t('component.PrintCheckBoxList.oneSelectionOnly') }}
        </small>
      </th>
    </tr>
    <tr v-for="item in field.fieldOptions.items" :key="item.id">
      <td>
        <v-icon>crop_square</v-icon>
        <span>{{ item.title }}</span>
      </td>
      <td>
        <dynamic-field-component
          v-for="field in getChildFields(item)"
          :key="field.title"
          :field="field" 
          mode="PRINT"
          ></dynamic-field-component>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Vue } from 'vue-property-decorator';
import { IItemListField } from '@/models/IForm';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';
import { FormFieldType } from '@/models/Enums';

/**
 * Component that renders a question with follow-up questions
 */
@Component({
  components: {
    DynamicFieldComponent
  }
})
export default class PrintFollowUpQuestions extends Vue {
  @Prop() public field!: IItemListField | any;

  public getChildFields(item) {
    return item.childFields || [];
  }

  public informOnlyOneSelectionAllowed(): boolean {
    return this.field.type === FormFieldType.RadioButton || this.field.type === FormFieldType.SelectList;
  }
}
</script>

<style scoped lang="scss">
  $borderSettings: #666 solid 3px;
  small {
    font-weight: normal;
  }
  table {
    width: 100%;
  }
  td, th {
    border: $borderSettings;
    border-left:0;
    border-top:0;
    vertical-align: top;
    text-align: left;
    padding: 10px 15px;
  }
  td:first-child {
    width: 38%;
  }
  td:first-child, 
  th:first-child {
    border-left: $borderSettings;
  }  
  tr:first-child td {
    border-top: 0;
  }
  tr:first-child th {
    border-top: $borderSettings;
  }
</style>
