<template>
    <div class="print-check-box-list">
      <p class="label">
        <strong>{{ title }}</strong><br>
        <small v-if="multiple && items.length > 1">
          {{ $t('component.PrintCheckBoxList.oneOrMoreSelections') }}
        </small>
        <small v-if="informOnlyOneSelectionAllowed()">
          {{ $t('component.PrintCheckBoxList.oneSelectionOnly') }}
        </small>
      </p>
      <p class="option" v-for="item in items" :key="item.id">
        <v-icon>crop_square</v-icon>
        <span>{{ item.title }}</span>
      </p>
      <small v-if="helpText" v-html="helpText"></small>
    </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Vue } from 'vue-property-decorator';
import { IItem } from '@/models/IForm';


/**
 * Component that renders a list of check boxes, sutiable for a on-paper-ui
 */
@Component({
  components: {
  }
})
export default class PrintTextBoxList extends Vue {
  @Prop( { default: '' }) public title!: string;
  @Prop( { default: '' }) public helpText!: string;
  @Prop( { default: true }) public multiple!: boolean;
  @Prop() public items!: IItem[];

  public informOnlyOneSelectionAllowed(): boolean {
    let shouldInform = false;
    if (!this.multiple && this.items.length > 1) {
      // Try to find out if this is something other than a yes-no question
      const otherThanYesNoOptions = this.items
        .filter(item => ['ja', 'nej'].indexOf((item.title || '').toLowerCase()) === -1);
      shouldInform = otherThanYesNoOptions.length > 0;
    }
    return shouldInform;
  }

}
</script>

<style scoped lang="scss">

.print-check-box-list {
  min-height: 85px;
  margin-top: 20px;
} 

.print-check-box-list,
.print-check-box-list p {
  page-break-inside: avoid;
}

</style>
