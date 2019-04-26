<template>
  <app-content :size="contentSize" :isLoading="isBusyLoadingFromServer" class="admin-list-forms" :pageTitle="$t('component.adminListForms.title')">
    <!-- Errormessage that is shown on error. -->
    <v-snackbar          
      v-model="isError"
      top        
      color="dark"                             
      multi-line
      >
        {{ errorMessage }}
        <v-btn                            
          dark flat
          @click="isError = false"
        >
        {{ $t('app.nav.close')}}
      </v-btn>
    </v-snackbar>
    <v-card class="card--flex-toolbar">
      <v-toolbar card color="grey lighten-5" height="80px">
        <!-- Titel -->
        <v-toolbar-title>{{ $t('component.adminListForms.title')}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- Add -->
        <v-btn color="primary" flat @click="addEServiceClick" :title="$t('component.adminListForms.create')">
          <v-icon left>add</v-icon>
          {{ $t('component.adminListForms.create') }}
        </v-btn>
      </v-toolbar>
      <v-divider></v-divider>
      <!-- Search -->
      <v-card-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          v-bind:label="$t('component.adminListForms.search.label')"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card-text class="pa-0">              
        <v-data-table
          v-if="!isBusyLoadingFromServer"
          :headers="headers"
          :items="listItems"
          :search="search"
          :rows-per-page-text="$t('component.adminListForms.table.pagination.rowsperpagetext')"
          :rows-per-page-items= "getRowsPerPage()"
          :no-data-text="$t('component.adminListForms.table.nodata')"
        >
          <template slot="items" slot-scope="props">
            <tr style="cursor: pointer" @click="goToForm(props.item.id)" :title="props.item.savedDate">
              <td>{{ props.item.id }}</td>
              <td>{{ props.item.title }}</td>
              <td style="text-align: right">
                  <v-chip small style="opacity:0.8" v-if="props.item.receiver">{{ props.item.receiver }}</v-chip></td>
              <td>
                <v-chip label class="status text-xs-center" :text-color="helper.getStatus(props.item.status).statusColorText" :color="helper.getStatus(props.item.status).statusColorBg">
                  {{ props.item.statustext }} 
                </v-chip>
              </td>
            </tr>
          </template>
          <v-alert slot="no-results" :value="true" color="error" icon="warning">
            {{ $t('component.adminListForms.table.noresult.labelpart1')}}  "{{ search }}" {{ $t('component.adminListForms.table.noresult.labelpart2')}}
          </v-alert>
          <template slot="pageText" slot-scope="props">
            {{ props.pageStart }} - {{ props.pageStop }} {{ $t('component.adminListForms.table.pagination.labelof')}} {{ props.itemsLength }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <!-- Confirm Add e-service dialog-->
    <base-confirm-dialog
      ref="confirmAddDialog"
      :title="$t('component.adminListForms.addEServiceDialog.title')"
      :text="$t('component.adminListForms.addEServiceDialog.description')"
    />
  </app-content>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide } from 'vue-property-decorator';
import AppContent from '@/components/app/AppContent.vue';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import { IHeader, IListItem, IForm, IFormStatus, IRootState } from '@/models/IForm';
import { FormStatus, ErrorCode, AppContentSize, MutationType } from '@/models/Enums';
import { Helper } from '@/utils/helper';

/**
 * List forms in adminstration
 */
@Component({
  components: {
    AppContent,
    BaseConfirmDialog
  },
  mixins: [BaseConfirmDialog]
})
export default class AdminListForms extends Vue {

  public search: string = '';
  public headers: IHeader[] = [];
  public listItems: IListItem[] = [];
  private isError: boolean = false;
  private errorMessage: string = '';
  private isBusyLoadingFromServer: boolean = true;
  private contentSize!: AppContentSize;
  private isShowConfirmAddDialog: boolean = true;

  /**
   * Skapar upp tabellrubriker.
   */
  public mounted() {
    this.headers.push({
      text: this.$i18n.tc('component.adminListForms.table.headers.text1'),
      align: 'left',
      value: 'id'
    });
    this.headers.push({
      text: this.$i18n.tc('component.adminListForms.table.headers.text2'),
      align: 'left',
      value: 'title'
    });
    this.headers.push({
      text: this.$i18n.tc('component.adminListForms.table.headers.text3'),
      align: 'right',
      value: 'category'
    });
    this.headers.push({
      text: this.$i18n.tc('component.adminListForms.table.headers.text4'),
      align: 'right',
      value: 'status'
    });
  }

  /**
   * Formstatus description.
   */
  public getStatusText(status) {
    return status === FormStatus.Published
      ? this.$i18n.tc('app.status.published')
      : status === FormStatus.Draft
        ? this.$i18n.tc('app.status.draft')
        : status === FormStatus.Unpublished
          ? this.$i18n.tc('app.status.unpublished')
          : '';
  }


  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }

  /**
   * List to show in dropdown for row/page
   */
  public getRowsPerPage() {
    return [
      10,
      20,
      { text: this.$i18n.tc('component.adminListForms.table.pagination.All'), value: -1 }
    ];
  }

  /**
   * Go to edit view of a form
   */
  public async goToForm(id: number) {
      // this.$router.push({ path: '/admin/' + id });
      // We have a memory leak! The easiest way to get around this is to actually reload the browser tab
      // with the new location, instead of using $router.push and the history api
      // todo: Investigate further how to solve this issue!
      (window as any).location = '/admin/' + id;
  }

  /**
   * Fill data when component is created.
   * Fetch data from backend and update store.
   */
  private async created() {
    this.contentSize = this.$route.meta.contentSize;

    try {
      // Get forms
      await this.$store.dispatch('getForms');

      this.$store.state.forms.forEach((element: IForm) => {
        this.listItems.push({
          id: element.id,
          path: element.attributes.path,
          value: false,
          title: element.attributes.title,
          receiver: element.attributes.receiver ? element.attributes.receiver.title : '',
          status: FormStatus[element.attributes.status],
          statustext: this.getStatusText(element.attributes.status),
          savedDate: element.attributes.modified || element.attributes.created
        });
      });
    } catch (error) {
      this.setErrorMessage(error);
    } finally {
      this.isBusyLoadingFromServer = false;
    }
  }

  private async createNewForm() {
    try {
      const formId = await this.$store.dispatch('createForm');
      this.isError = false;
      this.$router.push({ path: '/admin/' + formId });
    } catch (err) {
      this.setErrorMessage(err);
    }
  }

  /**
   * Set errormessage depending on error-status.
   * When setting message it will always display in snackbar
   * @return { string } Errormessage
   */
  private setErrorMessage(err: any, errDisplayMsg?: string): string {
    // Log error to console
    if (err) {
      console.error(err);
    }

    if (err.message === 'Network Error') {
      this.errorMessage = this.$i18n.t('app.error.general').toString();
    } else if (errDisplayMsg) {
      this.errorMessage = errDisplayMsg;
      this.isError = true;
    } else if (err.response.status === 404) {
      this.errorMessage = this.$i18n.t('app.error.404').toString();
    } else if (
      err.response.status === 400 &&
      err.response.data.errorCode === ErrorCode.FormNoPath
    ) {
      this.errorMessage = this.$i18n.t('app.error.400.FormNoPath').toString();
    } else if (
      err.response.status === 400 &&
      err.response.data.errorCode === ErrorCode.FormPathNotUnique
    ) {
      this.errorMessage = this.$i18n.t('app.error.400.FormPathNotUnique').toString();
    } else {
      this.errorMessage = this.$i18n.t('app.error.general').toString();
    }
    // Display Error-Message in snackbar
    this.isError = true;

    return this.errorMessage;
  }

  private async addEServiceClick() {
    const isYes = await (this.$refs.confirmAddDialog as BaseConfirmDialog).confirm();
    if (isYes) {
      this.createNewForm();
    }
  }
}
</script>

<style scoped lang='scss'>

.status {
  width: 100%;
  justify-content: center;
}

.theme--light.v-chip {
  &.success {
    background-color: $success-bg !important;    
    border-color: $success-bg !important;    
    color: $success !important;    
  }
  &.warning {
    background-color: $warning-bg !important;
    border-color: $warning-bg !important;    
    color: $warning !important;    
  }
  &.info {
    background-color: $info-bg !important;
    border-color: $info-bg !important;    
    color: $info !important;    
  }
  &.error {
    background-color: $error-bg !important;
    border-color: $error-bg !important;
    color: $error !important;    
  }
}
</style>