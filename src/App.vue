<template>    
  <v-app id="app" :class="'route-' + routeName">
    <v-snackbar          
        v-model="error"
        top 
        color="info"
        multi-line        
        >    
          <div>
            {{$t('app.error.general')}}
            <div v-if="!isProductionMode" class="error-debug-msg">
              {{ errorMessage }}
            </div>
          </div>
      </v-snackbar> 

    <!-- App Header -->
    <app-header :size="$route.meta.contentSize" />

    <!-- Render component per route -->
    <div class="route-view-container">
      <router-view/>
    </div>

    <app-footer :size="$route.meta.contentSize" />

    <!-- Display warning about automatic logout due to inactivity -->   
    <auth-notification /> 

    <!-- Tell the user that we have logged out -->
    <div v-if="$route.query.logoutReason === 'manual'">
      <v-snackbar
        v-model="$route.query.logoutReason"
        top 
        color="info"
        multi-line    
        role="alert"    
        >       
          {{$t('app.auth.loggedOutManual')}}
      </v-snackbar>
    </div>

    <!-- Tell the user that a automatic logout has happened due to inactivity/expired session -->
    <v-dialog v-model="showLogoutDialog" persistent max-width="400">          
      <v-card role="alert">
        <v-card-title class="headline">{{$t('app.auth.loggedOutIdleTitle')}}</v-card-title>
        <v-card-text>
          {{$t($route.query.logoutReason === 'sessionExpired' ?
              'app.auth.loggedOutExpiredSessionText': 'app.auth.loggedOutIdleText')}}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>              
          <v-btn color="primary" flat @click.prevent="$auth.loginCitizen()">{{$t('app.auth.logIn')}}</v-btn>
          <v-btn flat @click.prevent="showLogoutDialog=false">{{$t('app.nav.close')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import AppHeader from '@/components/app/AppHeader.vue';
import AppFooter from '@/components/app/AppFooter.vue';
import AppContent from '@/components/app/AppContent.vue';
import AuthNotification from '@/components/auth/AuthNotification.vue';

/**
 * Main component for application.
 */

@Component({
    components: {
      AppHeader,
      AppContent,
      AuthNotification,
      AppFooter
    }
})
export default class App extends Vue {

  private errorMessage: string = '';
  private error: boolean = false;
  private showLogoutDialog: boolean = false;

  public created() {

    if (this.$route.query.logoutReason) {
      this.showLogoutDialog = this.$route.query.logoutReason !== 'manual' ? true : false;
    }

    /* tslint:disable */
    const componentInstance = this;
    window.addEventListener('error', function(evt: ErrorEvent) {
      componentInstance.error = true;
      const stackLines = (evt.error || {}).stack;
      componentInstance.errorMessage = evt.error.toString() + ' - ' + (stackLines ? stackLines.split('\n')[1] : '');
    }.bind(componentInstance)); // We need good old function.bind() here or we won't get hold of the component
    /* tslint:enable */
  }

  public errorCaptured(err, vm, info = '') {
    this.error = true;
    this.errorMessage = 'Vue error..';
  }

  public get isProductionMode() {
    return (process.env.VUE_APP_PRODUCTION || '').toLowerCase() === 'yes';
  }

  public get routeName() {
    return this.$route.name;
  }
}
</script>

<style scoped lang="scss">
.application {
  .app-content {
    padding-top: 0px;
  }

  .error-debug-msg {
    color: pink;
  }
}

.route-view-container {
  // prevents footer from jumping up and down when navigating between routes
  -webkit-box-flex: 1;
  -ms-flex: 1 1 auto;
  flex: 1 1 auto;
  max-width: 100%;
  position: relative;
}

</style>
