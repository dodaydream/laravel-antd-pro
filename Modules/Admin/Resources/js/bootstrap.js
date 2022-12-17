import _ from 'lodash';
window._ = _;

/**
 * We'll load the axios HTTP library which allows us to easily issue requests
 * to our Laravel back-end. This library automatically handles sending the
 * CSRF token as a header based on the value of the "XSRF" token cookie.
 */

import axios from 'axios';
import login from '::admin/Utils/Login.jsx';
import { Inertia } from '@inertiajs/inertia'

axios.defaults.withCredentials = true
const refreshCsrfOnExpired = async (err) => {
    const status = err.response.status

    console.debug('hit interceptor', status)

    if (status === 401) {
        console.debug('prompt user login')

        login().then(() => {
            return axios(err.config)
        }).catch(() => {
            Inertia.visit(route('admin.login'))
        })
    } else if (status === 419) {
        console.debug('auto refresh csrf token')
        await axios.get('/csrf-token')
        return axios(err.config)
    }
    return Promise.reject(err)
}

axios.interceptors.response.use(response => response, refreshCsrfOnExpired)
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';


/**
 * Echo exposes an expressive API for subscribing to channels and listening
 * for events that are broadcast by Laravel. Echo and event broadcasting
 * allows your team to easily build robust real-time web applications.
 */

// import Echo from 'laravel-echo';

// import Pusher from 'pusher-js';
// window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: import.meta.env.VITE_PUSHER_APP_KEY,
//     wsHost: import.meta.env.VITE_PUSHER_HOST ?? `ws-${import.meta.env.VITE_PUSHER_APP_CLUSTER}.pusher.com`,
//     wsPort: import.meta.env.VITE_PUSHER_PORT ?? 80,
//     wssPort: import.meta.env.VITE_PUSHER_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });
