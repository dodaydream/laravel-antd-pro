<template>
    <admin-layout>
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

        <div class="p-4 flex flex-col gap-4">
            <!--            <a-input-search placeholder="Search..." class="max-w-lg"-->
            <!--                            @search="table.search.apply"-->
            <!--                            v-model:value="table.search.keyword"-->
            <!--            />-->

<!--            <a-card>-->
<!--                <a-form layout="vertical">-->
<!--                    <div class="grid md:grid-cols-1 gap-3">-->
<!--                        <a-form-item label="Email">-->
<!--                            <a-input v-model:value="table.filtered.email"/>-->
<!--                        </a-form-item>-->

<!--                        <a-form-item label="Date creation">-->
<!--                            <a-range-picker  v-model:value="table.filtered.created_at"-->
<!--                                             valueFormat="YYYY-MM-DD"-->
<!--                            />-->
<!--                        </a-form-item>-->

<!--                        <a-form-item label="Email Verified">-->
<!--                            <a-switch v-model:checked="table.filtered.is_email_verified" />-->
<!--                        </a-form-item>-->
<!--                    </div>-->
<!--                </a-form>-->

<!--                <div class="flex gap-3">-->
<!--                    <a-button type="primary" @click="table.applyFilter">Apply</a-button>-->
<!--                    <a-button type="link" @click="table.resetFilter">Reset</a-button>-->
<!--                </div>-->
<!--            </a-card>-->

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
            {title: 'ID', dataIndex: 'id', sorter: true},
            {title: trans('user'), dataIndex: 'user'},
            {title: trans('title'), dataIndex: 'title', align: 'left'},
            {title: trans('created_at'), dataIndex: 'created_at', sorter: true},
            {title: trans('updated_at'), dataIndex: 'updated_at', sorter: true},
            {title: trans('action'), dataIndex: 'action', fixed: 'right', align: 'center'}
        ]);

        const table = useTable(props.bulletins, {
            fieldName: 'bulletins',
            rowKey: 'id',
            selectable: true,
            columns: columns
        });

        return { table }
    },
    methods: {}
}
</script>

<style scoped>

</style>