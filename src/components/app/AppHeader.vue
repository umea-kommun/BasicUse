<template>
  <header class="app-header mb-4">
    <div class="demo-alert pl-2 pr-2" v-if="usingMockedData">
      <p>
        <strong>OBS!</strong> - Denna applikation är inställd att ge en demonstration av den funktionalitet som erbjuds. All information lagras
        lokalt. Vissa funktioner i gränssnittet är delvis inaktiverade.
        <v-btn small outline @click="resetMockedData">Återställ data</v-btn>
      </p>
    </div>
    <v-content>
      <!-- Errormessage that is shown on error. -->
      <v-snackbar          
        v-model="isError"
        top        
        color="info"                             
        multi-line
        role="alert"
        >
          {{ errMessage }}
          <v-btn dark flat
              @click="isError = false">
              {{ $t('app.nav.close')}}
          </v-btn>
      </v-snackbar>
      <v-container class="pt-0 pb-0">
        <v-layout justify-center class="content-layout">
          <v-flex :class="sizeClasses" class="content-flex">
            <v-card flat class="pt-4 pb-4">

              <!-- Skip to content for easy access to content when navigating using keyboard and screen readers [WCAG 2.4, navigation] -->
              <div id="skip">
                <a href="#main-content" class="subheading text-xs-center">{{ $t('app.nav.skipToContent')}}</a>
              </div>  

              <div>
                <a @click="goToStartPage()" class="tag-line">
                  {{ $t('component.appHeader.appName') }}                    
                </a>
                <h1 v-if="$route.name === 'AppStart'">{{ $t('app.route.AppStart') }}</h1>
                <h1 v-if="isVisitingAdmin()">{{ $t('app.route.AdminListForms') }}</h1>
                <h1 v-if="$route.name !== 'AppStart' && !isVisitingAdmin() && form">{{ form.attributes.title }}</h1>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-content class="app-horizontal-nav">
      <v-container class="pt-0 pb-0">
        <v-layout justify-center class="content-layout pt-0 pb-0">
          <v-flex :class="sizeClasses" class="content-flex">
            <v-card flat style="background: none" class="pt-2 pb-2">
              <v-layout align-end justify-space-between>
                <v-flex xs4>
                  <v-menu right offset-y                     
                    id="userMenuDialog"
                    role="menu"
                    aria-labelledby="userMenuButton"
                    >
                    <a 
                      slot="activator" 
                      flat                       
                      color="primary"
                      id="userMenuButton"
                      aria-haspopup="true"
                      aria-controls="userMenuDialog"
                      role="menuitem"                     
                    >                           
                      <v-icon class="ml-1" style="vertical-align: -7px">dehaze</v-icon>
                      {{$t("component.appHeader.navigation")}} 
                    </a>
                    <v-list class="main-drop-down-menu">
                      <v-list-tile @click="goToStartPage">
                        <v-list-tile-title role="menuitem" :class="$route.path == '/' ? 'active':''">
                          <v-icon small>chevron_right</v-icon>
                          {{$t('component.appHeader.menu.allServices')}}
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="goToAboutPage">
                        <v-list-tile-title role="menuitem">
                          {{$t('component.appHeader.menu.about')}}
                        </v-list-tile-title>
                      </v-list-tile>
                      <v-divider v-if="isAdmin"></v-divider>
                      <v-list-tile v-if="isAdmin" @click="$router.push('/admin')">
                        <v-list-tile-title role="menuitem" :class="$route.path == '/admin' ? 'active':''">
                          <v-icon small>chevron_right</v-icon>
                          {{$t('component.appHeader.menu.admin')}}
                        </v-list-tile-title>
                      </v-list-tile>
                      <!-- Managementobject -->
                      <v-list-tile v-if="isAdmin" @click="showPm3Dialog = true">
                          <v-list-tile-title>{{ $t("component.adminForm.menu.managementobject") }}</v-list-tile-title>
                      </v-list-tile>
                      <!-- Receivers -->
                      <v-list-tile v-if="isAdmin" @click="showReceiverDialog = true">
                          <v-list-tile-title>{{ $t("component.adminForm.menu.receiver") }}</v-list-tile-title>
                      </v-list-tile>
                      <!-- Gdpr -->
                      <v-list-tile v-if="isAdmin" @click="showGdprDialog = true">
                          <v-list-tile-title>{{ $t("component.adminForm.menu.gdpr") }}</v-list-tile-title>
                      </v-list-tile>
                      <v-divider v-if="user"></v-divider>
                      <v-list-tile v-if="user" @click="logout">
                          <v-list-tile-title role="menuitem">
                            {{$t('component.appHeader.menu.logout')}}
                          </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>                 
                </v-flex>
                <v-flex xs12 style="text-align: right;">       
                  <a left v-if="!user" @click.prevent="login" flat>     
                    {{ $t('app.auth.logIn') }}
                    <v-icon>person</v-icon>   
                  </a>
                  <span v-if="user">
                    {{user.fullName}}
                    <v-icon>person</v-icon>   
                  </span>         
              </v-flex>
            </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <div v-if="isAdmin">
      <!-- PM3 Manager -->
      <admin-pm3-manager v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
        v-if="showPm3Dialog"
        v-on:onClosePm3Dialog="showPm3Dialog = false" />
      
      <!-- Receiver Manager -->
      <admin-receiver-manager v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
        v-if="showReceiverDialog"
        v-on:onCloseReceiverDialog="showReceiverDialog = false" />
      
      <!-- GDPR Manager -->
      <admin-gdpr-manager v-on:onError="setErrorMessage($event.error, $event.errorDisplayMessage)"
        v-if="showGdprDialog"
        v-on:onCloseGdprDialog="showGdprDialog = false" />
    </div>

  </header>  
