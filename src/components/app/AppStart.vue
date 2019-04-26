<template>
  <app-content :isLoading="isBusyLoadingFromServer" class="app-start" :pageTitle="$t('component.appStart.title')">    
    <v-card>          
      <v-card-text>        
        <v-list subheader>
          <template 
            v-for="(forms, i) in glossary">
            <v-subheader :key="i + '-header'"><span class="headline">{{ forms[0].attributes.title[0].toUpperCase() }}</span></v-subheader>
            <v-list-tile ripple
              v-for="form in forms"
              :key="form.id" :to="'/' + form.attributes.path">       
              
              <v-list-tile-content>
                <v-list-tile-title><h2 class="subheading">{{ form.attributes.title }}</h2></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action><v-icon color="primary">arrow_forward</v-icon></v-list-tile-action>
            </v-list-tile>
            <v-divider :key="i + '-divider'" class="pb-2 pt-2"></v-divider>
          </template>
        </v-list>

      </v-card-text>
    </v-card>
    
  </app-content>
</template>

<script lang="ts">
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import { IForm } from '@/models/IForm';
import { FormStatus } from '@/models/Enums';
import AppContent from '@/components/app/AppContent.vue';

Vue.filter('min', values => {
    return Math.min(...values);
});

/**
 * Start page for the application
 * @description WCAG: semantic headers (1.3.1)
 */
@Component({
  components: {
    AppContent
  }
})
export default class AppStart extends Vue {

  private isBusyLoadingFromServer: boolean = true;

  /** Published forms grouped by first letter */
  private glossary: IForm[][] = [];

  public async created() {
    await this.$store.dispatch('getForms');
    this.generateGlossary();
    this.isBusyLoadingFromServer = false;
  }

  /** Sort forms by title in ascending order */
  public sortByTitle(a, b) {
    if (a.attributes.title < b.attributes.title) {
      return -1;
    }
    if (a.attributes.title > b.attributes.title) {
      return 1;
    }
    return 0;
  }

  /**
   * Generate a sorted glossary
   */
  public generateGlossary() {
    // Get all published forms sorted by title
    const publishedForms = this.$store.state.forms
      .filter((form: IForm) => form.attributes.status === FormStatus.Published)
      .sort(this.sortByTitle);

    // Group forms by first letter
    let formsGroupedByFirstLetter = new Map();
    publishedForms.forEach(form => {
      const firstLetter = form.attributes.title.charAt(0).toUpperCase();
      if (!formsGroupedByFirstLetter.has(firstLetter)) {
        formsGroupedByFirstLetter.set(firstLetter, []);
      }
      formsGroupedByFirstLetter.get(firstLetter).push(form);
    });

    // Sort map by first letter
    formsGroupedByFirstLetter = new Map([...formsGroupedByFirstLetter].sort());

    // Convert map to array (iterating over maps will be supported in vue 3.0)
    this.glossary = Array.from(formsGroupedByFirstLetter.values());
  }
}
</script>

<style scoped lang="scss">
.v-list__tile__title {
  // Show all text even on small screens
  height: auto;
  white-space: normal;
  overflow: visible;
  text-overflow: unset;
  padding-bottom: 10px;
  padding-top: 5px;
  line-height: normal;
}
</style>
