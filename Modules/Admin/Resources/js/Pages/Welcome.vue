<template>
    <AdminLayout>
        <a-page-header
            class="!bg-white"
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

        <div>
            <a-button @click="changeOpts">change</a-button>
            <a-select :options="opts" v-model:value="form.select" />
            <span>{{ form.select }}</span>
        </div>

        <div>
            <a-date-picker v-model:value="date"/>
            {{ date?.fromNow() }}
        </div>
    </AdminLayout>
</template>

<script>
import AdminLayout from "::admin/Layouts/AdminLayout.vue";
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime.js'
dayjs.extend(relativeTime)

export default {
    name: "Welcome",
    components: {AdminLayout},
    props: {
        top4Charts: {
            type: Array,
            default: () => [],
        },
    },
    setup () {
        const opts = [
            {label: 'Option 1', value: 'val1'},
            {label: 'Option 2', value: 'val2'},
            {label: 'Option 3', value: 'val3'},
            {label: 'Option 4', value: 'val4'},
        ]
        return {
            opts, dayjs
        }
    },
    data () {
        return {
            date: null,
            form: {
                select: ''
            }
        }
    },
    methods: {
        changeOpts () {
            // this.$nextTick(() => {
                this.form.select = 'val2'
            // })
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
        @apply font-semibold;
        @apply translate-y-1;
    }

    :deep(.apexcharts-subtitle-text) {
        @apply text-sm;
        @apply font-medium;
    }
}
</style>
