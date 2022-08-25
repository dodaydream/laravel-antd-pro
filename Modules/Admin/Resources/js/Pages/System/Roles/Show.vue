<template>
    <admin-layout>
        <a-page-header
            :title="`Edit Role: ${role.name}`"
            @back="() => this.$inertia.visit(route('admin.system.roles.index'))"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Edit Role">
                <a-form layout="vertical" class="max-w-xl">
                    <a-form-item label="Name" name="name" v-bind="form.validation.name">
                        <a-input v-model:value="form.name" />
                    </a-form-item>

                    <a-form-item label="Permissions" name="permissions" v-bind="form.validation.permissions">
                        <a-tree
                            checkable
                            defaultExpandAll
                            checkStrictly
                            autoExpandParent
                            :selectable=false
                            :tree-data="permissionTree"
                            v-model:checked-keys="form.permissions"
                        >
                            <template #title="{ title, module, checkable }">
                                <span class="mr-1">{{ $t(`permissions.${title}`) }}</span>
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
        role: {
            type: Object,
            required: true
        },
        permissions: {
            type: Array,
            required: true
        },
        rolePermissions: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        const permissionTree = []

        props.permissions.sort(
            (a, b) => a.name.localeCompare(b.name)
        )
            .forEach(permission => {
                const permissionLevel = permission.name.split('.').length;

                let ref = permissionTree;

                console.log('handling permission', permission.name);

                let key = [];
                for (let i = 0; i < permissionLevel; ++i) {
                    key.push(permission.name.split('.')[i])

                    const strKey = key.join('.');
                    console.debug('permission', strKey)
                    const nextRef = ref.find(
                        item => item.title === strKey
                    );

                    console.debug('currRef', ref)
                    console.debug('nextref', nextRef);

                    if (nextRef === undefined) {
                        console.debug('permission not found')
                        const perm = {
                            title: strKey,
                            key: permission.name === strKey ? permission.id : null,
                            checkable: permission.name === strKey,
                            module: permission.module,
                            children: []
                        }
                        ref.push(perm);

                        // update reference
                        ref = perm.children
                    } else {
                        console.debug('permission found')
                        ref = nextRef.children;
                    }

                    console.debug('endRef', ref)
                }
        })

        const form = useForm({
            name: props.role.name,
            permissions: props.rolePermissions
        })

        return {dayjs, permissionTree, form }
    },
    methods: {
        submit () {
            this.form.transform((data) => {
                return {
                    ...data,
                    permissions: data.permissions.checked
                }
            }).
            submit(
                'put',
                route('admin.system.roles.update', {
                    role: this.role.id
                }), {
                    onSuccess: () => this.$message.success('Role updated successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
