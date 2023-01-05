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

        <div class="container-fluid">
            <div class="grid md:grid-cols-3 gap-3 grid-cols-1 max-w-4xl md:gap-6">
                <a-input-search v-model:value="table.filtered.email"
                         :placeholder="$t('email_address')"
                         class="!shadow-md"
                         @search="table.applyFilter"
                         allowClear
                />

                <a-range-picker v-model:value="table.filtered.created_at"
                                valueFormat="YYYY-MM-DD"
                                allowClear
                                class="!shadow-md"
                                @change="table.applyFilter"
                                :placeholder="[$t('from'), $t('to')]"
                />

                <div class="flex items-center gap-3">
                    <label>{{ $t('email_verified') }}</label>
                    <a-switch v-model:checked="table.filtered.is_email_verified"
                              @change="table.applyFilter"
                              class="!shadow-md"
                    />
                </div>
            </div>
            <crud-table
                :table="table"
                table-class="whitespace-nowrap index-table"
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
                        <a-badge status="success"
                                 v-if="record.email_verified_at !== null"
                                 text="Verified"
                        />
                        <a-badge status="processing"
                                 text="Pending"
                                 v-else
                        />
                    </template>
                </template>
            </crud-table>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "../../../Layouts/AdminLayout.vue";
import dayjs from "dayjs";

import {PlusOutlined, DeleteOutlined, ExclamationCircleOutlined, FilterOutlined} from "@ant-design/icons-vue";

import {createVNode, reactive} from "vue";
import useTable from '::admin/Utils/useTable';
import CrudTable from '::admin/Components/CrudTable.vue';
import {Modal} from "ant-design-vue";

export default {
    name: "Index",
    components: {
        AdminLayout,
        PlusOutlined,
        FilterOutlined,
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
            {title: 'ID', dataIndex: 'id', sorter: true, width: '80px'},
            {title: wTrans('user'), dataIndex: 'user'},
            {title: wTrans('roles'), dataIndex: 'roles', align: 'left'},
            {title: wTrans('email_verified'), dataIndex: 'email_verified_at', align: 'right', width: '180px'},
            {title: wTrans('created_at'), dataIndex: 'created_at', sorter: true, width: '240px'},
            {title: wTrans('updated_at'), dataIndex: 'updated_at', sorter: true, width: '240px'},
            {title: wTrans('action'), dataIndex: 'action', fixed: 'right', align: 'center', width: '240px'}
        ]);

        const table = useTable(props.users, {
            fieldName: 'users',
            rowKey: 'id',
            selectable: true,
            columns: columns
        });

        return {table, dayjs}
    },
    methods: {}
}
</script>

<style scoped>

</style>
