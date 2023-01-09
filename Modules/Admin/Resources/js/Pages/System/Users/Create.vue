<template>
    <admin-layout
        :title="$t('users.create')"
    >
        <a-page-header
            :title="$t('users.create')"
            @back="() => this.$inertia.visit(route('admin.system.users.index'))"
        >
        </a-page-header>

        <div class="p-4">
            <a-card>

                <user-form :roles="roles" ref="userForm"/>

                <div class="flex gap-3">
                    <a-button @click="submit" type="primary">{{ $t('create') }}</a-button>
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
        roles: {
            type: Array,
            required: true
        },
    },
    methods: {
        submit () {
            this.$refs['userForm'].form.submit(
                'post',
                route('admin.system.users.store'), {
                    onSuccess: () => this.$message.success('User created successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
