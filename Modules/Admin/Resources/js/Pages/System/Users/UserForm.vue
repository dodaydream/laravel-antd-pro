<template>
    <a-form layout="vertical" class="max-w-xl">
        <a-form-item :label="$t('name')" name="name" v-bind="form.validation.name">
            <a-input v-model:value="form.name" />
        </a-form-item>

        <a-form-item label="Email" name="email" v-bind="form.validation.email">
            <a-input v-model:value="form.email" type="email" />
        </a-form-item>

        <a-form-item :label="$t('password')" name="password" v-bind="form.validation.password">
            <a-input-password v-model:value="form.password" />
        </a-form-item>

        <a-form-item :label="$t('password_confirmation')" name="password_confirmation" v-bind="form.validation.password_confirmation">
            <a-input-password v-model:value="form.password_confirmation" />
        </a-form-item>

        <a-form-item :label="$t('roles')" name="roles" v-bind="form.validation.roles">
            <a-transfer
                v-model:target-keys="form.roles"
                :data-source="allRoles"
                :render="item => item.title"
            />
        </a-form-item>


    </a-form>
</template>

<script>
import {PlusOutlined, DeleteOutlined, LoadingOutlined } from "@ant-design/icons-vue";

import useForm from '::admin/Utils/useForm';
import AvatarCropper from '::admin/Components/AvatarCropper.vue';

export default {
    components: {
        PlusOutlined,
        LoadingOutlined,
        DeleteOutlined,
        AvatarCropper
    },
    props: {
        roles: {
            type: Array,
            required: true
        },
        data: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    setup (props) {
        const form = useForm({
            name: props.data.name ?? '',
            email: props.data.email ?? '',
            roles: props.data.roles ?? [],
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

        return { form, allRoles }
    }
}
</script>

<style scoped>

</style>
