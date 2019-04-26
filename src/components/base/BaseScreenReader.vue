<template>
  <div class="base-screen-reader" :role="ariaRole" v-bind:class="{ 'screen-reader-only': !visibleOnScreen }" aria-atomic="true" aria-relevant="additions">
    <span>{{ message }}</span>    
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { AriaRole } from '@/models/Enums';

/**
 * Component to handle reading of text using a screen reader
 * @prop {string} message - Message to read by screen reader
 * @prop {boolean} visibleOnScreen - Set if message should be visible on screen. Default is false. [optional]
 * @prop {AriaRole} visibleOnScreen - Set type of message as aria role. Default is status. [optional]
 */

@Component
export default class BaseScreenReader extends Vue {
  @Prop( { default: '' } ) public message!: string;
  @Prop( { default: false }) public visibleOnScreen!: boolean;
  @Prop( { default: AriaRole.Status }) public ariaRole!: AriaRole;
}
</script>

<style scoped lang="scss">
.base-screen-reader {

  // Use this class to only show for screen readers - lifted from Bootstrap
  &.screen-reader-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}
  
}
</style>
