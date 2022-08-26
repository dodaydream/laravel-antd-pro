<template>
    <admin-layout>
        <a-page-header
            :title="$t('roles')"
        >
        </a-page-header>

        <div class="p-4">
            <a-card :title="$t('roles')">
                <template #extra>
                    <inertia-link :href="route('admin.system.roles.create')">
                    <a-button
                        type="primary"
                        v-can="'admin.system.roles.create'"
                    >
                        <template #icon>
                            <PlusOutlined/>
                        </template>
                        {{ $t('add') }}
                    </a-button>
                    </inertia-link>
                </template>

                <a-alert v-if="table.rowSelection.selected" class="!mb-4">
                    <template #message>
                        <div class="flex justify-between items-center">
                            <div>
                                <span>{{ $t('items_selected', {count: table.rowSelection.count}) }}</span>&nbsp;
                                <a @click="table.rowSelection.clear">
                                    {{ $t('clear_selection') }}
                                </a>
                            </div>
                            <span class="gap-3 flex">
                                <a-button type="link"
                                          v-can="'admin.system.roles.bulk-delete'"
                                          danger
                                          @click="table.rowSelection.destroy(bulkDestroyHandler)"
                                >
                                        {{ $t('action.remove')}}
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
                                    v-can="'admin.system.roles.edit'"
                                >
                                    <a-button type="link">
                                        {{ $t('action.edit')}}
                                    </a-button>
                                </inertia-link>

                                <a-popconfirm
                                    title="Are you sure to delete this record?"
                                    ok-text="Yes"
                                    cancel-text="No"
                                    @confirm="destory(record.id)"
                                >
                                    <a-button type="link" danger
                                              v-can="'admin.system.roles.delete'"
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

import useTable from '::admin/Utils/useTable';

import { trans } from 'laravel-vue-i18n'

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
            {title: trans('id'), dataIndex: 'id'},
            {title: trans('name'), dataIndex: 'name'},
            {title: trans('created_at'), dataIndex: 'created_at'},
            {title: trans('permissions'), dataIndex: 'permissions_count', align: 'right' },
            {title: trans('action'), dataIndex: 'action', fixed: 'right', align: 'center'}
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
