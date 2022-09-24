<template>
    <admin-layout>
        <a-page-header
            :title="$t('users')"
        >
            <template #extra>
                <inertia-link :href="route('admin.system.users.create')">
                    <a-button
                        type="primary"
                        v-can="'admin.system.users.create'"
                    >
                        <template #icon>
                            <PlusOutlined/>
                        </template>
                        {{ $t('add') }}
                    </a-button>
                </inertia-link>
            </template>
        </a-page-header>

        <div class="p-4">
            <crud-table
                :table="table"
                class="whitespace-nowrap"
                resource="admin.system.users"
                :editHandler="(record) => {
                    this.$inertia.visit(route(`admin.system.users.show`, record.id));
                }"
                @delete="(record) => destroy(record.id)"
            >
                <template #bodyCell="{ record, column }">
                    <template v-if="column.dataIndex === 'user'">
                        <div class="font-medium">{{ record.name }}</div>
                        <div class="text-slate-500">{{ record.email }}</div>
                    </template>
                    <template v-if="['created_at', 'updated_at'].includes(column.dataIndex)">
                        {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm') }}
                    </template>

                    <template v-if="column.dataIndex === 'roles'">
                        <a-tag v-for="role in record.roles">{{ role.name }}</a-tag>
                    </template>

                    <template v-if="column.dataIndex === 'email_verified_at'">
                        <a-tag color="success"
                               v-if="record.email_verified_at !== null"
                        >
                            Verified
                        </a-tag>
                    </template>
                </template>
            </crud-table>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import dayjs from "dayjs";

import {PlusOutlined, DeleteOutlined, ExclamationCircleOutlined} from "@ant-design/icons-vue";

import {createVNode, reactive} from "vue";
import useTable from '::admin/Utils/useTable';
import CrudTable from '::admin/Components/CrudTable.vue';
import {Modal} from "ant-design-vue";

export default {
    name: "Index",
    components: {
        AdminLayout,
        PlusOutlined,
        DeleteOutlined,
        ExclamationCircleOutlined,
        CrudTable
    },
    props: {
        users: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const columns = reactive([
            {title: trans('id'), dataIndex: 'id'},
            {title: trans('user'), dataIndex: 'user', width: '100%'},
            {title: trans('roles'), dataIndex: 'roles', align: 'left'},
            {title: trans('email_verified'), dataIndex: 'email_verified_at', align: 'right'},
            {title: trans('created_at'), dataIndex: 'created_at'},
            {title: trans('updated_at'), dataIndex: 'updated_at'},
            {title: trans('action'), dataIndex: 'action', fixed: 'right', align: 'center'}
        ]);

        const table = useTable(props.users, {
            fieldName: 'users',
            rowKey: 'id',
            selectable: true,
            columns: columns
        });

        return {columns, table, dayjs}
    },
    methods: {}
}
</script>

<style scoped>

</style>
