<template>
    <a-card>
        <template #extra>
            <slot name="rightAction" />
        </template>

        // BULK ACTIONS
        <a-alert
            v-if="table.rowSelection.selected"
            class="!mb-4"
        >
            <template #message>
                <div class="flex justify-between items-center">
                    <div>
                        <span>{{ $t('items_selected', {count: table.rowSelection.count}) }}</span>&nbsp;
                        <a @click="table.rowSelection.clear">
                            {{ $t('clear_selection') }}
                        </a>
                    </div>
                    <span class="gap-3 flex">
                        <a-button
                            type="link"
                            danger
                            @click="bulkDestroy"
                        >
                            {{ $t('remove') }}
                        </a-button>
                    </span>
                </div>
            </template>
        </a-alert>

        <a-table
            v-bind="$props"
        >
            <template #bodyCell="{ column, record}">
                <slot name="bodyCell" :column="column" :record="record"></slot>
                <template v-if="column.dataIndex === 'action' || column.key === 'action'">
                    // TODO: handle action
                </template>
            </template>
        </a-table>
    </a-card>
</template>

<script>
export default {
    name: "CRUDTable",
    props: {
        table: {
            type: Object,
            required: true,
        },
        data: {
            type: Object,
            required: true,
        }
    },
    // bind table and data
    setup (props) {
        const {
            columns,
        } = useTable()
    }
}
</script>

<style scoped>

</style>
