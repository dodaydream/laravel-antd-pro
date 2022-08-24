import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue'
const path = require('path');

export default defineConfig({
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        },
    },
    resolve: {
        alias: {
            ziggy: './vendor/tightenco/ziggy/dist/vue.es.js',
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
                'Modules/Admin/Resources/js/app.js',
            ],
            refresh: true,
        }),
        vue(),
    ],
});
