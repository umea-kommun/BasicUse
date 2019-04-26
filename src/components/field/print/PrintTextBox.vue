<template>
    <div :class="'print-text-box' + (spacing ? ' spacing':'')">
      <p class="label" :style="'padding-bottom: ' +height+ 'px'">
        <strong>{{ title }}</strong>
      </p>
      <small v-if="helpText" v-html="helpText"></small>
    </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator';
import { Vue } from 'vue-property-decorator';

/**
 * Component that renders a textbox sutiable for a on-paper-ui
 */
@Component({
  components: {
  }
})
export default class PrintTextBox extends Vue {
  @Prop( { default: 'Write something...' }) public title!: string;
  @Prop( { default: '' }) public helpText!: string;
  @Prop( { default: 32 }) public height!: number;
  @Prop( { default: true}) public spacing!: boolean;
}
</script>

<style scoped lang="scss">

.print-text-box {
  page-break-inside: avoid;

  .label {
    border: #333 solid 1px;
    padding: 3px 3px 32px;
    border-radius: 4px;
    margin-bottom: 4px;
  }

} 

.print-text-box.spacing {
  min-height: 80px;
  margin-top: 15px;
}

</style>
