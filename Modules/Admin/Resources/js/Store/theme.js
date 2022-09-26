import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
})

export const useThemeStore = defineStore('theme', {
    getters: {
        isDark: (state) => isDark,
    },
    actions: {
        toggleDark () {
            const toggle = useToggle(isDark)
            toggle()
        }
    }
})
