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
                    v-for="lang in locale.availableLanguages"
                    :key="lang"
                    @click="locale.switchLocale(lang)"
                >
                    <template #icon>
                        <CheckOutlined v-if="lang=== locale.activeLanguage.value" />
                        <div v-else></div>
                    </template>
                    <a>{{ $t(`layout.lang.${lang}`) }}</a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>

    <div v-show="locale.isLoading.value" class="bg-white fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center">
        <a-spin :tip="$t('layout.switch_lang_tip')" />
    </div>
</template>

<script>
import {
    GlobalOutlined,
    CheckOutlined,
} from '@ant-design/icons-vue'

import { useLocale } from '::admin/Store/locale';

export default {
    name: 'LocaleSwitcher',
    components: {
        GlobalOutlined,
        CheckOutlined,
    },
    setup (props) {
        const locale = useLocale()

        return { locale }
    },
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
