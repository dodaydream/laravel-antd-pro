<template>
    <admin-layout>
        <a-page-header :title="bulletin.title" @back="back" class="!sticky top-0 z-50" :ghost="false">

        </a-page-header>
        <div class="p-4">
            <div class="prose mx-auto max-w-3xl dark:prose-invert">
                <a-card>
                    <template #title>
                        <div class="not-prose flex gap-3 items-center">
                            <a-avatar :src="bulletin.user.avatar_thumb_url" size="large"/>
                            <div>
                                <div class="font-medium">{{ bulletin.user.name }}</div>
                                <div class="text-sm text-slate-500">{{ dayjs(bulletin.created_at).format('LLL') }}</div>
                            </div>
                        </div>
                    </template>
                    <div
                        v-html="bulletin.html"
                    />
                </a-card>
            </div>
        </div>
    </admin-layout>
</template>

<script>
import AdminLayout from '::admin/Layouts/AdminLayout.vue';
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(LocalizedFormat)

export default {
    name: "Show",
    props: {
        bulletin: {
            type: Object,
            required: true
        }
    },
    components: {
        AdminLayout
    },
    setup () {
        return { dayjs }
    },
    methods: {
        back() {
            history.back()
        }
    }
}
</script>

<style scoped>

</style>
