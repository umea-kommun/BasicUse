<template>
  <div class="admin-integration-email">
    <v-dialog transition="slide-y-transition" v-model="showDialog" max-width="540px" persistent>
      <v-card>
        <v-card-title>
          <v-icon>{{ $formIntegrations.getIcon(integrationEmail) }}</v-icon>
          <strong>{{ integrationEmail.type }}</strong>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="integrationEmail.title"
            :label="$t('component.adminIntegrationEmail.field.title')"
            :hint="$t('component.adminIntegrationEmail.field.titleHelpText')"
            v-validate="'required'"
            data-vv-name="integrationEmail.title"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationEmail.title')"
            box
          ></v-text-field>
          <v-text-field
            v-model="integrationEmail.subject"
            :label="$t('component.adminIntegrationEmail.field.subject')"
            :hint="$t('component.adminIntegrationEmail.field.subjectHelpText')"
            v-validate="'required'"
            data-vv-name="integrationEmail.subject"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationEmail.subject')"
            box
          ></v-text-field>
          <v-combobox
            multiple
            v-model="integrationEmail.sender"
            :label="$t('component.adminIntegrationEmail.field.sender')"
            :hint="$t('component.adminIntegrationEmail.field.senderHelpText')"
            append-icon
            class="tag-input"
            :search-input.sync="searchSender"
            @input="updateSender"
            aria-autocomplete="false"
            v-validate="'required|emailComboboxItem'"
            data-vv-name="integrationEmail.sender"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationEmail.sender')"
            box
          >
            <template slot="selection" slot-scope="data">
              <v-chip close :color="data.item.color" label @input="removeSender(data.item)">
                <strong>{{ data.item.title }}</strong>
              </v-chip>
            </template>
          </v-combobox>
          <v-combobox
            multiple
            v-model="integrationEmail.receiver"
            :label="$t('component.adminIntegrationEmail.field.receiver')"
            :hint="$t('component.adminIntegrationEmail.field.receiverHelpText')"
            append-icon
            class="tag-input"
            :search-input.sync="searchReceiver"
            @input="updateReceiver"
            v-validate="'required|emailComboboxItem'"
            data-vv-name="integrationEmail.receiver"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationEmail.receiver')"
            box
          >
            <template slot="selection" slot-scope="data">
              <v-chip close :color="data.item.color" label @input="removeReceiver(data.item)">
                <strong>{{ data.item.title }}</strong>
              </v-chip>
            </template>
          </v-combobox>
          <v-checkbox
            v-model="integrationEmail.attachFiles"
            :label="$t('component.adminIntegrationEmail.field.attachFiles')"
            color="primary"
            type="checkbox"
          ></v-checkbox>
          <base-html-editor
            v-model="integrationEmail.body"
            :label="$t('component.adminIntegrationEmail.field.body')"
            :hint="$t('component.adminIntegrationEmail.field.bodyHelpText')"
            box
          ></base-html-editor>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            color="error"
            :title="$t('component.adminIntegrationEmail.delete')"
            @click.native="onDialogDelete(integrationEmail)"
            v-if="!isNew"
          >
            <span>{{ $t("component.adminIntegrationEmail.delete") }}</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            flat
            :title="$t('component.adminIntegrationEmail.cancel')"
            @click.native="onDialogCancel(integrationEmail)"
          >
            <span>{{ $t("component.adminIntegrationEmail.cancel") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.adminIntegrationEmail.update')"
            @click.native="onDialogUpdate(integrationEmail)"
            v-if="!isNew"
          >
            <span>{{ $t("component.adminIntegrationEmail.update") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.adminIntegrationEmail.create')"
            @click.native="onDialogCreate(integrationEmail)"
            v-if="isNew"
          >
            <span>{{ $t("component.adminIntegrationEmail.create") }}</span>
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
  IComboboxItem,
  IFormIntegrationOption
} from '@/models/IForm';
import {IIntegrationEmail} from './IIntegrationEmail';
import BaseHtmlEditor from '@/components/base/BaseHtmlEditor.vue';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';

@Component({
  components: {
    BaseHtmlEditor,
    BaseConfirmDialog
  }
})
export default class EmailIntegration extends Vue {
  get integrationEmail(): IIntegrationEmail {
    if (this.isNew) {
      return {
        id: 0,
        title: '',
        type: this.formIntegration.type,
        subject: '',
        sender: [] as IComboboxItem[],
        receiver: [] as IComboboxItem[],
        attachFiles: false,
        body: ''
      } as IIntegrationEmail;
    } else {
      return {
        id: this.formIntegration.id,
        title: this.formIntegration.options.find(f => f.key === 'title')!.value,
        type: this.formIntegration.type,
        subject: this.formIntegration.options.find(f => f.key === 'subject')!.value,
        sender: this.getSender(
          this.formIntegration.options.filter(f => f.key === 'sender')
        ),
        receiver: this.getReceiver(
          this.formIntegration.options.filter(f => f.key === 'receiver')
        ),
        attachFiles: JSON.parse(
          this.formIntegration.options.find(f => f.key === 'attachFiles')!.value
        ),
        body: this.formIntegration.options.find(f => f.key === 'body')!.value
      } as IIntegrationEmail;
    }
  }
  // Inject validation object
  @Inject('validator') public $validator: any;
  @Prop({ default: false }) public isNew!: boolean;
  @Prop() public formIntegration!: IFormIntegration;
  public showDialog: boolean = true;

  private showConfirmDialog: boolean = false;
  private showConfirmDialogTitle: string = '';
  private showConfirmDialogText: string = '';
  private selectedEvent!: string;

  private scope: string = 'adminintegrationemail';
  private searchSender: string = '';
  private searchReceiver: string = '';

  public async updateReceiver() {
    const found = this.integrationEmail.receiver.filter(
      element => typeof element === 'string' || element instanceof String
    );
    const index = this.integrationEmail.receiver.findIndex(f => f === found[0]);
    this.integrationEmail.receiver.splice(index, 1);
    this.searchReceiver.split(',').forEach(element => {
      let color = 'success';
      if (!this.validateEmail(element)) {
        color = 'error';
      }
      this.integrationEmail.receiver.push({
        title: element,
        color
      } as IComboboxItem);
    });
    await this.$validator.validateAll(
      this.scope + '.integrationEmail.receiver'
    );
  }

  public async removeReceiver(item: IComboboxItem) {
    const index = this.integrationEmail.receiver.findIndex(
      f => f.title === item.title
    );
    this.integrationEmail.receiver.splice(index, 1);
    await this.$validator.validateAll(
      this.scope + '.integrationEmail.receiver'
    );
  }

  public async updateSender() {
    const found = this.integrationEmail.sender.filter(
      element => typeof element === 'string' || element instanceof String
    );
    const index = this.integrationEmail.sender.findIndex(f => f === found[0]);
    this.integrationEmail.sender.splice(index, 1);
    this.searchSender.split(',').forEach(element => {
      let color = 'success';
      if (!this.validateEmail(element)) {
        color = 'error';
      }
      this.integrationEmail.sender.push({
        title: element,
        color
      } as IComboboxItem);
    });
    await this.$validator.validateAll(
      this.scope + '.integrationEmail.sender'
    );
  }

  public async removeSender(item: IComboboxItem) {
    const index = this.integrationEmail.sender.findIndex(
      f => f.title === item.title
    );
    this.integrationEmail.sender.splice(index, 1);
    await this.$validator.validateAll(
      this.scope + '.integrationEmail.sender'
    );
  }

  private validateEmail(email) {
    /* tslint:disable */
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    /* tslint:enable */
    return !!regexp.exec(email);
  }

  /**
   * Hide dialog
   */
  private async onDialogCancel() {
    await this.$validator.validateAll(this.scope);
    if (!this.isIntegrationValidAndSaved(this.scope)) {
      this.selectedEvent = 'onDialogCancel';
      this.showConfirmDialogTitle = this.$i18n
        .t('component.adminIntegrationEmail.confirmClose.title')
        .toString();
      this.showConfirmDialogText = this.$i18n
        .t('component.adminIntegrationEmail.confirmClose.text')
        .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onDialogCancel');
    }
  }

  /**
   * Delete email integration
   */
  private async onDialogDelete() {
    this.selectedEvent = 'onDialogDelete';
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminIntegrationEmail.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminIntegrationEmail.confirmDelete.text')
      .toString();
    this.showConfirmDialog = true;
  }

  /**
   * Create email integration
   */
  private async onDialogCreate() {
    await this.$validator.validateAll(this.scope);
    const antal = this.$validator.fields.items.find(
      f => f.scope === this.scope && f.name === 'integrationObject.sender.title'
    );
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integrationEmail.id,
        newValue: this.getIFormIntegration(this.integrationEmail)
      });
      this.$emit('onDialogCreate');
    }
  }

  /**
   * Update email integration
   */
  private async onDialogUpdate() {
    await this.$validator.validateAll(this.scope);
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integrationEmail.id,
        newValue: this.getIFormIntegration(this.integrationEmail)
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
        integrationId: this.integrationEmail.id
      });
      this.$emit('onDialogDelete');
    }
  }

  private getSender(senders) {
    const result: IComboboxItem[] = [];
    senders.forEach(element =>
      result.push({ title: element.value, color: 'success' })
    );
    return result;
  }

  private getReceiver(receivers) {
    const result: IComboboxItem[] = [];
    receivers.forEach(element =>
      result.push({ title: element.value, color: 'success' })
    );
    return result;
  }

  private getIFormIntegration(integration: IIntegrationEmail) {
    const options: any[] = [];
    options.push({
      key: 'title',
      value: integration.title
    });
    options.push({
      key: 'subject',
      value: integration.subject
    });
    options.push({
      key: 'attachFiles',
      value: integration.attachFiles.toString()
    });
    options.push({
      key: 'body',
      value: integration.body
    });
    integration.sender.forEach(element => {
      options.push({
        key: 'sender',
        value: element.title
      });
    });
    integration.receiver.forEach(element => {
      options.push({
        key: 'receiver',
        value: element.title
      });
    });

    return {
      id: integration.id,
      type: integration.type,
      options
    } as IFormIntegration;
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
