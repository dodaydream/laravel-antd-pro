<template>
    <a-config-provider :locale="locale.antdLocale.value">
        <a-layout>
            <a-layout-sider
                v-model:collapsed="collapsed"
                style="position: fixed; overflow: auto; height: 100%; left: 0;"
                width="256"
                :trigger="null"
                collapsible
            >
                <inertia-link :href="route('admin.welcome')">
                <div class="whitespace-nowrap text-white w-full font-medium text-lg flex items-center justify-center"
                     style="height: 64px"
                >
                    <span v-if="!collapsed">
                        Laravel Antd Pro
                    </span>
                    <span v-else>
                        LAP
                    </span>
                </div>
                </inertia-link>

                <side-menu :collapsed="collapsed" />
            </a-layout-sider>
            <a-layout :style="
                !collapsed ? 'margin-left: 256px' : 'margin-left: 80px'"
                      class="transition-all duration-300 ease-in-out"
            >
                <a-layout-header style="background: #fff; padding: 0; position: sticky; top: 0; z-index: 99">
                    <menu-unfold-outlined
                        v-if="collapsed"
                        class="trigger"
                        @click="() => (collapsed = !collapsed)"
                    />
                    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />

                    <div class="float-right mr-4 h-full items-center flex gap-3">
                        <notifications />
                        <jobs />

                        <locale-switcher />

                        <div>
                            <a-tooltip placement="bottom">
                                <template #title>
                                    <span>{{ $t(isFullscreen ? 'layout.exit_fullscreen' : 'layout.enter_fullscreen')}}</span>
                                </template>
                            <a-button
                                type="text"
                                size="large"
                                @click="toggleFullscreen"
                            >
                                <template #icon>
                                    <FullscreenExitOutlined v-if="isFullscreen"/>
                                    <FullscreenOutlined v-else/>
                                </template>
                            </a-button>
                            </a-tooltip>
                        </div>

                        <header-avatar />
                    </div>
                </a-layout-header>

                <a-layout-content>
                    <perfect-scrollbar>
                        <template v-if="noTransition">
                            <slot></slot>
                        </template>
                    <transition name="fade" mode="out-in" appear v-else>
                        <div :key="route().current()">
                            <slot></slot>
                        </div>
                    </transition>
                    </perfect-scrollbar>
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-config-provider>
</template>

<script>
import {
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
} from '@ant-design/icons-vue';

import { ref } from 'vue';
import HeaderAvatar from './Headers/HeaderAvatar.vue'
import LocaleSwitcher from './Headers/LocaleSwitcher.vue'
import Jobs from './Headers/Jobs.vue'
import Notifications from './Headers/Notifications.vue'
import SideMenu from './Menu/Menu.vue'
import { useLocale } from '::admin/Store/locale';

export default {
    components: {
        UserOutlined,
        VideoCameraOutlined,
        UploadOutlined,
        MenuUnfoldOutlined,
        MenuFoldOutlined,
        HeaderAvatar,
        SideMenu,
        FullscreenOutlined,
        FullscreenExitOutlined,
        LocaleSwitcher,
        Jobs,
        Notifications,
    },
    setup() {
        const isFullscreen = ref(document.fullscreenElement !== null);
        const locale = useLocale();

        return {
            collapsed: ref(false),
            isFullscreen,
            locale,
        };
    },
    props: {
        noTransition: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        toggleFullscreen() {
            if (this.isFullscreen) {
                document.exitFullscreen();
                this.isFullscreen = false;
            } else {
                document.documentElement.requestFullscreen();
                this.isFullscreen = true;
            }
        }
    }
}
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.ps {
    height: calc(100vh - 64px);
}

.ps__rail-x, .ps__rail-y {
    z-index: 999;
}

.ant-layout-header .ant-btn {
    height: 64px !important;
}
</style>
