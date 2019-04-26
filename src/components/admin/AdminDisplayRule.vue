<template>
  <div class="admin-display-rule">
    <v-card>
      <v-menu bottom right style="float: right">
        <v-btn slot="activator" icon @click.native="createDisplayRuleAndOpenDialog">
          <v-icon color="primary">add_circle_outline</v-icon>
        </v-btn>
      </v-menu>
      <v-card-text>
        <template v-for="displayRule in displayRules">
          <v-chip
            label
            :key="displayRule.id"
            @click="openDisplayRuleDialog(displayRule)"
            class="displayRuleChip"
          >
            <v-icon class="pr-1">check_circle</v-icon>
            <span>{{ displayRule.title }}</span>
          </v-chip>
        </template>
        <span
            v-if="displayRules.length === 0"
          >{{ $t('component.adminDisplayRule.noDisplayRule') }}</span>
      </v-card-text>
    </v-card>
    <admin-display-rule-dialog
      v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
      v-if="showDialog"
      :displayRule="selectedDisplayRule"
      :isNew="isNewDisplayRule"
      v-on:onDialogCancel="showDialog = false"
      v-on:onDialogCreate="showDialog = false"
      v-on:onDialogUpdate="showDialog = false"
      v-on:onDialogDelete="showDialog = false"
    />
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IDisplayRule} from '@/models/IForm';
import { FormFieldType } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import AdminDisplayRuleDialog from '@/components/admin/AdminDisplayRuleDialog.vue';

/**
 * Administration of displayRules
 */
@Component({
  components: {
    AdminDisplayRuleDialog
  }
})
export default class AdminDisplayRule extends Vue {
  private showDialog: boolean = false;
  private isNewDisplayRule: boolean = false;
  private selectedDisplayRule!: IDisplayRule;

  public createDisplayRuleAndOpenDialog(displayRule: IDisplayRule) {
    const drGuid = Helper.generateUuid();
    this.$store.commit('updateDisplayRule', {
      newValue:  {
        id: 0,
        guid: drGuid,
        title: '',
        fieldGuid: '',
        fieldOptionId: 0,
        formId: this.$store.state.form.id,
        colorCode: ''
      } as IDisplayRule
    });

    displayRule = this.$store.state.form.attributes.displayRules.find(f => {
      return f.guid === drGuid;
    }) as IDisplayRule;
    this.isNewDisplayRule = true;
    this.selectedDisplayRule = displayRule;
    this.showDialog = true;
  }

  public openDisplayRuleDialog(displayRule: IDisplayRule) {
    this.isNewDisplayRule = false;
    this.selectedDisplayRule = displayRule;
    this.showDialog = true;
  }

  get displayRules(): IDisplayRule[] {
    return this.$store.state.form.attributes.displayRules || [];
  }
}
</script>

<style lang='scss'>
.displayRuleChip {
  .v-chip__content {
    cursor: pointer !important;
  }
}
</style>