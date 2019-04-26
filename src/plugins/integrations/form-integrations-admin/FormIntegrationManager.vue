<template>
  <div class="admin-integration">    
    <v-card>
      <v-menu bottom right style="float: right">
        <v-btn slot="activator" icon>
          <v-icon color="primary">add_circle_outline</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="integrationObject in registeredIntegrationObjects"
            :key="integrationObject.type"
            @click="createNewFormIntegration(integrationObject)"
          >
            <v-list-tile-action>
              <v-icon>{{ integrationObject.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-title>{{ integrationObject.name }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <v-card-text>
        <template v-for="formIntegration in formIntegrations">
          <v-chip
            label
            :key="formIntegration.id"
            @click="updateFormIntegration(formIntegration)"
            class="integrationChip"
          >
            <v-icon class="pr-1" v-html="getIcon(formIntegration)"></v-icon>
            <span v-html="getTitle(formIntegration)"></span>
          </v-chip>
        </template>
        <span
          v-if="formIntegrations.length === 0"
        >{{ $t('component.adminIntegration.noIntegration') }}</span>
      </v-card-text>
    </v-card>
    <div v-for="integrationObject in registeredIntegrationObjects" :key="integrationObject.type">
      <component
        v-if="showDialog === integrationObject.type"
        :is="integrationObject.componentName"
        :isNew="isCreatingNewIntegration"
        :formIntegration="selectedIntegration"
        v-on:onDialogCancel="showDialog = false"
        v-on:onDialogCreate="showDialog = false"
        v-on:onDialogUpdate="showDialog = false"
        v-on:onDialogDelete="showDialog = false"
        tabindex="0"
      ></component>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IFormIntegration } from '@/models/IForm';
import { IIntegrationObject } from './IIntegrationObject';

/**
 * Administration of integration
 */
@Component({
  components: {
  }
})
export default class AdminIntegration extends Vue {
  private selectedIntegration!: IFormIntegration;
  private isCreatingNewIntegration: boolean = false;
  private showDialog: string | boolean = false;

  get registeredIntegrationObjects(): IIntegrationObject[] {
    return this.$formIntegrations.getRegisteredIntegrationComponents();
  }

  get formIntegrations(): IFormIntegration[] {
    return this.$store.state.form.attributes.integrations || [];
  }

  public createNewFormIntegration(integrationObject: IIntegrationObject) {
    this.isCreatingNewIntegration = true;
    this.showDialog = integrationObject.type;
    // Create an IFormIntegration from an IIntegrationObject
    this.selectedIntegration = {...integrationObject, options: [], id: 0} as IFormIntegration;
  }

  public updateFormIntegration(formIntegration: IFormIntegration) {
    this.isCreatingNewIntegration = false;
    this.showDialog = formIntegration.type;
    this.selectedIntegration = formIntegration;
  }

  private getIcon(formIntegration: IFormIntegration): string {
    return this.$formIntegrations.getIcon(formIntegration);
  }

  private getTitle(formIntegration: IFormIntegration): string {
    return formIntegration.options.find(option => option.key === 'title')!.value;
  }
}
</script>

<style lang='scss'>
.integrationChip {
  .v-chip__content {
    cursor: pointer !important;
  }
}
</style>