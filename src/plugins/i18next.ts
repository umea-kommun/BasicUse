import Vue from 'vue';
import VueI18n, { LocaleMessages } from 'vue-i18n';

/**
 * Translation plugin using VueI18n https://kazupon.github.io/vue-i18n
 */

Vue.use(VueI18n);

function loadLocaleMessages(): LocaleMessages {
  const locales = require.context('./../locales', true, /[a-z0-9]+\.json$/i);
  const messages: LocaleMessages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z0-9]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
  messages: loadLocaleMessages(),
  silentTranslationWarn: true
});
