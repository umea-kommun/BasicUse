<template>
  <div class="display-rules-controls">
    
    <!-- ADMIN -->
    <!-- MotherQuestion -->
    <v-card color="#f4f4f4" v-if="isMother">
      <v-list-tile-title class="display-rule-title">
        {{ $t('component.adminDisplayRule.title')}}
      </v-list-tile-title>                
      <v-list-tile-sub-title v-for="displayRule in displayRules" :key="displayRule.guid">
        <v-list-tile-content
          class="display-rule-subtitle text--primary"
          v-if="guid === displayRule.fieldGuid"
          v-html="displayRule.title"
        ></v-list-tile-content>
      </v-list-tile-sub-title> 
    </v-card>

    <!-- DisplayRule -->
    <v-select
      class="display-rule"
      v-model="selectedDisplayRule"
      :items="displayRuleItemsForVSelect"
      item-value="guid"
      item-text="title"
      :label="$t('component.adminDisplayRule.addDisplayRule')"
      box
    ></v-select>    

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IDisplayRule, IItem, IFormField, IRootState } from '@/models/IForm';
import { MutationType } from '@/models/Enums';

/**
 * Component for Display Rules
 * @extends Vue
 */

@Component({
  components: {
  }
})
export default class DisplayRuleControls extends Vue {

  @Prop() public field!: IFormField;

  private sortArrayList(list) {
    // tslint:disable-next-line:only-arrow-functions
    return list.sort(function(a, b) {
      const x = a.title!.toLowerCase();
      const y = b.title!.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
  }

  get displayRules(): IDisplayRule[] {
    return this.$store.state.form.attributes.displayRules || [];
  }

  get displayRuleItemsForVSelect() {
    const temp = this.displayRules.slice(0) as any[];
    temp.splice(0, 0, {title: 'Ingen visningsregel vald', value: null});
    return temp;
  }

  /** Get selected item in displayRule
   * @return {IItem} Item that is selected
   */
  get selectedDisplayRule(): string {
    // Check if form have a displayRule
    return this.field.displayRuleGuid;
  }

  /**
   * Set selected item in mutation to formField for displayRuleGuid.
   * @param {IItem} item - Item that is selected in displayRuleItems
   */
  set selectedDisplayRule(displayRuleGuid: string) {
    // Send item to store
    this.$store.commit(MutationType.UpdateFormField, {
      fieldId: this.field.id,
      newValue: displayRuleGuid,
      fieldProperty: 'displayRuleGuid'
    });
  }

  /**
   * Checks for fieldGuid in all displayRules
   * and compares them to each field guid
   */
  get isMother(): boolean {
    const arrayOfDisplayRules = this.displayRules;
    return !!arrayOfDisplayRules.find(x => x.fieldGuid === this.guid);
  }

  /* Get Id from state
    * @return {string} Id for field
    */
  get guid(): string {
    return this.field ? (this.field.guid ? this.field.guid : '') : '';
  }
}
</script>

<style scoped lang="scss">
.display-rules-controls {
  .display-rule {
    margin-top: 30px;
  }
  .display-rule /deep/ .v-input__slot:before {
    border-style: none;
  }
  .display-rule /deep/ .v-input__slot:after {
    border-style: none;
  }
  .display-rule-title {
    margin-left: 10px;
  }
  .display-rule-subtitle {
    margin-left: 20px;
  }
}

</style>