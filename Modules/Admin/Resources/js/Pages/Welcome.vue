<template>
    <AdminLayout
        :title="$t('layout.welcome')"
    >
        <a-page-header
            :title="$t('layout.welcome')"
            sub-title="Welcome to laravel-antd-pro"
        >
        </a-page-header>

        <div class="container-fluid">
            <div class="grid gap-4 grid-cols-1 md:grid-cols-4">
                <a-card
                    v-for="(chart, index) in top4Charts"
                    class="borderless"
                    :key="index"
                >
                    <chart :chart="chart" />
                </a-card>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
                <bulletin-card />
            </div>
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";
import BulletinCard from "::admin/Components/BulletinCard.vue";
import Chart from "../Components/Chart.vue";

export default {
    name: "Welcome",
    components: {Chart, BulletinCard, AdminLayout},

    props: {
        top4Charts: {
            type: Array,
            default: () => [],
        },
    },
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
        @apply font-bold;
        @apply translate-y-1;
        @apply dark:!text-white;
        @apply !font-sans;
    }

    :deep(.apexcharts-subtitle-text) {
        @apply text-sm;
        @apply font-medium;
        @apply dark:!text-white;
        @apply !font-sans;
    }
}
</style>
