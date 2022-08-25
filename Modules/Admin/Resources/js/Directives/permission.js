import { usePage } from '@inertiajs/inertia-vue3';

function checkPermission(el, binding) {
    const { value } = binding
    const permissions = usePage().props.value.permissions

    if (!permissions.includes(value)) {
        el.parentNode && el.parentNode.removeChild(el)
    }
}

export default {
    created (el, binding) {
        checkPermission(el, binding)
    },
    beforeUpdate (el, binding) {
        checkPermission(el, binding)
    }
}
