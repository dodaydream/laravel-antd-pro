<template>
    <admin-layout>
        <a-page-header
            title="Routes"
        >
        </a-page-header>

        <div class="p-4">
            <a-card title="Routes">
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
                    :data-source="routes"
                    size="small"
                    :scroll="{ x: true }"
                >
                    <template #bodyCell="{ record, column, text }">
                        <template v-if="column.dataIndex === 'methods'">
                            <a-tag
                                v-for="method in record.methods"
                                :key="method"
                                :color="colorMap[method]"
                            >{{ method }}</a-tag>
                        </template>

                        <template v-if="column.dataIndex === 'middleware'">
                            <template v-for="mw in record.middleware" :key="mw">
                                <a-tag>{{ mw }}</a-tag>
                                <br />
                            </template>
                        </template>
                    </template>
                </a-table>
            </a-card>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";
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
        routes: {
            type: Array,
            required: true
        }
    },
    setup(props) {
        console.debug(props.routes)
        const columns = [
            {title: 'methods', dataIndex: 'methods', fixed: 'left'},
            {title: 'name', dataIndex: 'name', fixed: 'left'},
            {title: 'uri', dataIndex: 'uri'},
            {title: 'action', dataIndex: 'action'},
            {title: 'middleware', dataIndex: 'middleware'},
        ];

        const colorMap = {
            GET: 'green',
            HEAD: 'green',
            DELETE: 'red',
            POST: 'blue',
            PATCH: 'orange',
            PUT: 'orange',
        };

        return {columns, dayjs, colorMap}
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
