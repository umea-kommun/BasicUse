<template>
  <nav>
    <v-breadcrumbs v-if="routeList.length > 1" :items="routeList" >
      <v-icon slot="divider">chevron_right</v-icon>
      <template slot="item" slot-scope="route">
        <v-breadcrumbs-item          
          :to="route.item.to"
          :key="route.item.text"
          :disabled="route.item.disabled"
          exact
          >{{route.item.text}}
          </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </nav>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IBreadCrumb } from '@/models/IForm';
import { Route } from 'vue-router';
/**
 * Component that creates a breadcumb from current route and routing-table.
 * @description WCAG: landmark role for navigation and aria-label (1.3.1)
 */
@Component
export default class AppBreadCrumb extends Vue {
  /** Holds the list of current breadcrumbs */
  private routeList: IBreadCrumb[] = [];

  /**
   * component-created
   */
  private async created() {
    this.setbreadcrumbFromRoute(this.$route);
  }

  /**
   * Create local-breadcrumb-list from routes-meta.
   */
  private setbreadcrumbFromRoute(route: Route) {
    if (!route || !route.meta || !route.meta.breadcrumb) {
      this.routeList = [];
      return;
    }
    let breadcrumbs = route.meta.breadcrumb;
    // Is breadcrum in routes a function or array?
    if (route.meta.breadcrumb instanceof Function) {
      breadcrumbs = breadcrumbs(route.params);
    }
    // Convert from route-meta to IBreadCrumb
    this.routeList = (breadcrumbs).map(d => {
      return {
        name: d.name,
        text: this.$t(`app.route.${d.name}`).toString(),
        to: d.to,
        disabled: (route.fullPath === d.to)
        } as IBreadCrumb;
      });
  }

  /**
   * Watch changes in route, when route changes we change breadcumb according to routes meta.
   */
  @Watch('$route')
  private onRouteChanged(to: Route, from: Route) {
    this.setbreadcrumbFromRoute(to);
  }
}
</script>

<style scoped lang="scss">
</style>
