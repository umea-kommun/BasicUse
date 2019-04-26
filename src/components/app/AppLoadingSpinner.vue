<template>
  <div>
    <v-progress-circular v-if="isVisible"
      class="app-loading-spinner"
      :width="3"
      color="green"
      indeterminate    
      aria-busy="true"
    ></v-progress-circular> 
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * Component that shows a loading spinner.
 * @description WCAG: marked with aria-busy to indicate status (1.3.1)
 */

@Component
export default class AppLoadingSpinner extends Vue {

  @Prop( { default: false }) public isVisible!: boolean;

}
</script>

<style scoped lang="scss">
div {
  width: 100%;
}
.app-loading-spinner {
  height: 32px;
  width: 32px;
  margin: 50px auto 50px;
  display: block;
}
</style>
