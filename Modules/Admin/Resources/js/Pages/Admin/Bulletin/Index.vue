<template>
    <admin-layout
        :title="$t('bulletins')"
    >
        <a-page-header
            :title="$t('bulletins')"
        >
            <template #extra>
                <inertia-link :href="route('admin.admin.bulletins.create')">
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
<!--                        <a-input-search placeholder="Search..." class="max-w-lg"-->
<!--                                        @search="table.search.apply"-->
<!--                                        v-model:value="table.search.keyword"-->
<!--                        />-->

            <div>
                <a-form layout="vertical">
                    <div class="flex gap-3">
                        <a-select v-model:value="table.filtered.status" @change="table.applyFilter"
                                  class="filter-select w-56"
                        >
                            <a-select-option value="all">{{ $t('bulletins.all') }}</a-select-option>
                            <a-select-option value="draft">{{ $t('bulletins.draft') }}</a-select-option>
                            <a-select-option value="published">{{ $t('bulletins.published') }}</a-select-option>
                        </a-select>
                    </div>
                </a-form>
            </div>

            <crud-table
                :table="table"
                table-class="whitespace-nowrap index-table"
                resource="admin.admin.bulletins"
                :editHandler="(record) => {
                    this.$inertia.visit(route(`admin.admin.bulletins.edit`, record.id));
                }"
                @delete="(record) => destroy(record.id)"
            >
                <template #bodyCell="{ record, column }">
                    <template v-if="column.dataIndex === 'user'">
                        <div class="flex gap-2 items-center">
                        <a-avatar :src="record.user.avatar_thumb_url" />
                        <div>
                            <div class="font-medium text-xs">{{ record.user.name }}</div>
                            <div class="text-slate-500 text-xs">{{ record.user.email }}</div>
                        </div>
                        </div>
                    </template>

                    <template v-if="['created_at', 'updated_at'].includes(column.dataIndex)">
                        {{ dayjs(record.created_at).format('YYYY-MM-DD HH:mm') }}
                    </template>

                    <template v-if="column.dataIndex === 'status'">
                        <a-tag v-if="record.published_at === null"
                               color="purple"
                               class="!w-20 text-center"
                        >{{ $t('bulletins.draft') }}</a-tag>

                        <a-tag v-else
                               color="green"
                               class="!w-20 text-center"
                        >{{ $t('bulletins.published') }}</a-tag>
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
import {PlusOutlined} from "@ant-design/icons-vue";

import useTable from '::admin/Utils/useTable';
import CrudTable from '::admin/Components/CrudTable.vue';
import { reactive } from "vue";
import dayjs from "dayjs";

export default {
    name: "Index",
    components: {
        AdminLayout,
        PlusOutlined,
        CrudTable
    },
    props: {
        bulletins: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const columns = reactive([
            {title: 'ID', dataIndex: 'id', sorter: true, width: 100},
            {title: wTrans('status'), dataIndex: 'status', width: 100},
            {title: wTrans('title'), dataIndex: 'title', align: 'left'},
            {title: wTrans('user'), dataIndex: 'user', width: 256},
            {title: wTrans('created_at'), dataIndex: 'created_at', sorter: true, width: 256},
            {title: wTrans('updated_at'), dataIndex: 'updated_at', sorter: true, width: 256},
            {title: wTrans('action'), dataIndex: 'action', fixed: 'right', align: 'center', width: 256}
        ]);

        const table = useTable(props.bulletins, {
            fieldName: 'bulletins',
            rowKey: 'id',
            selectable: true,
            columns: columns
        });

        table.filtered.status = table.filtered.status ?? 'all';

        return { table, dayjs }
    },
    methods: {}
}
</script>

<style scoped>

</style>
