<template>
    <admin-layout>
        <a-page-header
            title="Logs"
            class="!bg-white"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Logs">
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
                    <template #expandedRowRender="{ record }">
                        <div class="grid grid-cols-2" v-if="record.properties.attributes || record.properties.old">
                            <div>
                                <a-tag class="!mb-3">Old</a-tag>
                                <pre>{{ record.properties.old }}</pre>
                            </div>
                            <div>
                                <a-tag class="!mb-3">Attributes</a-tag>
                                <pre>{{ record.properties.attributes }}</pre>
                            </div>
                        </div>
                        <div v-else>
                            <a-tag class="!mb-3">Properties</a-tag>
                            <pre>{{ record.properties }}</pre>
                        </div>
                    </template>

                    <template #bodyCell="{ record, column, text }">
                        <template v-if="['created_at', 'updated_at'].includes(column.dataIndex)">
                            {{ dayjs(column.created_at).format('YYYY-MM-DD HH:mm:ss.SSS') }}
                        </template>

                        <template v-if="column.dataIndex === 'subject'">
                            <a-tag>{{ record.subject_type }}:{{ record.subject_id }}</a-tag>
                        </template>

                        <template v-if="column.dataIndex === 'causer'">
                            <a-tag>{{ record.causer_type }}:{{ record.causer_id }}</a-tag>
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
        logs: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const columns = [
            {title: 'id', dataIndex: 'id'},
            {title: 'log_name', dataIndex: 'log_name'},
            {title: 'description', dataIndex: 'description'},
            {title: 'subject', dataIndex: 'subject'},
            {title: 'causer', dataIndex: 'causer'},
            {title: 'triggered_at', dataIndex: 'created_at'}
        ];

        const table = useTable(props.logs, {
            fieldName: 'logs',
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
