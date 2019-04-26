<template>
  <div class="admin-validation-manager">
    
    <!-- Button to add validation -->
    <v-menu bottom right>
      <v-btn slot="activator" flat color="primary">
        <v-icon left>add</v-icon>
      <span>{{ $t('component.adminValidationManager.validation.title') }}</span>
    </v-btn>
    <v-list>
      <v-list-tile v-for="item in availableRules" :key="item.type" @click="addValidationRule(item)">
        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
    </v-menu>    

    <!-- List added validations -->
    <v-list v-if="rules">
      <template v-for="(item, index) in rules" >
        <v-list-tile :key="'tile-' + index">
          <!-- Title -->
          <v-list-tile-content>
            <v-list-tile-sub-title>{{ item.title }}</v-list-tile-sub-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <!-- Condition -->
            <v-text-field
                v-if="item.requiresValue"
                v-model="item.value"
                :label="$t('component.adminValidationManager.validation.condition')"                
                solo
                >
            </v-text-field> 
            <v-spacer></v-spacer>

            <!-- Remove validation -->
            <v-btn icon @click="removeValidationRule(item)"><v-icon>delete_outline</v-icon></v-btn>
          </v-list-tile-action>
        </v-list-tile>

        <!-- Line between items -->
        <v-divider :key="'divider-' + index"></v-divider>
      </template>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IValidation, IValidationRule } from '@/models/IValidation';
import { ValidationRuleType } from '@/models/Enums';
import { Helper } from '@/utils/helper';

/**
 * Component to manage validations in fields
 * @prop {IValidation} value - Validation object from field
 * @prop {IValidationRule[]} availableRules - A list of available validation rules
 */

@Component
export default class AdminValidationManager extends Vue {

  @Prop() public value!: IValidation;
  @Prop() public availableRules!: IValidationRule[];
  /** Saves a copy of validation from Property */
  private validationCopy: IValidation = { rules: []};

  /**
   * Computed-Get Validation that take validation from propreties and returns a local copy.
   * Rule title get localized.
   */
  get validation(): IValidation {
    let valCopy: IValidation = { rules: []};

    if (this.value) {
      // Deep copy of objekt
      valCopy = Helper.deepCopy<IValidation>(this.value);
    }

    // Set rules title by locales
    if (valCopy.rules && valCopy.rules.length > 0) {
      valCopy.rules.forEach(rule => {
          rule.title = this.$i18n.tc(`component.adminValidationManager.validation.types.${rule.type}`);
      });
    }


    return valCopy;
  }

  /**
   * Computed-Get validation rules for field.
   */
  get rules(): IValidationRule[] {
    return this.validation.rules;
  }

  /**
   * Add validation rule for field
   */
  public addValidationRule(newRule) {
    const ruleIndex = this.rules.findIndex(rule => {
      return rule.type === newRule.type;
    });

    if (ruleIndex < 0 || this.rules.length === 0) {
      // Create copy from availablerule
      const addRule = Helper.deepCopy(newRule);
      this.validation.rules.push(addRule);

      // Event to parent
      this.$emit('update:value', this.validation);
    }
  }

  /**
   * Remove validation rule from field
   */
  public removeValidationRule(removeRule) {
    this.rules.forEach((rule, index) => {
      if (rule === removeRule) {
        this.validation.rules.splice(index, 1);
        return;
      }
    });

    // Event to parent
    this.$emit('update:value', this.validation);
  }
}
</script>

<style scoped lang="scss">
</style>