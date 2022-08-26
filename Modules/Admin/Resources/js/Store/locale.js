import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import dayjs from 'dayjs'

import { loadLanguageAsync, getActiveLanguage } from 'laravel-vue-i18n';

export const useLocale = createGlobalState(
    () => {
        const activeLanguage = ref(getActiveLanguage())

        const antdLocale = ref(null)
        const isLoading = ref(false)

        const availableLanguages = [
            'en',
            'zh_TW',
        ]

        const loadLibraryLanguage = async (locale) => {
            const language = await import(`../Locales/${locale}.js`)

            console.log(language.default)

            dayjs.locale(language.default.dayjs.name)
            antdLocale.value = language.default.antD
        }

        const switchLocale = async (locale) => {
            isLoading.value = true;
            await window.axios.get(route('admin.locale.update', { locale: locale }))
            await loadLanguageAsync(locale)
            await loadLibraryLanguage(locale)
            activeLanguage.value = locale;
            isLoading.value = false;
        }

        // init
        if (antdLocale.value === null) {
            loadLibraryLanguage(activeLanguage.value)
        }

        return { antdLocale, activeLanguage, switchLocale , isLoading, availableLanguages }
    }
)
