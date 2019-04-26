<template>
  <div :class="mode + ' base-title'"> 
    <label class="title">
      {{ title }}
    </label>
    <div v-if="mode === 'PRINT'">
      <em>{{ alert }}</em>
    </div>              
    <v-alert v-if="mode === 'DEFAULT'" :value="alert" type="info" outline class="base-title-description" v-html="alert"></v-alert>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

/**
 * @prop {string} title - Text to be displayed as title
 * @prop {string} alert - Optional, text to be displayed as extra info below title
 * @prop {string} mode - Optional, either PRINT or DEFAULT
 */

@Component
export default class BaseTitle extends Vue {
  @Prop() public title!: string;
  @Prop({ default: ''}) public alert!: string;
  @Prop({ default: 'DEFAULT'}) public mode!: string;
}
</script>

<style scoped lang="scss">
.base-title {  
  &.PRINT {
    margin-top:20px;
  }
  
  padding-bottom: 16px;

  .title {   
      display: block;        
      padding-bottom: 12px;
  }   
}

.base-title,
.base-title label,
.base-title div {
  page-break-inside: avoid;
  page-break-after: avoid;
  break-after: avoid;
  page-break-before: avoid;
  break-before: avoid;
}
</style>
