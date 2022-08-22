<template>
    <a-config-provider>
        <a-layout class="h-full">
            <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
                <div class="logo" />
                <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
                    <a-menu-item key="1">
                        <user-outlined />
                        <span>nav 1</span>
                    </a-menu-item>
                    <a-menu-item key="2">
                        <video-camera-outlined />
                        <span>nav 2</span>
                    </a-menu-item>
                    <a-menu-item key="3">
                        <upload-outlined />
                        <span>nav 3</span>
                    </a-menu-item>
                </a-menu>
            </a-layout-sider>
            <a-layout>
                <a-layout-header style="background: #fff; padding: 0">
                    <menu-unfold-outlined
                        v-if="collapsed"
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                    />
                    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

                    <div class="float-right mr-4 h-full items-center flex">
                        <header-avatar />
                    </div>
                </a-layout-header>

                <a-layout-content>
                    <slot></slot>
                </a-layout-content>

            </a-layout>
        </a-layout>
    </a-config-provider>
</template>

<script lang="ts">
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from '@ant-design/icons-vue';
import { defineComponent, ref } from 'vue';
import HeaderAvatar from './Headers/HeaderAvatar.vue'
export default defineComponent({
    components: {
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        HeaderAvatar,
    },
    setup() {
        return {
            selectedKeys: ref<string[]>(['1']),
            collapsed: ref<boolean>(false),
        };
    },
});
</script>

<style>
#app {
    height: 100%;
    width: 100%;
}

#app .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

#app .trigger:hover {
    color: #1890ff;
}

#app .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.3);
    margin: 16px;
}
</style>
