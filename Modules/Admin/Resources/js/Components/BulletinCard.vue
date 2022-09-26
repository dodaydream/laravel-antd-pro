<template>
    <a-card title="bulletins">
        <a-list :data-source="bulletins.data">
            <template #renderItem="{ item }">
                <inertia-link :href="route('admin.admin.bulletins.show', [item.id])">
                    <a-list-item class="hover:bg-slate-100 dark:hover:bg-neutral-800">
                        <a-list-item-meta
                            :title="item.title"
                            :description="item.excerpt"
                        />
                    </a-list-item>
                </inertia-link>
            </template>
        </a-list>
    </a-card>
</template>

<script>
export default {
    name: "BulletinCard",
    data () {
        return {
            bulletins: {}
        }
    },
    mounted () {
        window.axios.get(route('admin.admin.bulletins.index'), {
            query: {
                limit: 3
            }
        })
            .then(({data}) => {
                this.bulletins = data.bulletins
            })
    }
}
</script>

<style scoped>
:deep(.ant-card-body) {
    padding: 0;
}

:deep(.ant-list-item) {
    padding-left: 24px;
    padding-right: 24px;
}

</style>
