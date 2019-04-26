<template>
  <div class="form-user-contact-info">
    <!-- Info om GDPR -->
    <v-container fluid pa-0>
      <v-card class="user-contact-info-card" flat>
          <h2 class="pt-2 pb-3" tabindex="0">{{$t('component.formUserContactInfo.title')}}</h2>
          <div class="field">
            <form-field-preview :title="$t('component.formUserContactInfo.socialsecuritynumber')" :value="getTrimmedSocialSecurityNumber"></form-field-preview>
          </div>
          <div class="field">
            <form-field-preview :title="$t('component.formUserContactInfo.firstname')" :value="userContactInfo.firstName"></form-field-preview>
          </div>
          <div class="field">
            <form-field-preview :title="$t('component.formUserContactInfo.lastname')" :value="userContactInfo.lastName"></form-field-preview>
          </div>
          <v-text-field
            v-model="usersAddress"
            id="testadress"
            v-validate="'required'"
            data-vv-name="usersAddress"
            :data-vv-as="$t('component.formUserContactInfo.address')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(validationScope + '.usersAddress')"
            :append-icon="getValidationIcon('usersAddress')"
            :success="getIsSuccess('usersAddress')"
            box
          >
            <div slot="label">{{$t('component.formUserContactInfo.address')}} <span>*</span></div>
          </v-text-field>
          <v-text-field
            v-model="userPostalNumber"
            id="testpost"
            v-validate="'required'"
            data-vv-name="userPostalNumber"
            :data-vv-as="$t('component.formUserContactInfo.postalNumber')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(validationScope + '.userPostalNumber')"
            :append-icon="getValidationIcon('userPostalNumber')"
            :success="getIsSuccess('userPostalNumber')"
            box
          >
            <div slot="label">{{$t('component.formUserContactInfo.postalNumber')}} <span>*</span></div>
          </v-text-field>
          <v-text-field
            v-model="userCity"
            id="testcity"
            v-validate="'required'"
            data-vv-name="userCity"
            :data-vv-as="$t('component.formUserContactInfo.city')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(validationScope + '.userCity')"
            :append-icon="getValidationIcon('userCity')"
            :success="getIsSuccess('userCity')"
            box
          >
            <div slot="label">{{$t('component.formUserContactInfo.city')}} <span>*</span></div>
          </v-text-field>
          <v-text-field
            v-model="userPhonenumber"
            :label="$t('component.formUserContactInfo.phonenumber')"
            v-validate="'phonenumber'"
            data-vv-name="userPhonenumber"
            :data-vv-as="$t('component.formUserContactInfo.phonenumber')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(validationScope + '.userPhonenumber')"
            :append-icon="getValidationIcon('userPhonenumber')"
            :success="getIsSuccess('userPhonenumber')"
            box
          ></v-text-field>
          <v-text-field 
            v-model="userEmail"
            :label="$t('component.formUserContactInfo.email')"
            v-validate="'email'"
            data-vv-name="userEmail"
            :data-vv-as="$t('component.formUserContactInfo.email')"
            :data-vv-scope="validationScope"
            :error-messages="errors.first(validationScope + '.userEmail')"
            :append-icon="getValidationIcon('userEmail')"
            :success="getIsSuccess('userEmail')"
            box
          ></v-text-field>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject } from 'vue-property-decorator';
import { IUserContactInfo } from '@/models/IForm';
import FormFieldPreview from '@/components/form/FormFieldPreview.vue';

/**
 * Component showing the user's information
 * @prop {IUserContactInfo} userContactInfo - Users contact information.
 * @prop {string} validationScope - Set scope for validation, ie when it is to be evaluated.
 */

@Component({
  components: {
    FormFieldPreview
  }
})
export default class FormUserContactInfo extends Vue {
  @Inject('validator') public $validator: any;

  @Prop() public userContactInfo!: IUserContactInfo;
  @Prop() public validationScope!: string;

  get getTrimmedSocialSecurityNumber() {
    return (
      this.userContactInfo.socialSecurityNumber.substring(
        0,
        this.userContactInfo.socialSecurityNumber.length - 4
      ) + '....'
    );
  }

  get usersAddress(): string {
    return this.userContactInfo.address;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set usersAddress(value: string) {
    this.storeUpdateFormUserContactInfo(value, 'address');
  }

  get userPostalNumber(): string {
    return this.userContactInfo.postalNumber;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set userPostalNumber(value: string) {
    this.storeUpdateFormUserContactInfo(value, 'postalNumber');
  }

  get userCity(): string {
    return this.userContactInfo.city;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set userCity(value: string) {
    this.storeUpdateFormUserContactInfo(value, 'city');
  }

  get userPhonenumber(): string {
    return this.userContactInfo.phoneNumber;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set userPhonenumber(value: string) {
    this.storeUpdateFormUserContactInfo(value, 'phoneNumber');
  }

  get userEmail(): string {
    return this.userContactInfo.email;
  }

  /**
   * Set value in state
   * @param {string} value - New value that should be set
   */
  set userEmail(value: string) {
    this.storeUpdateFormUserContactInfo(value, 'email');
  }

    /**
     * Check if the value has any errors
     */
    private getIsError(value): boolean {
      return this.$validator.errors.has(value, this.validationScope);
    }

    /**
     * Check if the value has changed and validation is correct
     */
    private getIsSuccess(value): boolean {
      const field =  this.$validator.fields.find({ name: value, scope: this.validationScope });
      const isValid: boolean = field ? field.flags.valid : false;
      const isChanged: boolean = field ? field.flags.changed : false;
      return isValid && isChanged;
    }

    /**
     * Validation icon to show if field was validated correctly or has error
     */
    private getValidationIcon(value): string {
      return this.getIsSuccess(value) ? 'check_circle_outline' : this.getIsError(value) ? 'warning' : '';
    }

  /**
   * Updates store NO debounce
   * @param value The value we want to update in the store
   * @param item Name of the item we want to update. ex: 'address'
   */
  private storeUpdateFormUserContactInfo(value: any, item: string) {
    this.$store.commit('updateFormUserContactInfo', { newValue: value, item });
  }
}
</script>

<style scoped lang="scss">
  .field {
    padding-bottom: 20px;
    margin-bottom: 0px;
    border-bottom: 1px solid $grey-lighten-3;
  }  
  .title {
    padding-top: 40px;
    padding-bottom: 30px;
  }
  .field-title {
    display: block;    
    padding-bottom: 0px;
  }
</style>