<template>
    <admin-layout>
        <a-page-header
            :title="$t('logs')"
        >
        </a-page-header>

        <div class="p-4">
            <a-card :title="$t('logs')">
<!--                <a-alert v-if="table.rowSelection.selected" class="!mb-4">-->
<!--                    <template #message>-->
<!--                        <div class="flex justify-between items-center">-->
<!--                            <div>-->
<!--                                <span>{{ table.rowSelection.count }} items selected</span>&nbsp;-->
<!--                                <a @click="table.rowSelection.clear">-->
<!--                                    Clear Selection-->
<!--                                </a>-->
<!--                            </div>-->
<!--                            <span class="gap-3 flex">-->
<!--                                <a-button type="link" danger @click="table.rowSelection.destroy(bulkDestroyHandler)">-->
<!--                                    Remove-->
<!--                                </a-button>-->
<!--                            </span>-->
<!--                        </div>-->
<!--                    </template>-->
<!--                </a-alert>-->

                <a-table
                    :columns="columns"
                    v-bind="table"
                >
                    <template #expandedRowRender="{ record }">
                        <div class="grid grid-cols-2" v-if="record.properties.attributes || record.properties.old">
                            <div>
                                <a-tag class="!mb-3">{{ $t('log.old') }}</a-tag>
                                <pre>{{ record.properties.old }}</pre>
                            </div>
                            <div>
                                <a-tag class="!mb-3">{{ $t('log.attributes') }}</a-tag>
                                <pre>{{ record.properties.attributes }}</pre>
                            </div>
                        </div>
                        <div v-else>
                            <a-tag class="!mb-3">{{ $t('log.properties') }}</a-tag>
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

                        <template v-if="column.dataIndex === 'description'">
                            <a-tag :color="colorMap[record.description]">{{ record.description }}</a-tag>
                        </template>

                        <template v-if="column.dataIndex === 'action'">
                            <div class="flex justify-center w-full">
                                <a-popconfirm
                                    title="Are you sure to delete this record?"
                                    ok-text="Yes"
                                    cancel-text="No"
                                    @confirm="destory(record.id)"
                                >
                                    <a-button type="link" danger>
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
            {title: trans('id'), dataIndex: 'id'},
            {title: trans('log_name'), dataIndex: 'log_name'},
            {title: trans('description'), dataIndex: 'description'},
            {title: trans('subject'), dataIndex: 'subject'},
            {title: trans('causer'), dataIndex: 'causer'},
            {title: trans('triggered_at'), dataIndex: 'created_at'},
            // {title: 'action', dataIndex: 'action', fixed: 'right', align: 'center'}
        ];

        const colorMap = {
            updated: 'blue',
            created: 'green',
            deleted: 'red',
            restored: 'green',
            'update.permission': 'blue',
        };

        const table = useTable(props.logs, {
            fieldName: 'logs',
            rowKey: 'id',
            selectable: false,
        })

        return {columns, table, dayjs, colorMap}
    },
    methods: {
        bulkDestroyHandler () {
            this.$inertia.delete(this.route('admin.system.logs.bulk-destroy'), {
                data: {
                    logs: this.table.rowSelection.selectedRowKeys
                },
                preserveState: false,
                onSuccess: (page) => {
                    this.table.rowSelection.clear();
                    if (page.props.message) {
                        this.$message.warning(page.props.message);
                        return
                    }
                    this.$message.success('Logs deleted successfully.');
                }
            })
        },
        destory(id) {
            this.$inertia.delete(this.route('admin.system.logs.destroy', {
                log: id
            }), {
                preserveState: false,
                onSuccess: () => {
                    this.$message.success('Logs deleted successfully.');
                }
            })
        },
    }
}
</script>

<style scoped>

</style>
