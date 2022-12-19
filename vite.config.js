import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
const path = require('path');

export default defineConfig(({ mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};

    return {
        server: {
            host: '0.0.0.0',
            hmr: {
                host: 'localhost',
            },
        },
        resolve: {
            alias: {
                ziggy: path.resolve(__dirname, './node_modules/ziggy-js/dist/vue.es.js'),
                '@': path.resolve(__dirname, './resources/js/'),
                '::admin': path.resolve(__dirname, './Modules/Admin/Resources/js/')
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                }
            }
        },
        plugins: [
            laravel({
                input: [
                    'resources/css/app.css',
                    'resources/js/app.js',
                    'Modules/Admin/Resources/js/app.js'
                ],
                refresh: true,
            }),
            vue(),
            vueJsx(),
        ],
    }
});
