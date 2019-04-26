import Vue from 'vue';
import Router from 'vue-router';
import './router-hooks';
import { authMiddleware } from '@/plugins/auth';
import AppStart from '@/components/app/AppStart.vue';
import AppForm from '@/components/app/AppForm.vue';
import AppFormConfirmation from '@/components/app/AppFormConfirmation.vue';
import AppPrintForm from '@/components/app/AppPrintForm.vue';
import AdminListForms from '@/components/admin/AdminListForms.vue';
import AdminForm from '@/components/admin/AdminForm.vue';
import AuthCallback from '@/components/auth/AuthCallback.vue';

Vue.use(Router);

/**
 * Router
 * meta configures how the breadcrumb will show up.
 */
const router = new Router({
    mode: 'history',
    routes: [
        {
            component: AppStart,
            name: 'AppStart',
            path: '/',
            meta: {
              breadcrumb: routeParams => [
                { name: 'AppStart', to: `/`},
              ]
            },
        },
        {
            component: AdminListForms,
            name: 'AdminListForms',
            path: '/admin',
            meta: {
              contentSize: 'Wide',
              authScope: process.env.VUE_APP_AUTH_SCOPE_ADMIN,
              breadcrumb: routeParams => [
                { name: 'AdminListForms', to: `/admin`},
              ]
            },
        },
        {
            component: AdminForm,
            name: 'AdminForm',
            path: '/admin/:formId',
            props: true,
            meta: {
              contentSize: 'Wide',
              authScope: process.env.VUE_APP_AUTH_SCOPE_ADMIN,
              breadcrumb: routeParams => [
                { name: 'AdminListForms', to: `/admin`},
                { name: 'AdminForm', to: `/admin/${routeParams.formId}`},
              ]
            },
        },
        {
            component: AuthCallback,
            name: 'AuthCallback',
            path: '/oauthCallback',
            props: true,
            meta: {
              breadcrumb: routeParams => [
              ]
            },
        },
        {
            component: AppForm,
            name: 'AppFormPreview',
            path: '/granska/:previewFormId/:stepId?',
            props: true,
            meta: {
              authScope: process.env.VUE_APP_AUTH_SCOPE_ADMIN,
              breadcrumb: routeParams => [
                { name: 'AppStart', to: '/'},
                { name: 'AppForm', to: `/granska/${routeParams.previewFormId}`}
              ]
            },
        },
        {
            component: AppForm,
            name: 'AppFormTest',
            path: '/testa/:testFormId/:stepId?',
            props: true,
            meta: {
              breadcrumb: routeParams => [
                { name: 'AppStart', to: '/'},
                { name: 'AppForm', to: `/testa/${routeParams.testFormId}`}
              ]
            },
        },
        {
            component: AppFormConfirmation,
            name: 'AppFormConfirmation',
            path: '/skickat/',
            props: true,
            meta: {
              breadcrumb: routeParams => [
                { name: 'AppStart', to: '/'},
                { name: 'AppFormConfirmation', to: `/skickat/`}
              ]
            },
        },
        {
          // Notice! This route must come before AppForm due to path configuration
          component: AppPrintForm,
          name: 'AppPrintForm',
          path: '/blankett/:formPath',
          props: true,
          meta: {
          }
        },
        {
            component: AppForm,
            name: 'AppForm',
            path: '/:formPath/:stepId?',
            props: true,
            meta: {
              breadcrumb: routeParams => [
                { name: 'AppStart', to: '/'},
                { name: 'AppForm', to: `/${routeParams.formPath}/1`}
              ]
            },
        }
    ],
});

// Setup middleware that checks if currently logged in user
// has access to declared scopes
authMiddleware(router);

export default router;
