<template>
    <admin-layout>
        <a-page-header title="Developer Tools">
        </a-page-header>

        <div class="p-6">
            <a-card title="Tools">
                <div class="grid md:grid-cols-4 grid-cols-1 gap-4">
                    <inertia-link v-for="rt in routes" :href="route(rt.route)">
                        <a-button  block size="large">
                            {{ rt.title }}
                        </a-button>
                    </inertia-link>
                </div>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";

export default {
    name: "Index",
    components: {AdminLayout},
    setup() {
        const routes = [
            {
                icon: 'NodeIndexOutlined',
                key: 'admin.developer.routes',
                route: 'admin.developer.routes',
                title: 'Route',
                permission: 'admin.developer.route',
            },
            {
                icon: 'ThunderboltOutlined',
                key: 'admin.developer.misc',
                route: 'admin.developer.misc',
                title: 'Misc',
                permission: 'admin.developer.misc',
            }
        ]
        return { routes }
    },
}
</script>

<style scoped>

</style>
