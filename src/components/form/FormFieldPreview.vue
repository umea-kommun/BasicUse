<template>
  <div>
    <label class="field-title subheading font-weight-bold">{{ title }}</label>          
    <div>
      <v-layout row>
        <v-flex xs11>
          <div class="field-value" v-html="value"></div>
        </v-flex>
        <v-flex xs1>
          <v-icon class="lock-icon">lock_outline</v-icon>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';

/**
 */
@Component
export default class FormFieldPreview extends Vue {
  @Prop() public title!: string;
  @Prop() public value!: string;
}
</script>

<style scoped lang="scss">
.lock-icon {
  color: #000 !important;
}
</style>
