<template>
    <a-menu
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        mode="inline"
        theme="dark"
        :inline-collapsed="collapsed"
    >
        <template v-for="item in list" :key="item.key">
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
                <sub-menu :key="item.key" :menu-info="item" />
            </template>
        </template>
    </a-menu>
</template>

<script>
import SubMenu from './SubMenu.vue';
import menu from './menu.js';
import * as AntdIcons from '@ant-design/icons-vue';

export default {
    name: "Menu",
    props: {
        collapsed: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    components: {
        SubMenu,
        ...AntdIcons,
    },
    data () {
        return {
            openKeys: [route().current().split('.').slice(0, 2).join('.')],
            selectedKeys: [
                route().current().split('.').slice(0, 3).join('.')
            ]
        }
    },
    setup () {
        return { list: menu }
    }
}
</script>

<style scoped>

</style>
