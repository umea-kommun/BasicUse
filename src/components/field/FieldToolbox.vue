<template>
  <div class="field-toolbox">
    <v-hover>
      <v-card
      
        slot-scope="{ hover }"
        :title="description"
        :class="`elevation-${hover ? 5 : 2}`"
        class="toolbox"
        @dblclick="onDoubleClick"        
      >
        <v-card-text class="text-xs-center">
          <v-layout column fill-height> 
              <v-flex><v-icon class="toolbox-icon">{{ icon }}</v-icon></v-flex>
              <div class="toolbox-title text-truncate">{{title}}</div>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-hover>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

/**
 * Component to view components in toolbox mode
 */

@Component({})
export default class FieldToolbox extends Vue {
  @Prop() public title!: string;
  @Prop() public icon!: string;
  @Prop() public description!: string;

  /**
   * Throws the event further up
   */
  public onDoubleClick() {
    this.$emit('onDoubleClick');
  }
}
</script>

<style scoped lang="scss">
.field-toolbox {
  .toolbox {
    cursor: pointer;         
    min-width: 100px;
    min-height: 100px;
  }
  .toolbox-icon {
    padding-top: 5px;
  }
  .toolbox-title {
    padding-top: 5px;
  }
}
</style>