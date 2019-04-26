<template>
  <div class="admin-gdpr-manager">
    <v-dialog v-model="showGdprDialog" scrollable persistent width="645">
      <v-card style="background-color: white; width: 645px;" class="admin-gdpr-manager-card">
        <v-card-title card height="80px">
          <h3>
            <strong>{{ $t('component.adminGdprManager.title') }}</strong>
          </h3>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onCreateClick">
            <v-icon left>add</v-icon>
            {{ $t('component.adminGdprManager.create') }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list class="gdpr-list">
            <template v-for="(item, index) in gdprItems">
              <v-list-tile :key="'tile-' + index" :id="'tile-' + item.id">
                <v-list-tile-title 
                  :title="item.title" 
                  v-show="selectedId != item.id">{{ item.title }}</v-list-tile-title>
                <!-- Field-Content -->
                <v-slide-y-transition>
                  <v-list-tile-content v-if="selectedId === item.id">
                    <v-card class="gdpr-card">
                      <v-card-text>
                        <v-text-field
                          v-model="item.title"
                          :label="$t('component.adminGdprManager.gdpr.title')"
                          v-validate="'required'"
                          :data-vv-name="item.id + 'title'"
                          data-vv-scope="adminGdprManager"
                          data-vv-as="title"
                          :error-messages="errors.first('adminGdprManager.' + item.id + 'title')"
                          box
                        ></v-text-field>
                        <v-text-field
                          v-model="item.url"
                          :label="$t('component.adminGdprManager.gdpr.url')"
                          v-validate="'required'"
                          :data-vv-name="item.id + 'url'"
                          data-vv-scope="adminGdprManager"
                          data-vv-as="url"
                          :error-messages="errors.first('adminGdprManager.' + item.id + 'url')"
                          box
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          flat
                          color="error"
                          :title="$t('component.adminGdprManager.delete')"
                          @click.native="deleteGdpr(item)"
                        >
                          <span>{{ $t("component.adminGdprManager.delete") }}</span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          flat
                          :title="$t('component.adminGdprManager.cancel')"
                          @click.native="closeItem(item)"
                        >
                          <span>{{ $t("component.adminGdprManager.cancel") }}</span>
                        </v-btn>
                        <v-btn
                          flat
                          color="primary"
                          :title="$t('component.adminGdprManager.save')"
                          @click.native="onSaveClick(item)"
                        >
                          <span>{{ $t("component.adminGdprManager.save") }}</span>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-list-tile-content>
                </v-slide-y-transition>
                <v-list-tile-action style="text-align:right;" v-show="selectedId != item.id">
                  <v-btn icon @click.native="selectGdprItem(item)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider :key="'divider-' + index"></v-divider>
            </template>
          </v-list>
          <base-confirm-dialog
            :title="showConfirmDialogTitle"
            :text="showConfirmDialogText"
            :showDialog="showConfirmDialog"
            v-on:onConfirmDialogNo="() => this.confirmDialogClose(false)"
            v-on:onConfirmDialogYes="() => this.confirmDialogClose(true)"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat="flat"
            @click.native="onCloseGdprDialog()"
          >{{ $t('component.adminGdprManager.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import { IGdpr, IItem } from '@/models/IForm';
import { ErrorCode, MutationType } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';

/**
 * Administration of gdpr
 */
@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class AdminGdprManager extends Vue {
  // Inject validation object
  @Inject('validator') public $validator: any;

  public showGdprDialog: boolean = true;
  private showConfirmDialog: boolean = false;
  private showConfirmDialogTitle: string = '';
  private showConfirmDialogText: string = '';
  private selectedItem: any = {};
  private selectedId: number | null = null;
  private selectedEvent!: string;

  /**
   * Run when component is created
   */
  public async created() {
    await this.$store.dispatch('getGdprList');
  }

  /**
   * Get GdprItems from state
   * @return {IGdpr[]} A list with gdprItems
   */
  get gdprItems(): IGdpr[] {
    if (this.$store.state.gdpr !== null) {
      return Helper.deepCopy(this.$store.state.gdpr).sort(Helper.sortByTitle);
    } else {
      return [] as IGdpr[];
    }
  }

  public closeItem(item: IGdpr) {
    if (item.id < 0) {
      // remove temporary added item
      this.$store.commit(MutationType.DeleteGdpr, item);
    } else if (!this.isFormValidAndSaved('adminGdprManager')) {
      this.gdprItems.filter(
        f => f.id === item.id
      )[0].title = this.$store.state.gdpr.filter(f => f.id === item.id)[0].title;
    }
    this.selectedItem = {};
    this.selectedId = null;
  }

  public async onSaveClick(item: IGdpr) {
    if (this.selectedId! < 0) {
      await this.createGdpr(item);
    } else {
      await this.saveGdpr(item);
    }
  }

  /**
   * Save a gdpr
   */
  public async saveGdpr(item: IGdpr) {
    try {
      await this.$store.dispatch('updateGdpr', { gdpr: item });
      this.$validator.reset();
      this.selectedItem = {};
      this.selectedId = null;
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
          error: new Error('saveGdpr is missingtitle!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminGdprManager.error.onSaveGdpr.missingTitle')
            .toString()
        });
      } else if (err === ErrorCode.MissingUrl) {
        this.$emit('onError', {
          error: new Error('saveGdpr is missingUrl!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminGdprManager.error.onSaveGdpr.missingUrl')
            .toString()
        });
      } else {
        this.$emit('onError', {
          error: err,
          errorDisplayMessage: this.$i18n.t('component.adminGdprManager.error.onSaveGdpr.general').toString()
        });
      }
    }
  }

  /**
   * Delete a gdpr
   */
  public async deleteGdpr(item: IGdpr) {
    this.selectedEvent = 'deleteGdpr';
    this.selectedItem = item;
    this.selectedId = item.id;
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminGdprManager.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminGdprManager.confirmDelete.text')
      .toString();
    // Show confirmation-window
    this.showConfirmDialog = true;
  }

  public async onCreateClick() {
    const newItem = {
      id: Helper.generateTempIdInteger(),
      type: '',
      title: '',
      url: ''
    } as IGdpr;
    this.$store.commit(MutationType.UpdateGdpr, newItem);
    this.selectedId = newItem.id;
  }

  /**
   * Create new gdpr
   */
  public async createGdpr(item: IGdpr) {
    try {
      await this.$store.dispatch('createGdpr', {
        gdpr: {
          id: null,
          title: item.title,
          url: item.url
        }
      });
      // remove temporary added item
      this.$store.commit(MutationType.DeleteGdpr, item);
      this.selectedId = null;
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
          error: new Error('createGdpr is missingtitle!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminGdprManager.error.onCreateGdpr.missingTitle')
            .toString()
        });
      } else if (err === ErrorCode.MissingUrl) {
        this.$emit('onError', {
          error: new Error('saveGdpr is missingUrl!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminGdprManager.error.onCreateGdpr.missingUrl')
            .toString()
        });
      } else {
        this.$emit('onError', {
          error: new Error('createGdpr' + this.$i18n.t('app.error.general').toString()),
          errorDisplayMessage: err
        });
      }
    }
  }

  /**
   * Emit close for confirm dialog.
   */
  private async confirmDialogClose(yes: boolean) {
    this.showConfirmDialog = false;
    if (yes && this.selectedEvent === 'deleteGdpr') {
    const errMsg = this.$i18n.t('component.adminGdprManager.error.onDeleteGdpr.general');

    if (!this.selectedItem || !this.selectedEvent) {
        // Create error so we can show error in parent-snackbar's console.error.
        this.$emit('onError', {
        error: new Error('selectedItem or this.selectedEvent is empty!'),
        errorDisplayMessage: errMsg
        });
        return;
    }
    try {
        await this.$store.dispatch(this.selectedEvent, {
          gdpr: this.selectedItem
        });
      } catch (err) {
        if (err === ErrorCode.CannotDeleteObject) {
          this.$emit('onError', {
          error: new Error('deleteGdpr have a relation to !'),
          errorDisplayMessage: this.$i18n
              .t('component.adminGdprManager.error.onDeleteGdpr.restricted')
              .toString()
          });
        } else {
          this.$emit('onError', { error: err, errorDisplayMessage: errMsg });
        }
      }
    } else if (yes && this.selectedEvent === 'onCloseGdprDialog') {
      this.$emit('onCloseGdprDialog');
    }
  }

  private selectGdprItem(item: IGdpr) {
    this.selectedItem = item;
    this.selectedId = item.id;
  }

  /**
   * Close the Gdpr dialog
   */
  private async onCloseGdprDialog() {
    await this.$validator.validateAll('adminGdprManager');
    if (!this.isFormValidAndSaved('adminGdprManager')) {
      this.selectedEvent = 'onCloseGdprDialog';
      this.showConfirmDialogTitle = this.$i18n
          .t('component.adminGdprManager.confirmCloseGdpr.title')
          .toString();
      this.showConfirmDialogText = this.$i18n
          .t('component.adminGdprManager.confirmCloseGdpr.text')
          .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onCloseGdprDialog');
    }
  }

  /**
   * Check if the value has changed and validation is correct
   */
  private isFormValidAndSaved(scope: string): boolean {
    let isSuccess = true;
    this.$validator.fields.items.forEach(element => {
      if (element.scope === scope) {
        const isValid: boolean = element ? element.flags.valid : false;
        const isChanged: boolean = element ? element.flags.changed : false;
        if (isSuccess) { isSuccess = isValid && !isChanged; }
      }
    });
    return isSuccess;
  }

}
</script>

<style lang='scss'>
.admin-gdpr-manager-card {
  .v-card__text {
    .v-list.theme--light {
      .v-list__tile.theme--light {
        height: 100%;
        .v-list__tile__content {
          background-color: $primary-bg;
          padding: 10px;
          margin-left: -16px;
          margin-right: -16px;
          .gdpr-card {
            width: 100%;
          }
        }
        .v-list__tile__action {
          min-width: auto;
        }
        .v-list__tile__title {
          margin-top: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  // V-List hides messages due to a bug
  .v-list .v-input, .v-list .v-input__slot {
    margin-bottom: 8px;
  }
 
  .v-list .v-input .v-messages {
    display: block;
  }
}
</style>

