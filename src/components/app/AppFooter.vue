<template>
  <footer class="app-footer mt-4 pb-2 pt-3">
    <v-container class="top-container desktop-footer">
      <v-layout justify-center row>
        <v-flex :class="sizeClasses + ' pl-3 pr-3'">
          <v-layout row>
            <v-flex xs4>
              <img :src="logotypeUrl" width="120">
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs6 pt-2 class="white--text">
              <p class="text-lg-right">
                {{ $t('component.appFooter.byLine') }}
              </p>
            </v-flex>
          </v-layout>
        </v-flex>           
      </v-layout>
    </v-container>
    <v-container class="top-container mobile-footer">
      <p class="white--text">
        <img :src="logotypeUrl" width="120" class="mb-2">
        <br>
        {{ $t('component.appFooter.byLine') }}
      </p>
    </v-container>
  </footer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { AppContentSize } from '@/models/Enums';
import { Route } from 'vue-router';
import { Helper } from '@/utils/helper';

/**
 * Component for the footer section in the application
 */

@Component({
  components: {
  }
})
export default class AppFooter extends Vue {

  @Prop( { default: 'Default' }) public size!: AppContentSize;

  private logotypeUrl: string = require('@/assets/logo_white.png');

  get sizeClasses(): string {
    return Helper.getSizeClasses(this.size);
  }
}
</script>

<style scoped lang="scss">
.app-footer {
  background: $primary;
  
  .text-lg-right {
    text-align: right;
  }

  .top-container {
    padding:0 15px;
  }

  .desktop-footer {
    display: flex;
  }

  .mobile-footer {
    display: none;
  }

  @media screen and (max-width: 600px) {
    .mobile-footer {
      display: flex;
    }
    .desktop-footer {
      display: none;
    } 
  }

}
</style>
