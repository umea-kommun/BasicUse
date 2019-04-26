<template>
    <div class="paper-signature">
      <v-container grid-list-md style="padding:20px 0 0">
        <v-layout row wrap>
          <v-flex xs7>            
            <PrintTextBox :title="$t('component.PaperSignature.signature')" :spacing="false" />
            <PrintTextBox :title="$t('component.PaperSignature.name')" :spacing="false" />
          </v-flex>
          <v-flex xs5>
            <PrintTextBox :title="$t('component.PaperSignature.whereAndWhen')" :spacing="false" />
          </v-flex>
        </v-layout>
      </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Vue } from 'vue-property-decorator';
import PrintTextBox from './PrintTextBox.vue';

/**
 * Component that renders a textbox sutiable for a on-paper-ui
 */
@Component({
  components: {
    PrintTextBox
  }
})
export default class PaperSignature extends Vue {
}
</script>

<style scoped lang="scss">
</style>
