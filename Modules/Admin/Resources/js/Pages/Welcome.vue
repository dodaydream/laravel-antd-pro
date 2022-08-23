<template>
    <AdminLayout>
        <a-page-header
            class="!bg-white"
            title="Hello Admin!"
            sub-title="Welcome to laravel-antd-pro"
        >
        </a-page-header>
    </AdminLayout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";

export default {
    name: "Welcome",
    components: {AdminLayout}
}
</script>

<style scoped>

</style>
