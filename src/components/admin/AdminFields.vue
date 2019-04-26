<template>
<div class="admin-fields">
  
  <!-- Field Right Click Menu -->
  <v-menu
      v-model="rightClickedField"
      :position-x="mousePositionX"
      :position-y="mousePositionY"
      absolute
      offset-y
      min-width="220px"
    >
    <v-list>
      <v-list-tile>
        <v-list-tile-title>
          <a @click.prevent="deleteFieldIfConfirmed(rightClickFieldId)">
              <v-icon>delete_forever</v-icon>
              {{ $t("component.adminFields.rightClickMenu.delete") }}
          </a>
        </v-list-tile-title>
      </v-list-tile>
      <v-divider></v-divider>
      <v-list-tile>
        <v-list-tile-title>
          <a @click.prevent="cutField(rightClickFieldId)">
              <v-icon>toys</v-icon>
              {{ $t("component.adminFields.rightClickMenu.cut") }}
          </a>
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-title>
          <a @click.prevent="copyField(rightClickFieldId)">
              <v-icon>save_alt</v-icon>
              {{ $t("component.adminFields.rightClickMenu.copy") }}
          </a>
        </v-list-tile-title>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-title>
          <a @click.prevent="pasteCopiedField(rightClickFieldId)" :class="copiedFieldJson ? '':'disabled'">
              <v-icon>file_copy</v-icon>
              {{ $t("component.adminFields.rightClickMenu.paste") }} {{ getTitleOfCopiedField() }}
          </a>
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>

  <!-- Drop Zone Right Click Menu -->
  <v-menu
      v-model="rightClickedDropZone"
      :position-x="mousePositionX"
      :position-y="mousePositionY"
      absolute
      offset-y
      min-width="220px"
    >
    <v-list>
      <v-list-tile>
        <v-list-tile-title>
          <a @click.prevent="pasteCopiedField()" :class="copiedFieldJson ? '':'disabled'">
              <v-icon>file_copy</v-icon>
              {{ $t("component.adminFields.rightClickMenu.paste") }} {{ getTitleOfCopiedField() }}
          </a>
        </v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-menu>

  <v-list>
   <draggable v-model="formFields" @change="onAddFieldDragged" :options="draggableOptions">
    <v-list-group
      ref="fieldComponents"
      v-for="field in formFields"
      :key="field.id"
      :value="field.id === selectedFieldId"
      :prepend-icon="getFieldIcon(field)"
      :class="getFieldClasses(field)"
      @click="onListClick(field.id, $event)"
      @contextmenu.prevent="onRightClick(field.id, $event)"
      :style="getBorderStyle(field)"
      >
      
      <!-- List-group-title -->
      <v-list-tile slot="activator" :class="'list-hotfix' + (hasValidationError(field) ? ' validation-error':'')">
        <v-list-tile-title class="text-truncate" :title="field.title">
          <span>{{handleTitle(field.title)}}</span>
        </v-list-tile-title> 
        <v-list-tile-action>
          <v-list-tile-action-text>
            <span class="caption font-italic">{{ translateFieldType(field.type) }}</span>
            </v-list-tile-action-text>     
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile-content>
        <v-card @contextmenu.prevent="onRightClick(field.id, $event)">
          <!-- Show field components in admin mode -->
          <v-card-text>
            <v-form>
              <dynamic-field-component 
                :key="field.id" 
                :field="field"
                :validationScope="stepIndex.toString()"
                mode="ADMIN"
                ></dynamic-field-component>
            </v-form>
          </v-card-text>

          <!-- Delete-field -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="error" @click="deleteFieldIfConfirmed(field.id)" :title="$t('component.adminFields.field.delete.btnText')">
            <span>{{ $t("component.adminFields.field.delete.btnText") }}</span>
            </v-btn>
          </v-card-actions>

        </v-card>       
      </v-list-tile-content>
    </v-list-group>
    <!-- Drop Zone -->
    <div class="drop-zone" @contextmenu.prevent="onRightClick('DROPZONE', $event)">
      {{ $t('component.adminForm.dropZoneInfo') }}
    </div>
  </draggable>
  </v-list>

  <!-- Dialog confirm delete of field -->  
  <base-confirm-dialog ref="removeFieldDialog"
    :title="$t('component.adminFields.field.confirmDelete.title')"
    :text="$t('component.adminFields.field.confirmDelete.text')" />    

  <!-- Dialog confirm delete of field that is a mother -->  
  <base-confirm-dialog ref="removeMotherFieldDialog"
    :title="$t('component.adminFields.field.confirmDeleteMotherQuestion.title')"
    :text="$t('component.adminFields.field.confirmDeleteMotherQuestion.text')" />

