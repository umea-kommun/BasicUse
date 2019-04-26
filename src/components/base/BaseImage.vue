<template>
    <img class="base-image"
    v-bind:src="url" 
    v-bind:title="title" 
    v-bind:alt="altText"  
    v-bind:style="{ 'max-width': getMaxWidth, 'min-width' : getMinWidth}
    ">
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * Komponent för att rita ut en bild.
 * @prop {string} url - Absolut url för bilden.
 * @prop {string} title - Titel för bilden. Visas vid hover över bilden.
 * @prop {string} alt - Alternativ text som beskriver vad bilden föreställer. Behövs för WCAG.
 * @prop {string} maxWidth - Maximal bredd i pixlar. Ex '100px' eller '50%'
 * @prop {string} minWidth - Minimal bredd i pixlar. Ex '100px' eller '50%'
 */

@Component
export default class BaseImage extends Vue {
  @Prop() public url!: string;
  @Prop() public title!: string;
  @Prop() public altText!: string;
  @Prop() public maxWidth!: number;
  @Prop() public minWidth!: number;

 /**
  * Max bredd på bild, default är 100% för responsiva bilder.
  */
  get getMaxWidth() {
    return this.maxWidth ? this.maxWidth : '100%';
  }

 /**
  * Minimum bredd på bild.
  */
  get getMinWidth() {
    return this.minWidth ? this.minWidth : undefined;
  }
}
</script>

<style scoped lang="scss">
.base-image img {
  max-width: 100%;  
}
</style>
