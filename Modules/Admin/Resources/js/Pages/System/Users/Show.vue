<template>
    <admin-layout>
        <a-page-header
            :title="`Edit User: ${user.name}`"
            class="!bg-white"
            @back="() => this.$inertia.visit(route('admin.system.users.index'))"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Edit User">
                <a-form layout="vertical" class="max-w-xl">
                    <a-form-item label="Avatar" name="avatar">
                        <avatar-cropper :user="user" />
                    </a-form-item>

                    <a-form-item label="Name" name="name" v-bind="form.validation.name">
                        <a-input v-model:value="form.name" />
                    </a-form-item>

                    <a-form-item label="Email" name="email" v-bind="form.validation.email">
                        <a-input v-model:value="form.email" type="email" />
                    </a-form-item>

                    <a-form-item label="Password" name="password" v-bind="form.validation.password">
                        <a-input-password v-model:value="form.password" />
                    </a-form-item>

                    <a-form-item label="Password Confirmation" name="password_confirmation" v-bind="form.validation.password_confirmation">
                        <a-input-password v-model:value="form.password_confirmation" />
                    </a-form-item>

                    <a-form-item label="Roles" name="roles" v-bind="form.validation.roles">
                        <a-transfer
                            v-model:target-keys="form.roles"
                            :data-source="allRoles"
                            :render="item => item.title"
                        />
                    </a-form-item>

                    <a-form-item>
                        <div class="flex gap-3">
                            <a-button @click="submit">Save</a-button>
                        </div>
                    </a-form-item>
                </a-form>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import dayjs from "dayjs";

import {PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons-vue";

import useForm from '::admin/Utils/useForm';

import AvatarCropper from '::admin/Components/AvatarCropper.vue';

export default {
    name: "Show",
    components: {
        AdminLayout,
        PlusOutlined,
        LoadingOutlined,
        DeleteOutlined,
        AvatarCropper
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
    setup(props) {
        const form = useForm({
            name: props.user.name,
            email: props.user.email,
            roles: props.user.roles,
            password: '',
            password_confirmation: ''
        })

        const allRoles = props.roles.map(role => {
            return {
                key: role.id,
                title: role.name,
                description: role.description,
                disabled: false
            }
        })

        return {dayjs, form, allRoles}
    },
    methods: {
        submit () {
            this.form.submit(
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
