<template>
  <div class="admin-navet-navet">
    <v-dialog transition="slide-y-transition" v-model="showDialog" max-width="540px" persistent>
      <v-card>
        <v-card-title>
          <v-icon class="mr-1">{{ $formIntegrations.getIcon(integration) }}</v-icon>
          <h2>{{ integration.type }}</h2>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="integration.title"
            :label="$t('component.navetIntegration.field.title')"
            :hint="$t('component.navetIntegration.field.titleHelpText')"
            v-validate="'required'"
            data-vv-name="navetIntegration.title"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.navetIntegration.title')"
            box
          ></v-text-field>
          <v-select
            :label="$t('component.navetIntegration.field.matterType')"
            box
            v-model="integration.matterType"
            :items="matterTypes"      
          />
          <v-select
            v-model="integration.exportedFields"
            :items="formFields"
            box
            chips
            :label="$t('component.navetIntegration.field.exportedFields')"
            multiple
          ></v-select>
          <v-select            
            v-model="integration.custodianFieldItem"
            :items="possibleItemAnswers"
            box
            :label="$t('component.navetIntegration.field.custodian')"
            :hint="$t('component.navetIntegration.field.custodianHelpText')"
            persistent-hint
          ></v-select>
           <v-alert
            v-if="integration.custodianFieldItem"
            :value="true"
            color="error"
            icon="warning"
            outline            
            v-html="$t('component.navetIntegration.field.custodianWarning')"
          >
          </v-alert>
         </v-card-text>
         <v-card-actions>
          <v-btn
            flat
            color="error"
            :title="$t('component.navetIntegration.delete')"
            @click.native="onDialogDelete()"
            v-if="!isNew"
          >
            <span>{{ $t("component.navetIntegration.delete") }}</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            flat
            :title="$t('component.navetIntegration.cancel')"
            @click.native="onDialogCancel()"
          >
            <span>{{ $t("component.navetIntegration.cancel") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.navetIntegration.update')"
            @click.native="onDialogUpdate()"
            v-if="!isNew"
          >
            <span>{{ $t("component.navetIntegration.update") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.navetIntegration.create')"
            @click.native="onDialogCreate()"
            v-if="isNew"
          >
            <span>{{ $t("component.navetIntegration.create") }}</span>
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
import {
  IFormIntegration,
  IFormIntegrationOption,
  IForm,
  IItemListField,
  IItem
} from '@/models/IForm';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import { IIntegrationNavet, MatterType } from './IIntegrationNavet';

@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class NavetIntegration extends Vue {

  // Inject validation object
  @Inject('validator') public $validator: any;
  @Prop({ default: false }) public isNew!: boolean;
  @Prop() public formIntegration!: IFormIntegration;
  public showDialog: boolean = true;

  private showConfirmDialog: boolean = false;
  private showConfirmDialogTitle: string = '';
  private showConfirmDialogText: string = '';
  private selectedEvent!: string;
  private scope: string = 'adminintegrationnavet';
  private integration: IIntegrationNavet = {} as IIntegrationNavet;

  public mounted() {
    if (this.isNew) {
      this.integration = {
        id: 0,
        type: this.formIntegration.type,
        title: '',
        matterType: MatterType.FTJ,
        exportedFields: [],
        custodianFieldItem: ''
      };
    } else {
      this.integration = {
        id: this.formIntegration.id,
        type: this.formIntegration.type,
        title:  this.getOptionValue('title'),
        matterType: this.getOptionValue('matterType'),
        custodianFieldItem: this.getOptionValue('custodianFieldItem'),
        exportedFields: this.getOptionValue('exportedFields').split(',')
      };
    }
  }

  get matterTypes() {
    return [
      {text: this.$t('component.navetIntegration.matterType.ftj'), value: MatterType.FTJ},
      {text: this.$t('component.navetIntegration.matterType.rftj'), value: MatterType.RFTJ}
    ];
  }

  get formFields() {
    const form = this.$store.state.form as IForm;
    const fields: any[] = [];
    form.attributes.steps.forEach(step => {
      step.fields.forEach(field => {
        fields.push({text: field.title, value: field.guid});
      });
    });
    return fields;
  }

  get possibleItemAnswers() {
    const form = this.$store.state.form as IForm;
    const answers: any[] = [{text: '...', value: ''}];
    form.attributes.steps.forEach(step => {
      step.fields.forEach(field => {
        if (field.fieldOptions && field.fieldOptions.items) {
          (field as IItemListField).fieldOptions.items!.forEach((item: IItem) => {
              answers.push({text: field.title + ' -> ' + item.title, value: item.id});
          });
        }
      });
    });
    return answers;
  }

  private getOptionValue(key: string) {
    try {
      return this.formIntegration.options.find(f => f.key === key)!.value;
    } catch (err) {
      return '';
    }
  }

  private async onDialogCancel() {
    await this.$validator.validateAll(this.scope);
    if (!this.isIntegrationValidAndSaved(this.scope)) {
      this.selectedEvent = 'onDialogCancel';
      this.showConfirmDialogTitle = this.$i18n
        .t('component.navetIntegration.confirmClose.title')
        .toString();
      this.showConfirmDialogText = this.$i18n
        .t('component.navetIntegration.confirmClose.text')
        .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onDialogCancel');
    }
  }

  private async onDialogDelete() {
    this.selectedEvent = 'onDialogDelete';
    this.showConfirmDialogTitle = this.$i18n
      .t('component.navetIntegration.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.navetIntegration.confirmDelete.text')
      .toString();
    this.showConfirmDialog = true;
  }

  private async onDialogCreate() {
    await this.$validator.validateAll(this.scope);
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integration.id,
        newValue: this.getIFormIntegration(this.integration)
      });
      this.$emit('onDialogCreate');
    }
  }

  private async onDialogUpdate() {
    await this.$validator.validateAll(this.scope);
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integration.id,
        newValue: this.getIFormIntegration(this.integration)
      });
      this.$emit('onDialogUpdate');
    }
  }

  /**
   * Emit close for confirm dialog.
   */
  private async confirmDialogClose(yes: boolean) {
    this.showConfirmDialog = false;
    if (yes && this.selectedEvent === 'onDialogCancel') {
      this.$emit('onDialogCancel');
    } else if (yes && this.selectedEvent === 'onDialogDelete') {
      this.$store.commit('deleteFormIntegration', {
        integrationId: this.integration.id
      });
      this.$emit('onDialogDelete');
    }
  }

  private getIFormIntegration(integration: IIntegrationNavet): IFormIntegration {
    const options = [
      {key: 'title', value: integration.title},
      {key: 'matterType', value: integration.matterType},
      {key: 'exportedFields', value: integration.exportedFields.join(',')},
      {key: 'custodianFieldItem', value: integration.custodianFieldItem},
    ] as IFormIntegrationOption[];

    return {
      id: integration.id,
      type: integration.type,
      options
    };
  }

  /**
   * Check if the value has changed and validation is correct
   */
  private isIntegrationValidAndSaved(scope: string): boolean {
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
  private isIntegrationValid(scope: string): boolean {
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
</style>