<template>
    <admin-layout
                  :title="$t('users.edit', {name: user.name})"
    >
        <a-page-header
            :title="$t('users.edit', {name: user.name})"
            @back="() => this.$inertia.visit(route('admin.system.users.index'))"
        >
        </a-page-header>

        <div class="p-4">
            <a-card>
                <user-form :roles="roles" :data="user" ref="userForm"/>

                <div class="flex gap-3">
                    <a-button @click="submit">{{ $t('save') }}</a-button>
                </div>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import UserForm from './UserForm.vue';

export default {
    name: "Show",
    components: {
        AdminLayout,
        UserForm
    },
    props: {
        user: {
            type: Object,
            required: true
        },
        roles: {
            type: Array,
            required: true
        },
    },
    methods: {
        submit () {
            this.$refs['userForm'].form.submit(
                'put',
                route('admin.system.users.update', {
                    user: this.user.id
                }), {
                    onSuccess: () => this.$message.success('User updated successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
