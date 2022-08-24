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
import I18n from '@/vendor/I18n'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

window.i18n = I18n

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, app, props, plugin }) {
        const vueApp = createApp({ render: () => h(app, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .component('InertiaLink', InertiaLink)
            .component('InertiaHead', InertiaHead)
            .use(PerfectScrollbar)
            .use(Antd)

        vueApp.config.globalProperties.i18n = new I18n
        vueApp.mount(el)
        return vueApp
    },
});

InertiaProgress.init({ color: '#4B5563' });
