<template>
  <div class="auth-callback">
    <app-loading-spinner :isVisible="true"></app-loading-spinner>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AppLoadingSpinner from '@/components/app/AppLoadingSpinner.vue';

/**
 * Route redirecting user back to where she came from before logging in via the SSO-service
 */
@Component({
  components: {
    AppLoadingSpinner
  }
})
export default class AuthCallback extends Vue {
    public async mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      const state = urlParams.get('state') || '';
      const code = urlParams.get('code') || '';
      const afterLoginPath = await this.$auth.handleLoginCallbackAsync(state, code);
      this.$router.push({path: afterLoginPath});
    }
}
</script>
