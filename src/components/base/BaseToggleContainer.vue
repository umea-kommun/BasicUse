<template>
  <div class="component-base-toggle-container"> 
    <v-container fluid pb-0 pt-3>
      <h3 class="subheading text-uppercase" @click="toggle()">
          {{ title }}
          <v-icon v-if="!isOpen()">keyboard_arrow_down</v-icon>
          <v-icon v-if="isOpen()">keyboard_arrow_up</v-icon>
      </h3>
    </v-container>
    <v-container fluid pt-3 pt-0 v-if="isOpen()">
      <slot></slot>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * @prop {string} title - Text to be displayed as title
 * @prop {string} containerId - Uniqueue name of this container
 */

@Component
export default class BaseToggleContainer extends Vue {
  @Prop() public title!: string;
  @Prop() public containerId!: string;

  private openContainers: string[] = [];

  public created() {
    if (!this.containerId) {
      throw new Error('Container id must be set');
    }
    this.loadOpenContainersFromStorage();
  }

  public isOpen() {
    return this.openContainers.indexOf(this.containerId) > -1;
  }

  public toggle() {
    this.loadOpenContainersFromStorage();

    const index = this.openContainers.indexOf(this.containerId);
    if (index === -1) {
      this.openContainers.push(this.containerId);
    } else {
      this.openContainers.splice(index, 1);
    }

    this.saveOpenContainersToStorage();
  }

  private loadOpenContainersFromStorage() {
    this.openContainers = (window.localStorage.getItem('basicUseToggle') || '').split(',');
  }

  private saveOpenContainersToStorage() {
    window.localStorage.setItem('basicUseToggle', this.openContainers.join(','));
  }
}
</script>

<style scoped lang="scss">
h3.subheading {
  padding-bottom: 12px;
  cursor: pointer;
  .v-icon {
    float: right;
  }
}
</style>