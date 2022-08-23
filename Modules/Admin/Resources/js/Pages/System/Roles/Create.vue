<template>
    <admin-layout>
        <a-page-header
            title="Create Role"
            class="!bg-white"
            @back="() => this.$inertia.visit(route('admin.system.roles.index'))"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Create Role">
                <a-form layout="vertical" class="max-w-xl">
                    <a-form-item label="Name" name="name" v-bind="form.validation.name">
                        <a-input v-model:value="form.name" />
                    </a-form-item>

                    <a-form-item label="Permissions" name="permissions" v-bind="form.validation.permissions">
                        <a-tree
                            checkable
                            :tree-data="permissionTree"
                            v-model:checked-keys="form.permissions"
                        >
                            <template #title="{ title, module }">
                                <a-tag type="primary" v-if="module">{{ module }}</a-tag>
                                <span>{{ title }}</span>
                            </template>
                        </a-tree>
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

import {PlusOutlined, DeleteOutlined} from "@ant-design/icons-vue";

import useTable from '::admin/Utils/useTable';
import useForm from '::admin/Utils/useForm';

export default {
    name: "Show",
    components: {
        AdminLayout,
        PlusOutlined,
        DeleteOutlined
    },
    props: {
        permissions: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const permissionTree = props.permissions.map(permission => {
            return {
                title: permission.name,
                key: permission.id,
                module: permission.module
            }
        })

        const form = useForm({
            name: '',
            permissions: []
        })

        return {dayjs, permissionTree, form}
    },
    methods: {
        submit () {
            this.form.submit(
                'post',
                route('admin.system.roles.store'), {
                    onSuccess: () => this.$message.success('Role created successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
