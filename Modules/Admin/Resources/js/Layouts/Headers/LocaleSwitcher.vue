<template>
    <a-dropdown>
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center">
            <a-button
                type="text"
                size="large"
            >
                <template #icon>
                    <GlobalOutlined />
                </template>
            </a-button>
        </div>
        <template #overlay>
            <a-menu class="user-dropdown-menu-wrapper">
                <a-menu-item
                    v-for="locale in availableLocales"
                    :key="locale"
                    @click="setLocale(locale)"
                >
                    <a>{{ $t(`layout.lang.${locale}`) }}</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <div v-show="isLoading" class="bg-white fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <a-spin :tip="$t('layout.switch_lang_tip')" />
    </div>
</template>

<script>
import {
    GlobalOutlined,
} from '@ant-design/icons-vue'

import { loadLanguageAsync } from 'laravel-vue-i18n';

export default {
    name: 'LocaleSwitcher',
    components: {
        GlobalOutlined,
    },
    setup () {
        const availableLocales = ['zh_TW', 'en']
        return { availableLocales }
    },
    data () {
        return {
            isLoading: false,
        }
    },
    methods: {
        async setLocale (locale) {
            this.isLoading = true;
            await window.axios.get(route('admin.locale.update', { locale: locale }))
            await loadLanguageAsync(locale)
            this.isLoading = false;
        }
    }
}
</script>

<style lang="less">
.header-avatar{
    display: inline-flex;
    .avatar, .name{
        align-self: center;
    }
    .avatar{
        margin-right: 8px;
    }
    .name{
        font-weight: 500;
    }
}
.avatar-menu{
    width: 150px;
}

</style>
