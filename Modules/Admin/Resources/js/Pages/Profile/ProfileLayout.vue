<template>
    <admin-layout no-transition :title="$t('my_profile')">
        <a-page-header :title="$t('my_profile')"></a-page-header>

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
import AdminLayout from "../../Layouts/AdminLayout.vue"
import AvatarCropper from "../../Components/AvatarCropper.vue"
import { reactive } from 'vue'

export default {
    name: "ProfileLayout",
    components: {AdminLayout, AvatarCropper},
    props: {
        activeKey: {
            type: String,
            default: 'index',
        },
    },
    setup(props) {
        const tabList = reactive([
            {
                key: 'admin.profile.index',
                tab: trans('profile'),
            },
            {
                key: 'admin.profile.two-factor-authentication',
                tab: trans('profile.two_factor_auth'),
            },
            {
                key: 'admin.profile.active-sessions',
                tab: trans('profile.active_sessions'),
            }
        ]);

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