</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { IFormStep, IFormField, IRootState, IDisplayRule } from '@/models/IForm';
import { MutationType, FormFieldType, FormFieldIcon } from '@/models/Enums';
import { Helper } from '@/utils/helper';
import { EventBus, EventBusEvent, IEventAddFieldDblClick } from '@/utils/EventBus';
import { findFormFieldInStep, findStepIndex } from '@/store/utils';
import FormFieldHelper from '@/models/FormFieldHelper';
import draggable from 'vuedraggable';
import BaseConfirmDialog from '@/components/base/BaseConfirmDialog.vue';
import DynamicFieldComponent from '@/components/field/DynamicFieldComponent.vue';

/**
 * Component that list fields.
 */
@Component({
  components: {
    draggable,
    BaseConfirmDialog,
    DynamicFieldComponent
  }
})
export default class AdminFields extends Vue  {
  @Inject('validator') public $validator: any;
  @Prop({ default: [] }) public fields!: IFormField[];
  @Prop() public stepId: any;
  @Prop() public stepIndex: any;

  private rightClickedDropZone: boolean = false;
  private rightClickedField: boolean = false;
  private rightClickFieldId: any = null;
  private selectedFieldId: any = null;
  private showCancelDialog: boolean = false;
  private mousePositionX: number = 1;
  private mousePositionY: number = 1;
  private cutFieldId: string = '';

  private draggableOptions = {
    filter: '.v-list__group--active',
    group: {name: 'draggableField'},
    preventOnFilter: false
  };

  public async created() {
    EventBus.$on(EventBusEvent.onAddFieldDblClick, this.onAddFieldDblClick);
  }

  public async beforeDestroy() {
    EventBus.$off(EventBusEvent.onAddFieldDblClick);
  }

  public getBorderStyle(field: IFormField) {
    const motherColor = this.getMotherColor(field.guid);
    let borderStyle = '';
    if (motherColor) {
      // field is mother
      borderStyle = 'border-left: ' + motherColor + ' solid 5px';
    } else if (field.displayRuleGuid) {
      // field is child
      const childDisplayRule = this.$store.state.form.attributes.displayRules.find(
        displayRule => displayRule.guid === field.displayRuleGuid
      );
      // find the color of the mother
      if (childDisplayRule) {
        borderStyle = 'border-left: ' +
          this.getMotherColor(childDisplayRule.fieldGuid) + ' solid 2px; margin-left: 20px';
      }
    }
    return borderStyle;
  }

  public getMotherColor(fieldGuid) {
    const displayRule = this.$store.state.form.attributes.displayRules.find(
      displayRule => displayRule.fieldGuid === fieldGuid
    );
    return displayRule ? displayRule.colorCode : null;
  }

  public handleTitle(title: string): string {
    if (title !== '') {
      return title;
    }
    return this.$t('component.adminFields.field.defaultNewTitle').toString();
  }

  /**
   * Get translation for field type
   */
  public translateFieldType(type: string): string {
    const key = type[0].toLowerCase() + type.slice(1);
    return this.$t('component' + '.' + key + '.title').toString();
  }

  public hasValidationError(field: IFormField) {
    // todo: is this function a performace issue?
    const errors = this.$validator.errors;
    const found = errors.items.find(i => i.field.startsWith(i.scope + '.' + field.id));
    return  found ? true : false;
  }

  /**
   * Get computed-fields from property fields
   */
  get formFields(): IFormField[] {
    return this.fields ? this.fields.slice() : [];
  }

