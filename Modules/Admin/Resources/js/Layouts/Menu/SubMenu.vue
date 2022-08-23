<template>
    <a-sub-menu :key="menuInfo.key">
        <template #icon v-if="menuInfo.icon">
            <component :is="menuInfo.icon" />
        </template>
        <template #title>{{ menuInfo.title }}</template>
        <template v-for="item in menuInfo.children" :key="item.key">
            <template v-if="!item.children">
                <a-menu-item :key="item.key">
                    <template #icon v-if="item.icon">
                        <component :is="item.icon" />
                    </template>
                    <inertia-link :href="route(item.route)">
                        {{ item.title }}
                    </inertia-link>
                </a-menu-item>
            </template>
            <template v-else>
                <sub-menu :menu-info="item" :key="item.key" />
            </template>
        </template>
    </a-sub-menu>
</template>

<script>
import * as AntdIcons from '@ant-design/icons-vue';
export default {
    name: "SubMenu",
    components: {
        ...AntdIcons,
    },
    props: {
        menuInfo: {
            type: Object,
            default: () => ({}),
        },
    }
}
</script>

<style scoped>

</style>
