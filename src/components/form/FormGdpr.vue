<template>
    <div class="form-gdpr">    
              
        <!-- Info om GDPR -->
        <v-container class="gdpr-card" fluid pa-0>
            <h2 class="pb-2" tabindex="0">Så behandlar vi dina personuppgifter</h2>
            
              <p tabindex="0">
                Vi behöver spara och behandla dina ifyllda personuppgifter. Vi efterfrågar bara de personuppgifter som krävs för att vi ska kunna behandla ditt ärende. Om du inte lämnar efterfrågade uppgifter kommer vi inte att kunna hantera ditt ärende. Vi tillämpar gällande integritetslagstiftning vid all behandling av personuppgifter. Vi kan komma att dela dina personuppgifter med en tredje part, förutsatt att vi är skyldiga enligt lag, till exempel enligt offentlighetsprincipen. 
              </p>

              <p>
                Läs mer om dina rättigheter, syftet med behandlingen, rättslig grund och vem som är personuppgiftsansvarig för dina uppgifter. 
              </p>

              <!-- Lista med personuppgiftsansvariga -->
              <div v-if="mode !== 'PRINT'">
                <v-btn 
                  color="black"
                  v-for="dataController in dataControllers" 
                  :key="dataController.id" 
                  :href="dataController.url" 
                  target="_blank" outline
                    >{{dataController.title}}<v-icon right>open_in_new</v-icon>
                </v-btn>
              </div>
              <ul v-if="mode === 'PRINT'">
                <li  v-for="dataController in dataControllers" 
                  :key="dataController.id">{{ dataController.title}} <br /> {{ dataController.url}}</li>              
              </ul>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { IGdprDataController } from '@/models/IForm';

/**
 * Komponent för att informera användaren om GDPR. Skriver ut en lista med
 * personuppgiftsansvariga (data-controllers), ex. nämnder inom kommunen.
 * @prop {IGdprDataController[]} dataControllers - Lista med personuppgiftsansvariga.
 * @prop {string} validationScope - Sätt scope för validering, dvs när den ska utvärderas.
 */

@Component
export default class FormGdpr extends Vue {
  // Validering behöver injiceras för att barn-komponenter ska få tillgång till den
  @Inject('validator') public $validator: any;

  @Prop() public dataControllers!: IGdprDataController[];
  @Prop() public validationScope!: string;
  @Prop({ default: 'VIEW' }) public mode!: string; // VIEW or PRINT
}
</script>

<style scoped lang="scss">
.form-gdpr {
  page-break-inside: avoid;
  padding-top: 18px;

  .v-card {    
  }
}
</style>
