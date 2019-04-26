<template>
    <div class="field-integration">
      <!-- ADMIN -->

      <!-- EDIT -->
      <div v-if="mode === 'EDIT'">        
        <v-text-field             
          v-model="value"
          :id="getValidationId"            
          :label="title"
          :hint="helpText"
          v-validate="validationRules"
          :data-vv-name="getValidationId"
          :data-vv-scope="validationScope"
          :error-messages="errors.first(getValidationId)"            
          box          
          :append-icon="getValidationIcon"
          :success="isSuccess"          
        >
        <!-- A button to get Data -->
        <v-btn slot="append-outer" v-on:click="retrieveData()" outline color="primary" :loading="status === 'Started'" :disabled="!isSuccess ">{{ buttonText }}</v-btn>
        </v-text-field>     

          <!-- Show notification on error -->
          <v-snackbar          
          v-if="result"
          v-model="showNotification"                    
          top        
          color="info"                             
          multi-line
          role="alert"
          >
            {{result.errors[0].title}}
            <v-btn                            
              dark flat
              @click="showNotification = false"
            >
            {{ $t('app.nav.close')}}
          </v-btn>
        </v-snackbar>
      </div>

      <!-- VIEW -->
      <v-text-field v-if="mode === 'VIEW'"
        v-model="value"          
        :label="title"            
        disabled
        box
      >
      </v-text-field>

    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AbstractSingleValueField from './AbstractSingleValueField';
import {IntegrationStatus} from '@/models/Enums';
import {IIntegrationResult, IIntegrationResultData, IError} from '@/models/IForm';

/**
 * Komponent för att hämta data från en integration och fylla field med.
 * @implements AbstractSingleValueField
 * @prop {string} type - Typ av fält (enum FormFieldType).
 * @prop {string} id - Id för fält.
 * @prop {string} title - Titel för fält.
 * @prop {string} description - Beskrivning av fält.
 * @prop {string} mode - Läge för formulär, redigering eller visning (enum FormMode).
 * @prop {string} value - Värde som användaren kan mata in.
 * @prop {string} helpText - Instruktion om vilket format fältet ska ha.
 * @prop {IValidation} validation - Valideringsregler som värdet ska uppfylla.
 * @prop {string} validationScope - Omfång för validering, ex. per steg.
 * @prop {string} buttonText - Text för knapp.
 * @prop {string} serviceUrl - Url för att hämta data ifrån integration.
 * @prop {any} dataMapping - Information om hur mappning ska ske mellan integration och fält.
 */

@Component
export default class FieldIntegration extends AbstractSingleValueField {
  @Prop() public buttonText!: string;
  @Prop() public serviceUrl!: string;
  @Prop() public dataMapping!: any;

  private status: IntegrationStatus = IntegrationStatus.NotStarted;
  private statusMessage: string = '';
  private result: IIntegrationResult | null = null;
  private showNotification: boolean = false;

  /**
   *
   */
  public retrieveData() {
    this.status = IntegrationStatus.Started;
    setTimeout(() => {
      this.getIntegrationData(this.value);
    }, 1500);
  }

  /**
   * Hämta data från integration.
   * @param {string} identityNumber - Personnummer att hämta data för.
   */
  private async getIntegrationData(identityNumber: string) {
    try {
      await this.$store.dispatch('getIntegrationData', {
        id: this.id,
        serviceUrl: this.serviceUrl + identityNumber,
        dataMapping: this.dataMapping
      });
      this.status = IntegrationStatus.Success;
    } catch (error) {
      this.status = IntegrationStatus.Error;
      this.showNotification = true;
      // @TODO skapa en klass som implementerar IIntegrationResult och
      // mappa felkod från server till rätt textdialog (språkhantering)
      this.result = {errors: [{
        status: 0,
        code: 0,
        title: 'Kunde tyvärr inte hitta uppgifter om personen. Skrev du in rätt personnummer?'
      }]} as IIntegrationResult;
    }
  }
}
</script>

<style lang="scss" scoped>

.field-integration {
  .container {
    padding: 0 0 24px 0;
  }

  .btn {
    .icon {
        margin-right: 5px;
    }
  }
}

</style>