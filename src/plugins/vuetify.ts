import Vue from 'vue';
import Vuetify from 'vuetify';
import '@/themes/theme.styl'; // Import of theme for Umeå kommun

/**
 * Plugin for Vuetify. Set theme colors for Umeå kommun.
 */

Vue.use(Vuetify, {
  theme: {
    primary: '#006e1e', // Björk, darker version, Umeå kommy. Darker version is used to achieve enough contrast for WCAG
    secondary: '#00a01e', // Björk, lighter version, Umeå kommun
    accent: '#e4b1c2', // Rosa, Umeå kommun
    error: '#EF5350', // Red
    info: '#424242', // Grey-darken-3 from Material design
    success: '#006e1e', // Green
    warning: '#FFC107' // Orange
  }
});
