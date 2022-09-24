import { usePage } from '@inertiajs/inertia-vue3';

const hasPermission = (permission) => {
    const permissions = usePage().props.value.currentUserPermissions
    return permissions.includes(permission)
}

function checkPermission(el, binding) {
    const { value } = binding
    if (!hasPermission(value)) {
        el.parentNode && el.parentNode.removeChild(el)
    }
}

const directive = {
    created (el, binding) {
        checkPermission(el, binding)
    },
    beforeUpdate (el, binding) {
        checkPermission(el, binding)
    }
}

export default {
    install (app, options) {
        app.directive('can', directive)
        app.config.globalProperties.$can = hasPermission
    }
}