</template>

<script lang="ts">
import { Component, Vue, Prop, Provide } from 'vue-property-decorator';
import { IUser, IForm } from '@/models/IForm';
import { mapState } from 'vuex';
import { AppContentSize, MutationType } from '@/models/Enums';
import { Route } from 'vue-router';
import { Helper } from '@/utils/helper';
import { EventBus } from '@/utils/EventBus';
import AdminPm3Manager from '@/components/admin/AdminPm3Manager.vue';
import AdminReceiverManager from '@/components/admin/AdminReceiverManager.vue';
import AdminGdprManager from '@/components/admin/AdminGdprManager.vue';
import { resetSavedMockData } from '@/store/mock';

/**
 * Component for the header section in the application
 * @description WCAG: landmark role for navigation, menu and menuitem, aria-labelledby (1.3.1)
 */

@Component({
  components: {
    AdminPm3Manager,
    AdminReceiverManager,
    AdminGdprManager,
  },
  computed: mapState(['user', 'form'])
})
export default class AppHeader extends Vue {

  @Provide('validator') public $validator = this.$validator;

  @Prop( { default: 'Default' }) public size!: AppContentSize;
  @Prop( { default: '' }) public errorMessage!: string;

  private showReceiverDialog: boolean = false;
  private showPm3Dialog: boolean = false;
  private showGdprDialog: boolean = false;
  private isError: boolean = false;
  private form!: IForm;
  private user!: IUser;
  private errMessage: string = '';

  public goToStartPage() {
    (window as any).location = '/';
  }

  public goToAboutPage() {
    (window as any).location = process.env.VUE_APP_ABOUT_URL;
  }

  public logout() {
    this.$store.commit(MutationType.TruncateForm); // Remove possibly stored data in session storage
    this.$auth.logoutRedirectingToStartPage('logoutReason=manual');
  }

  public isVisitingAdmin() {
    return this.$route.name ? this.$route.name.indexOf('Admin') > -1 : false;
  }

  public login()  {
    this.$auth.loginCitizen(this.$route.path);
  }

  get isAdmin(): boolean {
    return this.$store.getters.isLoggedInAdmin;
  }

  get sizeClasses(): string {
    return Helper.getSizeClasses(this.size);
  }

  get usingMockedData() {
    return (process.env.VUE_APP_MOCK_DATA || '').toLowerCase() === 'yes';
  }

  private resetMockedData() {
    resetSavedMockData();
    (window as any).location = '/';
  }

  /**
   * Set errormessage depending on error-status.
   * When setting message it will always display in snackbar
   * @return { string } errMessage
   */
  private setErrorMessage(err: any, errDisplayMsg?: string): string {
    // Log error to console
    if (err) {
      console.error(err);
    }
    if (errDisplayMsg) {
      this.errMessage = errDisplayMsg;
      this.isError = true;
    } else {
      this.errMessage = this.$i18n.t('app.error.general').toString();
    }
    // Display Error-Message in snackbar
    this.isError = true;

    return this.errMessage;
  }
}
</script>

<style scoped lang="scss">
.app-header {

  .demo-alert {
    background: pink; 
    padding: 10px 0 0; 
    min-height: 60px;
    text-align: center;
  }

  background:#FFF;

  h1 {
    line-height: normal;
    cursor: default;
  }

  .tag-line {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 15px;
    padding-bottom: 0;
    margin-bottom: -5px; // h4ck!
  }

  a {
    text-decoration: none !important;
    color: #333 !important;
  }

  // Skip to content visible when tabbing, used for screen readers [WCAG 2.4, navigation]
  #skip {
    position: absolute;
    top: 0;
    left: -9999px;
    z-index: 100;
    width: 100%;
    margin: 0;

    a:focus,
    a:active {
      display:block;
      position:absolute;
      top:0;
      left:9999px;
      width:100%;
      padding:8px 0;      
      background: $accent;
      color: $black;      
    }
  }
}

.app-horizontal-nav {
  background: $primary;
  
  color: #FFF;
  a, button, i, span {
    color: #FFF !important;
  }

  a {
    text-transform: uppercase;
  }

  .v-icon {
    vertical-align: -6px;
  }

  .person-icon {
    display: none;
  }
}

.main-drop-down-menu {
  min-width: 200px;
  .v-icon {
    vertical-align: -3px; 
    font-weight: bold;
    display: none;
  }
  .active {
    font-weight: bold;
    .v-icon {
      display: inline;
    }
  }
}

</style>
