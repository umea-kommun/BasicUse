<template>
  <div class="admin-pm3-manager">
    <v-dialog v-model="showPm3Dialog" scrollable persistent width="645">
      <v-card style="background-color: white; width: 645px;" class="admin-pm3-manager-card">
        <v-card-title card height="80px">
          <h3>
            <strong>{{ $t('component.adminPm3Manager.title') }}</strong>
          </h3>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click.native="createPm3">
            <v-icon left>add</v-icon>
            {{ $t('component.adminPm3Manager.create') }}
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-list class="pm3-list">
            <template v-for="(item, index) in pm3Items">
              <v-list-tile :key="'tile-' + index" :id="'tile-' + item.id">
                <v-list-tile-title :title="item.title" v-show="selectedItem != item">{{ item.title }}</v-list-tile-title>
                <!-- Field-Content -->
                <v-slide-y-transition>
                  <v-list-tile-content v-show="selectedItem === item">
                    <v-card class="pm3-card">
                      <v-card-text>
                        <v-text-field
                          v-model="item.title"
                          :label="$t('component.adminPm3Manager.pm3.title')"
                          v-validate="'required'"
                          :data-vv-name="'adminPm3Manager.' + item.id + 'title'"
                          data-vv-scope="adminPm3Manager"
                          :error-messages="errors.first('adminPm3Manager.' + item.id + 'title')"
                          box
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn
                          flat
                          color="error"
                          :title="$t('component.adminPm3Manager.delete')"
                          @click.native="deletePm3(item)"
                        >
                          <span>{{ $t("component.adminPm3Manager.delete") }}</span>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn
                          flat
                          :title="$t('component.adminPm3Manager.cancel')"
                          @click.native="closeItem(item)"
                        >
                          <span>{{ $t("component.adminPm3Manager.cancel") }}</span>
                        </v-btn>
                        <v-btn
                          flat
                          color="primary"
                          :title="$t('component.adminPm3Manager.save')"
                          @click.native="savePm3(item)"
                        >
                          <span>{{ $t("component.adminPm3Manager.save") }}</span>
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-list-tile-content>
                </v-slide-y-transition>
                <v-list-tile-action style="text-align:right;" v-show="selectedItem != item">
                  <v-btn icon @click.native="selectPm3Item(item)">
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
            @click.native="onClosePm3Dialog()"
          >{{ $t('component.adminPm3Manager.close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Provide, Inject } from 'vue-property-decorator';
import { IPm3, IItem } from '@/models/IForm';
import { ErrorCode } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';

/**
 * Administration of pm3
 */
@Component({
  components: {
    BaseConfirmDialog
  }
})
export default class AdminPm3Manager extends Vue {

  // Inject validation object
  @Inject('validator') public $validator: any;

  public showPm3Dialog: boolean = true;
  private showConfirmDialog: boolean = false;
  private showConfirmDialogTitle: string = '';
  private showConfirmDialogText: string = '';
  private selectedItem: any = {};
  private selectedEvent!: string;
  private isAddedNew: boolean = false;

  /**
   * Run when component is created
   */
  public async created() {
    await this.$store.dispatch('getPm3List');
  }

  public async beforeUpdate() {
    // Open after created
    // If added new then open it.
    if (this.isAddedNew && this.pm3Items.length > 0) {
      // Take newest item.
      this.selectedItem = this.pm3Items.sort((s1: IPm3, s2: IPm3) => s2.id! - s1.id!)[0];
    }
    this.isAddedNew = false;
  }

  /**
   * Get pm3Items from state
   * @return {IPm3[]} A list with pm3Items
   */
  get pm3Items(): IPm3[] {
    if (this.$store.state.pm3 !== null) {
      return Helper.deepCopy(this.$store.state.pm3).sort(Helper.sortByTitle);
    } else {
      return [] as IPm3[];
    }
  }

  public closeItem(item: IPm3) {
    if (!this.isFormValidAndSaved('adminPm3Manager')) {
      this.pm3Items.filter(
        f => f.id === item.id
      )[0].title = this.$store.state.pm3.filter(f => f.id === item.id)[0].title;
    }
    this.selectedItem = {};
  }

  /**
   * Save a pm3
   */
  public async savePm3(item: IPm3) {
    try {
      await this.$store.dispatch('updatePm3', { pm3: item });
      this.$validator.reset();
      this.selectedItem = {};
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
        error: new Error('savePm3 is missingtitle!'),
        errorDisplayMessage: this.$i18n
          .t('component.adminPm3Manager.error.onSavePm3.missing')
          .toString()
        });
      } else {
        this.$emit('onError', {
        error: err,
        errorDisplayMessage: this.$i18n.t('component.adminPm3Manager.error.onSavePm3.general').toString()
        });
      }
    }
  }

  /**
   * Delete a pm3
   */
  public async deletePm3(item: IPm3) {
    this.selectedEvent = 'deletePm3';
    this.selectedItem = item;
    this.showConfirmDialogTitle = this.$i18n
      .t('component.adminPm3Manager.confirmDelete.title')
      .toString();
    this.showConfirmDialogText = this.$i18n
      .t('component.adminPm3Manager.confirmDelete.text')
      .toString();
    // Show confirmation-window
    this.showConfirmDialog = true;
  }

  /**
   * Create new pm3
   */
  public async createPm3() {
    try {
      await this.$store.dispatch('createPm3', {
      pm3: {
          id: null,
          title: this.$i18n
            .t('component.adminPm3Manager.pm3.defaultTitle')
            .toString()
        }
      });
      this.isAddedNew = true;
    } catch (err) {
      if (err === ErrorCode.MissingTitle) {
        this.$emit('onError', {
        error: new Error('createPm3 is missingtitle!'),
        errorDisplayMessage: this.$i18n
          .t('component.adminPm3Manager.error.onCreatePm3')
          .toString()
        });
      } else {
        this.$emit('onError', {
          error: new Error('createPm3' + this.$i18n.t('app.error.general').toString()),
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
    if (yes && this.selectedEvent === 'deletePm3') {
    const errMsg = this.$i18n.t('component.adminPm3Manager.error.onDeletePm3.general');

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
          pm3: this.selectedItem
        });
      } catch (err) {
        if (err === ErrorCode.CannotDeleteObject) {
          this.$emit('onError', {
          error: new Error('deletePm3 have a relation to !'),
          errorDisplayMessage: this.$i18n
              .t('component.adminPm3Manager.error.onDeletePm3.restricted')
              .toString()
          });
        } else {
          this.$emit('onError', { error: err, errorDisplayMessage: errMsg });
        }
      }
    } else if (yes && this.selectedEvent === 'onClosePm3Dialog') {
      this.$emit('onClosePm3Dialog');
    }
  }

  private selectPm3Item(item: IPm3) {
    this.selectedItem = item;
  }

  /**
   * Close the pm3 dialog
   */
  private async onClosePm3Dialog() {
    await this.$validator.validateAll('adminPm3Manager');
    if (!this.isFormValidAndSaved('adminPm3Manager')) {
      this.selectedEvent = 'onClosePm3Dialog';
      this.showConfirmDialogTitle = this.$i18n
          .t('component.adminPm3Manager.confirmClosePm3.title')
          .toString();
      this.showConfirmDialogText = this.$i18n
          .t('component.adminPm3Manager.confirmClosePm3.text')
          .toString();
      this.showConfirmDialog = true;
    } else {
      this.$emit('onClosePm3Dialog');
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
.admin-pm3-manager-card {
  .v-card__text {
    .v-list.theme--light {
      .v-list__tile.theme--light {
        height: 100%;
        .v-list__tile__content {
          background-color: $primary-bg;
          padding: 10px;
          margin-left: -16px;
          margin-right: -16px;
          .pm3-card {
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
}
</style>