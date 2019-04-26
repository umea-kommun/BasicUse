<template>
    <div class="auth-notification">      
      <!-- Show snackbar if user have been idle for too long -->
      <v-snackbar          
        v-model="isCountingDown"
        top 
        :timeout="0" 
        color="info"
        multi-line
        role="alert"
        >       
          {{$t('app.auth.loggingOut', { time: countDownText })}}        
      </v-snackbar> 
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { IUser } from '@/models/IForm';
import {mapState} from 'vuex';

/**
 * Komponent som visar när användaren håller på att loggas ut pga inaktivitet under
 * viss tid (vanligtvis 20 minuter). Därefter loggas användaren automatiskt efter att timern har slutat.
 * Om användaren stänger ner datorn och sedan öppnar upp den och går in på sidan så håller idle-vue reda
 * på om tiden har gått ut och loggar ut användaren.
 * @description WCAG: role="alert" to inform user about messages that are not in focus (4.1.3).
 * Update only minutes left in order not to overload screen reader with messages
 */
@Component({
  computed: mapState(['user'])
})
export default class AuthNotification extends Vue {
  public user!: IUser | null;
  public logoutTimeLimit: number = 5;
  public countDownTimer: any;
  public countDownText: string = '';
  public isCountingDown: boolean = false;

  // Variable that is exposed globally by plugin vue-idle
  @Watch('isAppIdle')
  public idleToggle() {
      const idle = (this as any).isAppIdle;
      if (idle && this.user) {
        this.isCountingDown = true;
        let secondsLeftUntilLogout = this.logoutTimeLimit * 60;
        secondsLeftUntilLogout--;
        this.countDownText = this.getHumanReadableTimeLeft(secondsLeftUntilLogout);
        this.countDownTimer = setInterval(() => {
            secondsLeftUntilLogout--;
            if (secondsLeftUntilLogout < 1) {
              clearInterval(this.countDownTimer);
              this.$auth.logoutRedirectingToStartPage('logoutReason=idle');
            } else {
              this.countDownText = this.getHumanReadableTimeLeft(secondsLeftUntilLogout);
            }
        }, 1000);
        window.focus();
      } else if (this.countDownTimer) {
        this.isCountingDown = false;
        clearInterval(this.countDownTimer);
      }
  }

  /** Get time left in minutes in a readable form. [WCAG 4.1.3, update minutes only] */
  public getHumanReadableTimeLeft(secondsTotal: number) {
    const minutes: number = Math.ceil(secondsTotal / 60);
    return minutes.toString() + ' ' + this.$i18n.tc('app.time.minute', minutes);
  }
}
</script>

<style scoped lang="scss"></style>