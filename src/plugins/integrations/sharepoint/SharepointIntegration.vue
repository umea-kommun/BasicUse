<template>
  <div class="admin-integration-sharepoint">
    <v-dialog transition="slide-y-transition" v-model="showDialog" max-width="540px" persistent>
      <v-card>
        <v-card-title>
          <v-icon>{{ $formIntegrations.getIcon(integrationSharepoint) }}</v-icon>
          <strong>{{ integrationSharepoint.type }}</strong>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="integrationSharepoint.title"
            :label="$t('component.adminIntegrationSharepoint.field.title')"
            :hint="$t('component.adminIntegrationSharepoint.field.titleHelpText')"
            v-validate="'required'"
            data-vv-name="integrationSharepoint.title"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationSharepoint.title')"
            box
          ></v-text-field>
          <v-text-field
            v-model="integrationSharepoint.siteTitle"
            :label="$t('component.adminIntegrationSharepoint.field.siteTitle')"
            :hint="$t('component.adminIntegrationSharepoint.field.siteTitleHelpText')"
            v-validate="'required'"
            data-vv-name="integrationSharepoint.siteTitle"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationSharepoint.siteTitle')"
            box
            @input="setSiteTitleLink"
          ></v-text-field>
          <div class="mb-3">{{ siteTitleLink}}</div>
          <v-text-field
            v-model="integrationSharepoint.userEmail"
            :label="$t('component.adminIntegrationSharepoint.field.userEmail')"
            :hint="$t('component.adminIntegrationSharepoint.field.userEmailHelpText')"
            v-validate="'required|email'"
            data-vv-name="integrationSharepoint.userEmail"
            :data-vv-scope="scope"
            :error-messages="errors.first(scope + '.integrationSharepoint.userEmail')"
            box
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            color="error"
            :title="$t('component.adminIntegrationSharepoint.delete')"
            @click.native="onDialogDelete(integrationSharepoint)"
            v-if="!isNew"
          >
            <span>{{ $t("component.adminIntegrationSharepoint.delete") }}</span>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            flat
            :title="$t('component.adminIntegrationSharepoint.cancel')"
            @click.native="onDialogCancel(integrationSharepoint)"
          >
            <span>{{ $t("component.adminIntegrationSharepoint.cancel") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.adminIntegrationSharepoint.update')"
            @click.native="onDialogUpdate(integrationSharepoint)"
            v-if="!isNew"
          >
            <span>{{ $t("component.adminIntegrationSharepoint.update") }}</span>
          </v-btn>
          <v-btn
            flat
            color="primary"
            :title="$t('component.adminIntegrationSharepoint.create')"
            @click.native="onDialogCreate(integrationSharepoint)"
            v-if="isNew"
          >
            <span>{{ $t("component.adminIntegrationSharepoint.create") }}</span>
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
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import {
  IFormIntegration,
  IFormIntegrationOption
} from '@/models/IForm';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import { IIntegrationSharepoint } from './IIntegrationSharepoint';

@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class SharepointIntegration extends Vue {
  get integrationSharepoint(): IIntegrationSharepoint {
    if (this.isNew) {
      return {
        id: 0,
        title: '',
        type: this.formIntegration.type,
        siteTitle: '',
        userEmail: ''
      } as IIntegrationSharepoint;
    } else {
      return {
        id: this.formIntegration.id,
        title:  (this.formIntegration.options.find(
          f => f.key === 'title'
        ))!.value,
        type: this.formIntegration.type,
        siteTitle: (this.formIntegration.options.find(
          f => f.key === 'siteTitle'
        ))!.value,
        userEmail: (this.formIntegration.options.find(
          f => f.key === 'userEmail'
        ))!.value
      } as IIntegrationSharepoint;
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

  private scope: string = 'adminintegrationsharepoint';
  private searchSender: string = '';
  private searchReceiver: string = '';
  private siteTitleLink?: string = '';

  private mounted() {
    this.setSiteTitleLink();
  }

  private setSiteTitleLink() {
    const site = this.integrationSharepoint.siteTitle as string;
    if (site) {
      const newSiteUrlPath = site.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      const newSiteUrl = process.env.VUE_APP_SHAREPOINT_SITE_URL + newSiteUrlPath;
      this.siteTitleLink = this.$i18n.t('component.adminIntegrationSharepoint.sharepointurl') + newSiteUrl;
    }
  }


  /**
   * Hide dialog
   */
  private async onDialogCancel() {
    await this.$validator.validateAll(this.scope);
    if (!this.isIntegrationValidAndSaved(this.scope)) {
      this.selectedEvent = 'onDialogCancel';
      this.showConfirmDialogTitle = this.$i18n
        .t('component.adminIntegrationSharepoint.confirmClose.title')
        .toString();
      this.showConfirmDialogText = this.$i18n
        .t('component.adminIntegrationSharepoint.confirmClose.text')
        .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onDialogCancel');
    }
  }

  /**
   * Delete sharepoint integration
   */
  private async onDialogDelete() {
    this.selectedEvent = 'onDialogDelete';
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminIntegrationSharepoint.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminIntegrationSharepoint.confirmDelete.text')
      .toString();
    this.showConfirmDialog = true;
  }

  /**
   * Create sharepoint integration
   */
  private async onDialogCreate() {
    await this.$validator.validateAll(this.scope);
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integrationSharepoint.id,
        newValue: this.getIFormIntegration(this.integrationSharepoint)
      });
      this.$emit('onDialogCreate');
    }
  }

  /**
   * Update sharepoint integration
   */
  private async onDialogUpdate() {
    await this.$validator.validateAll(this.scope);
    if (this.isIntegrationValid(this.scope)) {
      this.$store.commit('updateFormIntegration', {
        integrationId: this.integrationSharepoint.id,
        newValue: this.getIFormIntegration(this.integrationSharepoint)
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
        integrationId: this.integrationSharepoint.id
      });
      this.$emit('onDialogDelete');
    }
  }

  private getIFormIntegration(integration: IIntegrationSharepoint) {
    const options = [] as IFormIntegrationOption[];
    options.push({
      key: 'title',
      value: integration.title
    } as IFormIntegrationOption);
    options.push({
      key: 'siteTitle',
      value: integration.siteTitle
    } as IFormIntegrationOption);
    options.push({
      key: 'userEmail',
      value: integration.userEmail
    } as IFormIntegrationOption);

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
</style>