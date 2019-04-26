<template>
  <div class="admin-receiver-manager">
    <v-dialog v-model="showReceiverDialog" scrollable persistent width="645">
      <v-card class="admin-receiver-manager-card">
        <v-card-title card height="80px">
          <h3>
            <strong>{{ $t('component.adminReceiverManager.title') }}</strong>
          </h3>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="onCreateClick">
            <v-icon left>add</v-icon>
            {{ $t('component.adminReceiverManager.create') }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list class="receiver-list">
            <template v-for="(item, index) in receiverItems">
              <v-list-tile :key="'tile-' + index" :id="'tile-' + item.id">
                <v-list-tile-title 
                  :title="item.title" 
                  v-show="selectedId != item.id">{{ item.title }}</v-list-tile-title>
                <!-- Field-Content -->
                <v-list-tile-content v-if="selectedId === item.id">
                  <v-card class="receiver-card">
                    <v-card-text>
                      <v-text-field
                        v-model="item.title"
                        :label="$t('component.adminReceiverManager.receiver.title')"
                        v-validate="'required'"
                        :data-vv-name="item.id + 'title'"
                        data-vv-scope="adminReceiverManager"
                        data-vv-as="title"
                        :error-messages="errors.first('adminReceiverManager.' + item.id + 'title')"
                        box
                      ></v-text-field>
                      <v-text-field
                        v-model="item.url"
                        :label="$t('component.adminReceiverManager.receiver.path')"
                        v-validate="'required'"
                        :data-vv-name="item.id + 'path'"
                        data-vv-scope="adminReceiverManager"
                        data-vv-as="path"
                        :error-messages="errors.first('adminReceiverManager.' + item.id + 'path')"
                        box
                      ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        flat
                        color="error"
                        :title="$t('component.adminReceiverManager.delete')"
                        @click.native="deleteReceiver(item)"
                      >
                        <span>{{ $t("component.adminReceiverManager.delete") }}</span>
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        :title="$t('component.adminReceiverManager.cancel')"
                        @click.native="closeItem(item)"
                      >
                        <span>{{ $t("component.adminReceiverManager.cancel") }}</span>
                      </v-btn>
                      <v-btn
                        flat
                        color="primary"
                        :title="$t('component.adminReceiverManager.save')"
                        @click.native="onSaveClick(item)"
                      >
                        <span>{{ $t("component.adminReceiverManager.save") }}</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-list-tile-content>
                <v-list-tile-action style="text-align:right;" v-if="selectedId!= item.id">
                  <v-btn icon @click="selectReceiverItem(item)">
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
            @click.native="onCloseReceiverDialog()"
          >{{ $t('component.adminReceiverManager.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import { IReceiver, IItem } from '@/models/IForm';
import { ErrorCode, MutationType } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';

/**
 * Administration of receivers
 */
@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class AdminReceiverManager extends Vue {

  // Inject validation object
  @Inject('validator') public $validator: any;

  public showReceiverDialog: boolean = true;
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
    await this.$store.dispatch('getReceiverList');
  }

  /**
   * Get receiverItems from state
   * @return {IReceiver[]} A list with receiverItems
   */
  get receiverItems(): IReceiver[] {
    if (this.$store.state.receivers !== null) {
      return Helper.deepCopy(this.$store.state.receivers).sort(Helper.sortByTitle);
    } else {
      return [] as IReceiver[];
    }
  }

  public closeItem(item: IReceiver) {
    if (item.id < 0) {
      // remove temporary added item
      this.$store.commit(MutationType.DeleteGdpr, item);
    } else if (!this.isFormValidAndSaved('adminReceiverManager')) {
      this.receiverItems.filter(
        f => f.id === item.id
      )[0].title = this.$store.state.receivers.filter(f => f.id === item.id)[0].title;
    }
    this.selectedItem = {};
    this.selectedId = null;
  }

  public async onSaveClick(item: IReceiver) {
    if (this.selectedId! < 0) {
      await this.createReceiver(item);
    } else {
      await this.saveReceiver(item);
    }
  }

  /**
   * Save a receiver
   */
  public async saveReceiver(item: IReceiver) {
    try {
      await this.$store.dispatch('updateReceiver', { receiver: item });
      this.$validator.reset();
      this.selectedItem = {};
      this.selectedId = null;
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
        error: new Error('saveReceiver is missingtitle!'),
        errorDisplayMessage: this.$i18n
          .t('component.adminReceiverManager.error.onSaveReceiver.missingTitle')
          .toString()
        });
      } else {
        if (err === ErrorCode.MissingUrl) {
          this.$emit('onError', {
          error: new Error('saveReceiver is missing path!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminReceiverManager.error.onSaveReceiver.missingPath')
            .toString()
          });
        } else {
          this.$emit('onError', {
          error: err,
          errorDisplayMessage: this.$i18n.t('component.adminReceiverManager.error.onSaveReceiver.general').toString()
          });
        }
      }
    }
  }

  /**
   * Delete a receiver
   */
  public async deleteReceiver(item: IReceiver) {
    this.selectedEvent = 'deleteReceiver';
    this.selectedItem = item;
    this.selectedId = item.id;
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminReceiverManager.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminReceiverManager.confirmDelete.text')
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
    } as IReceiver;
    this.$store.commit(MutationType.UpdatedReceiver, newItem);
    this.selectedId = newItem.id;
  }

  /**
   * Create new receiver
   */
  public async createReceiver(item) {
    try {
      await this.$store.dispatch('createReceiver', {
        receiver: {
          id: null,
          title: item.title,
          url: item.url
        }
      });
      // remove temporary added item
      this.$store.commit(MutationType.DeleteReceiver, item);
      this.selectedId = null;
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
        error: new Error('createReceiver is missingtitle!'),
        errorDisplayMessage: this.$i18n
          .t('component.adminReceiverManager.error.onCreateReceiver')
          .toString()
        });
      } else {
        if (err === ErrorCode.MissingUrl) {
          this.$emit('onError', {
          error: new Error('createReceiver is missing path!'),
          errorDisplayMessage: this.$i18n
            .t('component.adminReceiverManager.error.onCreateReceiver')
            .toString()
        });
      } else {
          this.$emit('onError', {
            error: new Error('createReceiver' + this.$i18n.t('app.error.general').toString()),
            errorDisplayMessage: err
          });
        }
      }
    }
  }

  /**
   * Emit close for confirm dialog.
   */
  private async confirmDialogClose(yes: boolean) {
    this.showConfirmDialog = false;
    if (yes && this.selectedEvent === 'deleteReceiver') {
      const errMsg = this.$i18n.t('component.adminReceiverManager.error.onDeleteReceiver.general');

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
            receiver: this.selectedItem
          });
        } catch (err) {
        if (err === ErrorCode.CannotDeleteObject) {
          this.$emit('onError', {
          error: new Error('deleteReceiver have a relation to !'),
          errorDisplayMessage: this.$i18n
              .t('component.adminReceiverManager.error.onDeleteReceiver.restricted')
              .toString()
          });
        } else {
          this.$emit('onError', { error: err, errorDisplayMessage: errMsg });
        }
      }
    } else if (yes && this.selectedEvent === 'onCloseReceiverDialog') {
      this.$emit('onCloseReceiverDialog');
    }
  }

  private selectReceiverItem(item: IReceiver) {
    this.selectedItem = item;
    this.selectedId = item.id;
  }

  /**
   * Close the reciever dialog
   */
  private async onCloseReceiverDialog() {
    await this.$validator.validateAll('adminReceiverManager');
    if (!this.isFormValidAndSaved('adminReceiverManager')) {
      this.selectedEvent = 'onCloseReceiverDialog';
      this.showConfirmDialogTitle = this.$i18n
          .t('component.adminReceiverManager.confirmCloseReceiver.title')
          .toString();
      this.showConfirmDialogText = this.$i18n
          .t('component.adminReceiverManager.confirmCloseReceiver.text')
          .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onCloseReceiverDialog');
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
.admin-receiver-manager-card {
  background-color: white; 
  width: 645px; 
  .v-card__text {
    .v-list.theme--light {
      .v-list__tile.theme--light {
        height: 100%;
        .v-list__tile__content {
          background-color: $primary-bg;
          padding: 10px;
          margin-left: -16px;
          margin-right: -16px;
          .receiver-card {
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