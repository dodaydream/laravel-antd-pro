<template>
    <admin-layout>

        <a-page-header
            title="Users"
        >
            <template #extra>
                <a-button
                    type="primary"
                >
                    <template #icon>
                        <PlusOutlined/>
                    </template>
                    Add
                </a-button>
            </template>
        </a-page-header>

        <div class="p-4">
            <a-card>
                <a-alert v-if="table.rowSelection.selected" class="!mb-4">
                    <template #message>
                        <div class="flex justify-between items-center">
                            <div>
                                <span>{{ table.rowSelection.count }} items selected</span>&nbsp;
                                <a @click="table.rowSelection.clear">
                                    Clear Selection
                                </a>
                            </div>
                            <span class="gap-3 flex">
                                <a-button type="link" danger @click="bulkDestroy"
                                          v-can="'admin.system.users.bulk-delete'"
                                >
                                    Remove
                                </a-button>
                            </span>
                        </div>
                    </template>
                </a-alert>

                <a-table
                    :columns="columns"
                    v-bind="table"
                >
                    <template #bodyCell="{ record, column, text }">
                        <template v-if="['created_at', 'updated_at'].includes(column.dataIndex)">
                            {{ dayjs(column.created_at).format('YYYY-MM-DD HH:mm') }}
                        </template>

                        <template v-if="column.dataIndex === 'roles'">
                            <a-tag v-for="role in record.roles">{{ role.name }}</a-tag>
                        </template>

                        <template v-if="column.dataIndex === 'email_verified_at'">
                            <a-tag color="success"
                                   v-if="column.email_verified_at !== null"
                            >
                                Verified
                            </a-tag>
                        </template>

                        <template v-if="column.dataIndex === 'action'">
                            <div class="flex gap-2 justify-center">
                                <inertia-link
                                    :href="route('admin.system.users.show', { id: record.id })"
                                    v-can="'admin.system.users.edit'"
                                >
                                    <a-button type="link">
                                        {{ $t('action.edit')}}
                                    </a-button>
                                </inertia-link>

                                    <a-popconfirm
                                        title="Are you sure to delete this record?"
                                        ok-text="Yes"
                                        cancel-text="No"
                                        @confirm="destroy(record.id)"
                                    >
                                        <a-button type="link" danger
                                                  v-can="'admin.system.users.delete'"
                                        >
                                            {{ $t('action.remove')}}
                                        </a-button>
                                    </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import dayjs from "dayjs";

import {PlusOutlined, DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";

import {createVNode} from "vue";
import useTable from '::admin/Utils/useTable';
import {Modal} from "ant-design-vue";
import { trans } from 'laravel-vue-i18n';

export default {
    name: "Index",
    components: {
        AdminLayout,
        PlusOutlined,
        DeleteOutlined,
        ExclamationCircleOutlined
    },
    props: {
        users: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const columns = [
            {title: trans('id'), dataIndex: 'id'},
            {title: trans('name'), dataIndex: 'name'},
            {title: 'email', dataIndex: 'email'},
            {title: trans('email_verified'), dataIndex: 'email_verified_at', align: 'right'},
            {title: trans('roles'), dataIndex: 'roles', align: 'right'},
            {title: trans('created_at'), dataIndex: 'created_at'},
            {title: trans('updated_at'), dataIndex: 'updated_at'},
            {title: trans('action'), dataIndex: 'action', fixed: 'right', align: 'center'}
        ];

        const table = useTable(props.users, {
            fieldName: 'users',
            rowKey: 'id',
            selectable: true,
        });

        return {columns, table, dayjs}
    },
    methods: {
        destroy(id) {
            this.$inertia.delete(this.route('admin.system.users.destroy', {
                user: id
            }), {
                preserveState: false,
                onSuccess: (page) => {
                    console.log(page)
                    if (page.props.message) {
                        this.$message.warning(page.props.message);
                        return
                    }
                    this.$message.success('User deleted successfully.');
                }
            })
        },
        bulkDestroy() {
            Modal.confirm({
                title: 'Are you sure to delete these records?',
                icon: createVNode(ExclamationCircleOutlined),
                content: 'You will not be able to recover these records!',
                okText: 'Yes',
                cancelText: 'No',
                onOk: () => {
                    this.$inertia.delete(this.route('admin.system.users.bulk-destroy'), {
                        data: {
                            ids: this.table.rowSelection.selectedRowKeys
                        },
                        preserveState: false,
                        onSuccess: (page) => {
                            this.table.rowSelection.clear();
                            if (page.props.message) {
                                this.$message.warning(page.props.message);
                                return
                            }
                            this.$message.success('Users deleted successfully.');
                        }
                    })
                }
            });
        }
    }
}
</script>

<style scoped>

</style>
