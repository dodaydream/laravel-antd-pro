import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';
import { createInertiaApp, InertiaLink, InertiaHead } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from 'ziggy';
import Antd from 'ant-design-vue';
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'ant-design-vue/dist/antd.css';
import { i18nVue, trans } from 'laravel-vue-i18n'
import permission from './Directives/permission.js';
import VueApexCharts from "vue3-apexcharts";

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, app, props, plugin }) {
        const vueApp = createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(VueApexCharts)
            .use(i18nVue, {
                resolve: async (lang) => {
                    const langs = import.meta.glob('../lang/*.json');
                    return await langs[`../lang/${lang}.json`]();
                }
            })
            .directive('can', permission)
            .component('InertiaLink', InertiaLink)
            .component('InertiaHead', InertiaHead)
            .use(PerfectScrollbar)
            .use(Antd)

        vueApp.mount(el)
        return vueApp
    },
});

window.trans = trans

InertiaProgress.init({ color: '#1890ff' });
