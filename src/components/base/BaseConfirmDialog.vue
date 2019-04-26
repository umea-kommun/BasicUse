<template>
  <div class="base-confirm-dialog">
    <v-dialog transition="slide-y-transition" v-model="doOpen" max-width="540px" persistent @keydown.esc="onConfirmDialogNo()">
      <v-card role="alert">
        <v-card-title>
          <strong>{{ getTitle }}</strong>
        </v-card-title>
        <v-card-text>
          <p>{{ getText }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            color="error"
            @click="onConfirmDialogYes()"
            :title="$t('app.nav.yes')"
            :showDialog="this.showDialog"
          >{{ yesButtonLabel || $t("app.nav.yes") }}</v-btn>
          <v-btn
            flat
            @click="onConfirmDialogNo()"
            :title="$t('app.nav.no')"
            :showDialog="this.showDialog"
          >{{ noButtonLabel || $t("app.nav.no") }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

/**
 * Component for confirm dialog
 * @prop {string} title - Title for confirmation dialog.
 * @prop {string} text - Text message for confirmation dialog.
 * @prop {string} showDialog - Showing confirmation dialog.
 */

@Component
export default class BaseConfirmDialog extends Vue {
  @Prop({ default: '' }) public title!: string;
  @Prop({ default: '' }) public text!: string;
  @Prop({ default: false }) public showDialog!: boolean;
  @Prop({ default: '' }) public yesButtonLabel!: string;
  @Prop({ default: '' }) public noButtonLabel!: string;

  /** Controls the dialog, can be set programatically by calling component.confirm() or via showDialog prop */
  private isDialogOpen: boolean = false;

  get getTitle() {
    if (!this.title) {
      return this.$i18n.t('component.BaseConfirmDialog.default.title').toString();
    }
    return this.title;
  }

  get getText() {
    if (!this.text) {
      return this.$i18n.t('component.BaseConfirmDialog.default.text').toString();
    }
    return this.text;
  }

  public created() {
    this.doOpen = this.showDialog ? this.showDialog : false;
  }

  get doOpen(): boolean {
    return this.isDialogOpen || this.showDialog;
  }

  set doOpen(isOpen: boolean) {
    this.isDialogOpen = isOpen;
  }

  /**
   * Opens up the confirm dialog, will resolve to true/false depending on whether
   * or not the user confirms the question
   */
  public confirm(): Promise<boolean> {
    this.doOpen = true;
    return new Promise((resolve: any) => {
      this.$once('onConfirmDialogYes', () => {
        resolve(true);
      });
      this.$once('onConfirmDialogNo', () => {
        resolve(false);
      });
    });
  }

  /**
   * Show dialog
   */
  private onConfirmDialogYes() {
    this.doOpen = false;
    this.$emit('onConfirmDialogYes');
    this.$emit('onConfirmDialog', true);
  }

  /**
   * Hide dialog
   */
  private onConfirmDialogNo() {
    this.doOpen = false;
    this.$emit('onConfirmDialogNo');
    this.$emit('onConfirmDialog', false);
  }
}
</script>

<style scoped lang="scss">
</style>
