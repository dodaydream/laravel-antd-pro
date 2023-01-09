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
                    <apexchart
                        class="h-full w-full"
                        :type="chart.type"
                        :options="themedOpt(chart.options)"
                        :series="chart.series"
                    ></apexchart>
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
import {useThemeStore} from "../Store/theme";


export default {
    name: "Welcome",
    components: {BulletinCard, AdminLayout},
    setup () {
        const { isDark } = useThemeStore()

        return {
            isDark
        }
    },
    props: {
        top4Charts: {
            type: Array,
            default: () => [],
        },
    },
    computed: {
        themedOpt () {
            return (opt) => ({
                ...opt,
                chart: {
                    ...opt.chart,
                    height: '100%',
                    width: '100%',
                    foreColor: this.isDark ? '#fff' : '#000',
                    background: 'transparent',
                },
                theme: {
                    mode: this.isDark ? 'dark' : 'light'
                }
            })
        }
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
