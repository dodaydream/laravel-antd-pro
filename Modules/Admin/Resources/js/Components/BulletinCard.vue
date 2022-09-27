<template>
    <a-card title="bulletins">
        <a-list :data-source="bulletins.data">
            <template #renderItem="{ item }">
                    <a-list-item class="hover:bg-slate-50 dark:hover:bg-neutral-800">
                        <a-skeleton :loading="loading" active :rows="2">
                            <inertia-link :href="route('admin.admin.bulletins.show', [item.id])" v-if="!loading" class="block w-full">
                                <a-list-item-meta
                                    :title="item.title"
                                    :description="item.excerpt"
                                    v-if="!loading"
                                />
                            </inertia-link>
                        </a-skeleton>
                    </a-list-item>
            </template>
        </a-list>
    </a-card>
</template>

<script>
export default {
    name: "BulletinCard",
    data () {
        return {
            loading: true,
            bulletins: {
                data: [
                    { title: '', excerpt: '' },
                ]
            }
        }
    },
    mounted () {
        this.loading = true
        window.axios.get(route('admin.admin.bulletins.index'), {
            params: {
                "filter[status]": 'published',
            }
        })
            .then(({data}) => {
                this.loading = false
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
