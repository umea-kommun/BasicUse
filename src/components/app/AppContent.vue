<template>  
  <v-content class="app-content">
    <!-- VueHeadful is used to set page title in browser -->
    <vue-headful
      :title="fullPageTitle"
    />
    <v-container pt-0>
      <!-- Flexbox layout that puts our stuff in the center (class name important for printing) -->        
      <v-layout justify-center class="content-layout">
        <!-- Set class according to property size (class name important for print page) -->
        <v-flex :class="sizeClasses" class="content-flex">
          
          <!-- Card -->
          <!-- Skip to main content for easy access to content when navigating using keyboard and screen readers [WCAG 2.4, navigation] -->
          <v-card flat id="main-content" role="article">
            <v-card-text class="pa-0">
              <!-- Spinner while loading content -->
              <app-loading-spinner :isVisible="isLoading"></app-loading-spinner>
              
              <!-- Error message if content can not be loaded-->
              <v-container v-if="errorMessage" style="background: #FFF">
                <v-alert                                  
                  :value="errorMessage"
                  type="warning"  
                  outline
                >{{ errorMessage }}
                </v-alert>
              </v-container>

              <!-- Render slot content -->              
              <template v-if="!isLoading && !errorMessage">
                <slot></slot>
              </template>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container> 
  </v-content>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AppBreadCrumb from '@/components/app/AppBreadCrumb.vue';
import { AppContentSize } from '@/models/Enums';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';
import VueHeadful from 'vue-headful'; // Set page title
import { Helper } from '@/utils/helper';

/**
 * Component that renders the content section of the application.
 * @description WCAG: landmark role for main content (1.3.1)
 * @prop {AppContentSize} size - Size for app content. Uses AppContentSize in Enums.
 * @prop {boolean} breadcrumb - Use breadcrumb above content. Default is true.
 * @prop {boolean} isLoading - Show loading spinner while loading content. Default is false.
 * @prop {string} errorMessage - Error message if data can't be loaded
 * @prop {string} pageTitle - Set page title in browser
 */

@Component({
    components: {
      AppBreadCrumb,
      AppLoadingSpinner,
      VueHeadful
    }
})
export default class AppContent extends Vue {
  @Prop( { default: AppContentSize.Default }) public size!: AppContentSize;
  @Prop( { default: true }) public breadcrumb!: boolean;
  @Prop( { default: false }) public isLoading!: boolean;
  @Prop( { default: '' }) public errorMessage!: string;
  @Prop( { default: '' }) public pageTitle!: string;

  /**
   * Get full page title using value from property pageTitle
   */
  get fullPageTitle() {
    if (!this.pageTitle) {
      return this.$i18n.t('app.title').toString() + ' - ' + this.$i18n.t('app.title').toString();
    }
    return this.pageTitle + ' - ' + this.$i18n.t('app.title').toString();
  }

  get sizeClasses() {
    return Helper.getSizeClasses(this.size);
  }
}

</script>

<style scoped lang="scss">
#main-content {
  background: none;
}
</style>
