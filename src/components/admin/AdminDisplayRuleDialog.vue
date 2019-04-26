<template>
  <div class="admin-display-rule-dialog">
    <v-dialog transition="slide-y-transition" v-model="showDialog" max-width="540px" persistent>
      <v-card>
        <v-card-title>
          <v-icon>check_circle</v-icon>
          <strong>{{ $t('component.adminDisplayRuleDialog.title') }}</strong>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="displayRuleObject.title"
            :label="$t('component.adminDisplayRuleDialog.field.title')"
            :hint="$t('component.adminDisplayRuleDialog.field.titleHelpText')"
            v-validate="'required'"
            data-vv-name='displayRuleObject.title'
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.displayRuleObject.title')"
            box
          ></v-text-field>
          <v-layout align-center row class="?">
            <v-select
              v-model="displayRuleObject.fieldGuid"
              :items="questions"
              item-value="fieldGuid"
              item-text="fieldTitle"
              :return-object="false"
              :label="$t('component.adminDisplayRuleDialog.titleQuestion')"
              v-validate="'required'"
              data-vv-name="titlequestion"
              :data-vv-scope="scope"
              :data-vv-as="$t('component.adminDisplayRuleDialog.titleQuestion')"
              :error-messages="errors.first(scope + '.titlequestion')"
              box
            ></v-select>
          </v-layout>
          <div v-if="displayRuleObject.fieldGuid">
            <v-layout align-center row class="?">
              <v-select
                v-model="displayRuleObject.fieldOptionId"
                :items="responses"
                item-value="fieldOptionId"
                item-text="fieldOptionTitle"
                :return-object="false"
                :label="$t('component.adminDisplayRuleDialog.titleResponse')"
                v-validate="'required'"
                data-vv-name="titleresponse"
                :data-vv-scope="scope"
                :data-vv-as="$t('component.adminDisplayRuleDialog.titleResponse')"
                :error-messages="errors.first(scope + '.titleresponse')"
                box
              ></v-select>
            </v-layout>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            color="error"
            :title="$t('component.adminDisplayRuleDialog.delete')"
            @click.native="onDialogDelete(displayRule)"
            v-if="!isNew"
          >
            <span>{{ $t("component.adminDisplayRuleDialog.delete") }}</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            flat
            :title="$t('component.adminDisplayRuleDialog.cancel')"
            @click.native="onDialogCancel(displayRule)"
          >
            <span>{{ $t("component.adminDisplayRuleDialog.cancel") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.adminDisplayRuleDialog.update')"
            @click.native="onDialogUpdate(displayRule)"
          >
            <span v-if="isNew">{{ $t("component.adminDisplayRuleDialog.create") }}</span>
            <span v-if="!isNew">{{ $t("component.adminDisplayRuleDialog.update") }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
      <base-confirm-dialog
        :title="showConfirmDialogTitle"
        :text="showConfirmDialogText"
        :showDialog="showConfirmDialog"
        v-on:onConfirmDialogNo="() => this.confirmDialogClose(false)"
        v-on:onConfirmDialogYes="() => this.confirmDialogClose(true)"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Watch } from 'vue-property-decorator';
import { IDisplayRule, IDisplayRuleQuestion, IDisplayRuleResponse, IItem } from '@/models/IForm';
import { FormFieldType, FormMode } from '@/models/Enums';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import { __asyncValues } from 'tslib';
import { Helper } from '@/utils/helper';

/**
 * Component for display rule
 * @prop {boolean} isNew - Is true if it's a new rule.
 * @prop {IDispalyRule} displayRule - Rule.
 * @prop {boolean} showDialog - Showing dialog.
 */
@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class AdminDisplayRuleDialog extends Vue {

  // Inject validation object
  @Inject('validator') public $validator: any;
  @Prop({ default: false }) public isNew!: boolean;
  @Prop()public displayRule!: IDisplayRule;

  public showDialog: boolean = true;
  private showConfirmDialog: boolean = false;
  private showConfirmDialogTitle: string = '';
  private showConfirmDialogText: string = '';
  private selectedEvent!: string;
  private scope: string = 'admindisplayruledialog';

  get displayRuleObject(): IDisplayRule {
    return Helper.deepCopy(this.displayRule);
  }

  /**
   * Get radiobutton, checkbox, dropdown from form
   */
  get questions(): IDisplayRuleQuestion[]  {
    const temp: IDisplayRuleQuestion[] = [];
    this.$store.state.form.attributes.steps.forEach(step => {
      step.fields.forEach(field => {
      if (field.type.toLowerCase() === FormFieldType.CheckBox.toLowerCase()
        || field.type.toLowerCase() === FormFieldType.RadioButton.toLowerCase()
        || field.type.toLowerCase() === FormFieldType.SelectList.toLowerCase()
        ) {
            const tempItems: IItem[] = [];
            (field.fieldOptions.items || []).forEach(item => {
              tempItems.push({
                  title: item.title,
                  isChecked: false,
                  value: '',
                  id: parseInt(item.id, 10)
              } as IItem);
            });
            const checked = this.displayRuleObject.fieldGuid === field.guid;
            temp.push({
              fieldGuid: field.guid,
              fieldTitle: field.title,
              isChecked: checked,
              responseItems: tempItems
            } as IDisplayRuleQuestion);
        }
      });
    });
    return temp;
  }

  /**
   * Get possible responses for selected question
   */
  get responses(): IDisplayRuleResponse[]  {
    if (!this.displayRuleObject.fieldGuid) {
      return [] as IDisplayRuleResponse[];
    }
    const temp: IDisplayRuleResponse[] = [];
    const selectedQuestion =  this.questions.find(
        item => item.fieldGuid === this.displayRuleObject.fieldGuid
      ) as IDisplayRuleQuestion;
    if (selectedQuestion) {
      selectedQuestion.responseItems.forEach(item => {
        let checked = false;
        if (this.displayRuleObject.fieldOptionId === item.id) {
          checked = true;
        }
        const idString = !item.id ? 0 : item.id;
        const response = {
          fieldOptionId: item.id,
          fieldOptionTitle: item.title,
          isChecked: checked
        } as IDisplayRuleResponse;
        temp.push(response);
      });
    }
    return temp;
  }

  private async onDialogCancel() {
    await this.$validator.validateAll(this.scope);
    if (!this.isDisplayRuleValidAndSaved(this.scope)) {
      this.selectedEvent = 'onDialogCancel';
      this.showConfirmDialogTitle = this.$i18n
        .t('component.adminDisplayRuleDialog.confirmClose.title')
        .toString();
      this.showConfirmDialogText = this.$i18n
        .t('component.adminDisplayRuleDialog.confirmClose.text')
        .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onDialogCancel');
    }
  }

  private async onDialogDelete() {
    this.selectedEvent = 'onDialogDelete';
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminDisplayRuleDialog.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminDisplayRuleDialog.confirmDelete.text')
      .toString();
    this.showConfirmDialog = true;
  }

  private async onDialogUpdate() {
    await this.$validator.validateAll(this.scope);
    if (this.isDisplayRuleValid(this.scope)) {
      this.$store.commit('updateDisplayRule', {
        displayRuleGuid: this.displayRule.guid,
        newValue: this.displayRuleObject
      });
      this.$emit('onDialogUpdate');
    }
  }

  /**
   * Emit close for confirm dialog.
   */
  private async confirmDialogClose(yes: boolean) {
    this.showConfirmDialog = false;
    if (yes) {
      if (this.isNew || this.selectedEvent === 'onDialogDelete') {
        this.$store.commit('deleteDisplayRule', {
          dispalyRuleGuid: this.displayRule.guid
        });
      }
      this.$emit('onDialogDelete');
    }
  }

  /**
   * Check if the value has changed and validation is correct
   */
  private isDisplayRuleValidAndSaved(scope: string): boolean {
    let isSuccess = true;
    this.$validator.fields.items.forEach(element => {
      if (element.scope === scope) {
        const isValid: boolean = element ? element.flags.valid : false;
        const isChanged: boolean = element ? element.flags.changed : false;
        if (isSuccess) {
          isSuccess = isValid && !isChanged;
        }
      }
    });
    return isSuccess;
  }
  /**
   * Check if the value has changed and validation is correct
   */
  private isDisplayRuleValid(scope: string): boolean {
    let isSuccess = true;
    this.$validator.fields.items.forEach(element => {
      if (element.scope === scope) {
        const isValid: boolean = element ? element.flags.valid : false;
        if (isSuccess) {
          isSuccess = isValid;
        }
      }
    });
    return isSuccess;
  }
}
</script>

<style scoped lang="scss">
.theme--light.v-chip {
  &.success {
    background-color: $success-bg !important;
    border-color: $success-bg !important;
  }
  &.error {
    background-color: $error-bg !important;
    border-color: $error-bg !important;
  }
}
</style>
