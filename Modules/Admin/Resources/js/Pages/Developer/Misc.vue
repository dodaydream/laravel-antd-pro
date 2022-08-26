<template>
    <admin-layout>
        <a-page-header
            title="Misc"
        >
        </a-page-header>

        <div class="p-4 flex flex-col gap-4">
            <a-card title="Jobs">
                <a-button @click="dispatchJob">Test Dispatch Job</a-button>
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
    methods: {
        dispatchJob () {
            this.$inertia.visit(route('admin.developer.misc.dispatch-job'));
        }
    }
}
</script>

<style scoped>

</style>
