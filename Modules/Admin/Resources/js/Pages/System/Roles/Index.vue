<template>
    <admin-layout>
        <a-page-header
            title="Roles"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Roles">
                <template #extra>
                    <inertia-link :href="route('admin.system.roles.create')">
                    <a-button
                        type="primary"
                    >
                        <template #icon>
                            <PlusOutlined/>
                        </template>
                        Add
                    </a-button>
                    </inertia-link>
                </template>

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
                                <a-button type="link" danger @click="table.rowSelection.destroy(bulkDestroyHandler)">
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

                        <template v-if="column.dataIndex === 'email_verified_at'">
                            <a-switch :checked="column.email_verified_at !== null"/>
                        </template>

                        <template v-if="column.dataIndex === 'action'">
                            <div class="flex justify-center w-full">
                                <inertia-link
                                    :href="route('admin.system.roles.show', {
                                        role: record.id
                                    })"
                                >
                                    <a-button type="link">
                                        Edit
                                    </a-button>
                                </inertia-link>

                                <a-popconfirm
                                    title="Are you sure to delete this record?"
                                    ok-text="Yes"
                                    cancel-text="No"
                                    @confirm="destory(record.id)"
                                >
                                    <a-button type="link" danger>
                                        Remove
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

import useTable from '::admin/Utils/useTable';

export default {
    name: "Index",
    components: {
        AdminLayout,
        PlusOutlined,
        DeleteOutlined
    },
    props: {
        roles: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const columns = [
            {title: 'id', dataIndex: 'id'},
            {title: 'name', dataIndex: 'name'},
            {title: 'created_at', dataIndex: 'created_at'},
            {title: 'permissions', dataIndex: 'permissions_count', align: 'right' },
            {title: 'action', dataIndex: 'action', fixed: 'right', align: 'center'}
        ];

        const table = useTable(props.roles, {
            fieldName: 'roles',
            rowKey: 'id',
            selectable: true,
        })

        return {columns, table, dayjs}
    },
    methods: {
        bulkDestroyHandler () {
            this.$inertia.delete(this.route('admin.system.roles.bulk-destroy'), {
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
                    this.$message.success('Role deleted successfully.');
                }
            })
        },
        destory(id) {
            this.$inertia.delete(this.route('admin.system.roles.destroy', {
                role: id
            }), {
                preserveState: false,
                onSuccess: () => {
                    this.$message.success('Role deleted successfully.');
                }
            })
        },
    }
}
</script>

<style scoped>

</style>
