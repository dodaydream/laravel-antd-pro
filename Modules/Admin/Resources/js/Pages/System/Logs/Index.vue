<template>
    <admin-layout>
        <a-page-header
            :title="$t('logs')"
        >
        </a-page-header>

        <div class="container-fluid">
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
                        {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss.SSS') }}
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
                </template>
            </a-table>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import dayjs from "dayjs";

import {PlusOutlined, DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";

import {reactive} from 'vue'

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
        const columns = reactive([
            {title: wTrans('id'), dataIndex: 'id'},
            {title: wTrans('log_name'), dataIndex: 'log_name'},
            {title: wTrans('description'), dataIndex: 'description'},
            {title: wTrans('subject'), dataIndex: 'subject'},
            {title: wTrans('causer'), dataIndex: 'causer'},
            {title: wTrans('triggered_at'), dataIndex: 'created_at'},
        ]);

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
    methods: {}
}
</script>

<style scoped>

</style>
