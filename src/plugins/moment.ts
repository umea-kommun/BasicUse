import Vue from 'vue';
import VueMoment from 'vue-moment';
import moment from 'moment';
import 'moment/locale/sv';

moment.locale(process.env.VUE_APP_I18N_LOCALE);
Vue.use(VueMoment, { moment });
