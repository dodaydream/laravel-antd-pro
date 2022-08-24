<template>
    <admin-layout no-transition>
        <a-page-header title="My Profile"></a-page-header>

        <div class="p-4">
            <a-card
                :tab-list="tabList"
                :active-tab-key="route().current()"
                @tabChange="key => this.$inertia.visit(route(key))"
            >
                <slot></slot>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../Layouts/AdminLayout.vue";
import AvatarCropper from "../../Components/AvatarCropper.vue";

export default {
    name: "ProfileLayout",
    components: {AdminLayout, AvatarCropper},
    props: {
        user: {
            type: Object,
            required: true,
        },
        activeKey: {
            type: String,
            default: 'index',
        },
    },
    setup(props) {
        const tabList = [
            {
                key: 'admin.profile.index',
                tab: 'Profile',
            },
            {
                key: 'admin.profile.two-factor-authentication',
                tab: 'Two Factor Authentication',
            },
            {
                key: 'admin.profile.active-sessions',
                tab: 'Active Sessions',
            }
        ];

        return { tabList }
    },
    methods: {
        submit() {
            this.form.submit(
                'put',
                route('admin.system.users.update', {
                    user: this.user.id
                }), {
                    onSuccess: () => this.$message.success('Profile updated successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
