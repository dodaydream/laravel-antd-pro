import './bootstrap';
import '../css/app.css';

import {createApp, h} from 'vue';
import {createInertiaApp, InertiaLink, InertiaHead} from '@inertiajs/inertia-vue3';
import {InertiaProgress} from '@inertiajs/progress';
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers';
import {ZiggyVue} from 'ziggy';
import Antd from 'ant-design-vue';
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'ant-design-vue/dist/antd.css';
import {i18nVue, trans} from 'laravel-vue-i18n'
import permission from './Directives/permission.js';
import VueApexCharts from "vue3-apexcharts";
import { useDark } from '@vueuse/core'
import darkTheme from 'ant-design-vue/dist/antd.dark.css?raw'
import { useThemeStore } from './Store/theme.js'
import { createPinia } from 'pinia'
import { watch } from 'vue'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({el, app, props, plugin}) {
        const vueApp = createApp({
            setup() {
                const handleTheme = (val) => {
                    if (val) {
                        if (!document.getElementById('dark-theme')) {
                            const style = document.createElement('style');
                            style.id = 'dark-theme';
                            style.innerHTML = darkTheme;
                            document.head.appendChild(style);
                        }
                    } else {
                        if (document.getElementById('dark-theme')) {
                            document.head.removeChild(document.getElementById('dark-theme'))
                        }
                    }
                }

                const themeStore = useThemeStore()
                handleTheme(themeStore.isDark.value)
                watch(themeStore.isDark, handleTheme)
            },

            render: () => h(app, props)
        })
            .use(plugin)
            .use(createPinia())
            .use(ZiggyVue, Ziggy)
            .use(VueApexCharts)
            .use(i18nVue, {
                resolve: async (lang) => {
                    const langs = import.meta.glob('../lang/*.json');
                    return await langs[`../lang/${lang}.json`]();
                }
            })
            .use(permission)
            .component('InertiaLink', InertiaLink)
            .component('InertiaHead', InertiaHead)
            .use(PerfectScrollbar)
            .use(Antd)


        vueApp.mount(el)
        return vueApp
    },
});

window.trans = trans

InertiaProgress.init({color: '#1890ff'});