  set formFields(newFieldList) {
    this.$store.commit(MutationType.UpdateFormStep, {id: this.stepId, propertyName: 'fields', newValue: newFieldList});
  }

  /** Get helper class for access in template */
  get helper(): Helper {
    return Helper;
  }

  private onListClick(fieldId, event: Event) {
    if (this.selectedFieldId === fieldId) {
      this.selectedFieldId = null;
    } else {
      this.selectedFieldId = fieldId;
    }
  }

  private onRightClick(fieldId, $event) {
    this.mousePositionX = $event.clientX;
    this.mousePositionY = $event.clientY;
    if (fieldId === 'DROPZONE') {
      this.rightClickedDropZone = true;
    } else {
      this.rightClickedField = true;
      this.rightClickFieldId = fieldId;
    }
  }

  private cutField(fieldId) {

    // Important to startoff by copying the field
    this.copyField(fieldId);

    // save a refrence of which field we're cutting
    // in local state, used later to apply a certain
    // styling of fields that is about to be cut out
    this.cutFieldId = fieldId;

    // save original guid, that we later will monkey patch onto
    // the copied field
    const cutFieldGuid = this.fields.filter(f => f.id === fieldId)[0].guid;

    // Once the field is about to be pasted we turn this
    // copy-of-field into a cut-out
    this.$once('beforeFieldPasted', (copiedField: IFormField) => {
      // apply the correct/original id and guid to the copy, since this is a cut out
      copiedField.id = this.cutFieldId;
      copiedField.guid = cutFieldGuid;
      // We remove the field once we know that the field, which is cut, will become pasted somewhere
      this.deleteField(fieldId);
      // Since this is a cut-out (not a copy) we remove the copied data
      this.$store.commit(MutationType.CopyField, {fieldJson: null});
      this.cutFieldId = '';
    });
  }

  private copyField(fieldId) {
    this.resetCutField();
    const field = this.fields.filter(f => f.id === fieldId)[0];
    this.$store.commit(MutationType.CopyField, {fieldJson: JSON.stringify(field)});
  }

  private pasteCopiedField(nearFieldId = null) {
    if (this.copiedFieldJson) {
      const originalField = JSON.parse(this.copiedFieldJson) as IFormField;
      const newField = FormFieldHelper.createFromCopy(originalField);
      this.$emit('beforeFieldPasted', newField);
      this.$store.commit(MutationType.AddFormField, {
        nearFieldId,
        stepId: this.stepId,
        data: newField
      });
      this.$store.commit(MutationType.AddFieldIdToPasteHistory, {idOfPastedField: newField.id});
      this.resetCutField();
    }
  }

  private resetCutField() {
    this.cutFieldId = '';
    this.$off('beforeFieldPasted'); // in case we cut something before, which we didn't paste
  }

  /**
   * When field from toolbar is dragged to list
   */
  private onAddFieldDragged(itemToAdd: any) {
    this.$emit('onAddField', itemToAdd);
    // Open the added field
    if (itemToAdd && itemToAdd.added && itemToAdd.added.element) {
      this.selectedFieldId = itemToAdd.added.element.id;
    }
  }

  /**
   * When doubleclick field in toolbar
   */
  private onAddFieldDblClick(event: IEventAddFieldDblClick) {
    // Only update selectedField on the step we are adding field
    if (event.stepId === this.stepId && (event && event.field && event.field.id)) {
      this.selectedFieldId = event.field.id;
    }
  }

  /**
   * Delete a field, but first confirm the deletion
   */
  private async deleteFieldIfConfirmed(fieldId) {
    let doDelete = false;
    const fieldGuid = this.fields.find(f => f.id === fieldId)!.guid;
    const displayRules = this.$store.state.form.attributes.displayRules.filter(rule => rule.fieldGuid === fieldGuid);

    if (displayRules.length) {
      doDelete = await (this.$refs.removeMotherFieldDialog as BaseConfirmDialog).confirm();
    } else {
      doDelete = await (this.$refs.removeFieldDialog as BaseConfirmDialog).confirm();
    }

    if (doDelete) {
      this.deleteField(fieldId);
      this.deleteDisplayRules(displayRules);
    }
  }

