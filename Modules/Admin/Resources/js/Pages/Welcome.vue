<template>
    <AdminLayout>
        <a-page-header
            :title="$t('layout.welcome')"
            sub-title="Welcome to laravel-antd-pro"
        >
        </a-page-header>

        <div class="p-4">
            <div class="grid gap-4 md:grid-cols-4">
                <a-card
                    class="borderless"
                    v-for="(chart, index) in top4Charts"
                    :key="index"
                >
                    <apexchart
                        height="100%"
                        :type="chart.type"
                        :options="chart.options"
                        :series="chart.series"
                    ></apexchart>
                </a-card>
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";

export default {
    name: "Welcome",
    components: {AdminLayout},
    props: {
        top4Charts: {
            type: Array,
            default: () => [],
        },
    }
}
</script>

<style scoped lang="less">
.borderless {
    :deep(.ant-card-body) {
        @apply pb-0;
        @apply px-0;
        @apply h-40;
    }

    :deep(.apexcharts-title-text) {
        @apply text-2xl;
        @apply font-semibold;
        @apply translate-y-1;
    }

    :deep(.apexcharts-subtitle-text) {
        @apply text-sm;
        @apply font-medium;
    }
}
</style>
