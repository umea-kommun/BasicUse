<template>
<div class="admin-steps">
  <!-- step-toolbar -->
  <!-- Pagination between steps and add step -->
  <v-toolbar color="grey lighten-5">
    <v-layout justify-center>
      <v-pagination
        v-model="selectedStepIndex"
        :length="formSteps.length"
        circle
      ></v-pagination>
    </v-layout>
    <v-toolbar-side-icon @click="onAddStep()" :title="$t('component.adminSteps.add.tooltip')">
      <v-icon color="primary">add_circle_outline</v-icon>
    </v-toolbar-side-icon>
  </v-toolbar>
  <!-- Stepper to make validation work on all steps-->
  <v-stepper v-model="selectedStepIndex">
    <v-stepper-items>
      <v-stepper-content
        v-for="(step, index) in formSteps" 
        v-bind:key="`step${(index + 1)}`" 
        :step="(index + 1)"
      >
        <!-- Step -->
        <v-card v-show="step">
          <v-card-text>
            <!-- Show field components in admin mode -->
            <v-form>
              <!-- Step-Title -->
              <v-text-field
                :value="step.title"
                :label="$t('component.adminSteps.title.label')"
                :hint="$t('component.adminSteps.title.hint')"
                v-validate="'required'"
                :data-vv-name="getValidationId(step.id, 'step-title')"
                :data-vv-as="$t('component.adminSteps.title.label')"
                :data-vv-scope="step.id.toString()"
                :error-messages="errors.first(getValidationId(step.id, 'step-title'))"
                data-vv-delay="250"
                v-on:input="onUpdateStep('title', $event)"
                box
              >
              </v-text-field>
              <!-- Step-Description -->      
              <v-textarea
                :value="step.description"
                :label="$t('component.adminSteps.description.label')"
                :hint="$t('component.adminSteps.description.hint')"
                v-on:input="onUpdateStep('description', $event)"
                box
              >
              </v-textarea>
            </v-form>              
            
            <!-- Fields --> 
            <!-- Show field components in admin mode -->
            <admin-fields
              v-show="step && step.fields"
              :fields="step.fields"
              :stepId="step.id"
              :stepIndex="index"
              v-on:onError="$emit($event.error, $event.errorDisplayMessage)"
              >
            </admin-fields>

          </v-card-text>

          <!-- Delete-field -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat color="error" @click="showCancelDialog = true" :title="$t('component.adminSteps.delete.tooltip')">
            <span>{{ $t("component.adminSteps.delete.btnText") }}</span>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
    
  <!-- Dialog confirm deletetion of step-->      
  <v-dialog transition="slide-y-transition" v-model="showCancelDialog" max-width="540px">
    <v-card>
      <v-card-title><strong>{{ $t("component.adminSteps.confirmDelete.title") }}</strong></v-card-title>
      <v-card-text>
        <p>{{ $t("component.adminSteps.confirmDelete.text") }}.</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="error" @click="onDeleteStep()" v-bind:title="$t('app.nav.yes')">{{ $t("app.nav.yes") }}</v-btn>
        <v-btn flat @click="showCancelDialog = false" v-bind:title="$t('app.nav.no')">{{ $t("app.nav.no") }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  

</div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Inject } from 'vue-property-decorator';
import { IFormStep, IFormField } from '@/models/IForm';
import { MutationType } from '@/models/Enums';
import AdminFields from '@/components/admin/AdminFields.vue';
import BaseHtmlEditor from '@/components/base/BaseHtmlEditor.vue';
import { Helper } from '@/utils/helper';
import Debounce from 'debounce-decorator';

/**
 * Component that list steps.
 */
@Component({
  components: {
    BaseHtmlEditor,
    AdminFields,
  }
})
export default class AdminSteps extends Vue {
  @Inject('validator') public $validator: any;
  /** Step that holds all the fields */
  @Prop({ default: [] }) public steps!: IFormStep[];
  // selectedStepIndex has base 1
  private selectedStepIndex: number = 1;
  private oldSelectedStepIndex: number = 1;
  private showCancelDialog: boolean = false;

  /**
   * Get computed-fields from property fields
   */
  get formSteps(): IFormStep[] {
    return this.steps ? Helper.deepCopy<IFormStep[]>(this.steps) : [];
  }

  /**
   * Get the current selected step.
   * @return { IFormStep } Step.
   */
  get currentStep(): IFormStep {
    // selectedStepIndex has 1 as base
    return this.formSteps[this.selectedStepIndex - 1];
  }

  /**
   * Add step to form
   */
  private onAddStep() {
    try {
      const stepCountPlusOne = (this.steps.length + 1).toString();
      const defaultName = this.$t('component.adminSteps.add.defaultName').toString()
                          + ' ' + stepCountPlusOne;
      const step: IFormStep = { type: 'step', id: '', title: defaultName, description: '', fields: [] };

      this.$store.commit(MutationType.AddFormStep, { data: step });
      this.selectedStepIndex = this.steps.length;
    } catch (err) {
      const errMsg = this.$t('component.adminSteps.error.onAddStep').toString();
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg});
    }
  }

  /**
   * Delete step in form
   */
  private onDeleteStep() {
    // Hide modal-window if open
    this.showCancelDialog = false;

    try {
      this.$store.commit(MutationType.DeleteFormStep, { stepId: this.currentStep.id });
      this.selectedStepIndex = this.steps.length;
    } catch (err) {
      const errMsg = this.$t('component.adminSteps.error.onDeleteStep').toString();
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg});
    }
  }

  /**
   * Update title and description on step with a debounce in milliseconds
   */
  @Debounce(250)
  private onUpdateStep(propertyName: string, newValue: string) {
    try {
      this.$store.commit(MutationType.UpdateFormStep, { id: this.currentStep.id, propertyName, newValue });
    } catch (err) {
      const errMsg = this.$t('component.adminSteps.error.onUpdateStep').toString();
      this.$emit('onError', { error: err, errorDisplayMessage: errMsg});
    }
  }

  private getValidationId(scope: number, name: string): string {
    return `${scope.toString()}.${name}`;
  }

  /**
   * Track changes for selectedStepIndex.
   * @param {number} newIndex - New index.
   * @param {number} oldIndex - Old index.
   */
  @Watch('selectedStepIndex')
  private async onStepIndexChanged(newIndex: number | any, oldIndex: number) {
    this.$validator.validate();

    // Emit event that step has changed
    this.$emit('onStepIndexChanged', {
      newIndex: this.selectedStepIndex,
    });
  }

}
</script>

<style scoped lang="scss">
/* Remove padding from stepping component*/
.v-stepper__content {
  padding: 0px;
}
</style>