  private deleteField(fieldId) {
    const errMsg = this.$t('component.adminFields.field.error.onDeleteField');
    try {
      this.$store.commit(MutationType.DeleteFormField, { fieldId });
      if (fieldId === this.selectedFieldId) {
        this.selectedFieldId = null;
      }
    } catch (err) {
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg});
    }
  }

  private deleteDisplayRules(displayRules: IDisplayRule[]) {
    try {
      displayRules.forEach((rule: IDisplayRule) => {
        this.$store.commit('deleteDisplayRule', {
          dispalyRuleGuid: rule.guid
        });
      });
    } catch (err) {
      const errMsg = this.$t('component.adminFields.field.error.onDeleteField');
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg});
    }
  }

  private getFieldClasses(field: IFormField | any) {
    const classes: string[] = [];
    if (this.hasValidationError(field)) {
      classes.push('validation-error');
    }
    if (this.isRecentlyPastedField(field)) {
      classes.push('flash');
    }
    if (field.id === this.cutFieldId) {
      classes.push('is-cut');
    }
    return classes.join(' ');
  }

  private isRecentlyPastedField(field: IFormField): boolean {
    const paste = (this.$store.state as IRootState).fieldCopyMemory.history.find(d => d.idOfPastedField === field.id);
    if (paste) {
      if (paste.time >= (new Date().getTime() - 2500)) {
        // it's considered recent if it happened 2,5 seconds ago
        return true;
      }
    }
    return false;
  }

  private getFieldIcon(field: IFormField): string {
    const icon = FormFieldIcon[field.type];
    if (icon == null) {
      return 'ballot';
    }
    return icon.toString();
  }

  private get copiedFieldJson(): string | null {
    return (this.$store.state as IRootState).fieldCopyMemory.copiedField;
  }

  private getTitleOfCopiedField(): string {
    if (this.copiedFieldJson) {
      const copiedField = JSON.parse(this.copiedFieldJson) as IFormField;
      return '(' + copiedField.title + ')';
    }
    return '';
  }
}
</script>

<style scoped lang="scss">
a.disabled {
  color: #333 !important;
  opacity: 0.5;
  cursor: default;
}
.is-cut {
  opacity: 0.75;
  background: rgba(0,0,0,.1);
  font-style: italic;
}
.admin-fields {  
  .drop-zone {
    margin-top: 15px;
    border: $accent dashed 2px;
    padding: 25px;
    color: $black;
    text-align: center;
    background: $white; 
    cursor: default;
  }
  .sortable-ghost {    
    background-color: $primary-bg;
  }
  .sortable-chosen {    
    background-color: $primary-bg;
  }

  .v-list__group {
    /* Display list of fields with borders */
    border: 1px solid $black-bg;
    border-radius: 2px;
    
    &.v-list__group--active {
      /* Selected field shows in primary-bg color */
      background-color: $primary-bg;
      padding: 0px 2px 2px 2px;
    }
    &.v-list__group.validation-error {
      /* Selected field shows in error-bg color */
      background-color: $error-bg;
    }
  }
  .list-hotfix {
    /** todo: remove when fixed in vuetify */
    /** https://github.com/vuetifyjs/vuetify/issues/3038 */
    flex: 1 1 auto !important;
    overflow: hidden;
  }
  .list-hotfix.validation-error {
    .v-list__tile div {
      color: $error !important;
    }
  }
  .v-list__tile__action { 
    width: 80px;    
  }

  // Flash animation
  @-webkit-keyframes flash {
    0% { opacity: 1; } 
    50% { opacity: .1; } 
    100% { opacity: 1; }
  }
  @keyframes flash {
    0% { opacity: 1; } 
    50% { opacity: .1; } 
    100% { opacity: 1; }
  }

  .flash {
    .v-list__tile__title {
      -webkit-animation: flash linear 0.5s;
      animation: flash linear 0.5s;
      animation-iteration-count: 3;
      -webkit-iteration-count: 3;
    }
  } 
}
</style>