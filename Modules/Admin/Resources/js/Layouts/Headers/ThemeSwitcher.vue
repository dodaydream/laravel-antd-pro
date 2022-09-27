<template>
    <a-button @click="toggleDark()" type="text" size="large">
        <template #icon>
                                <span class="material-icons-outlined anticon" :style="isDark ? 'font-size: 20px':'font-size: 24px'">
                                    {{ isDark ? 'light_mode' : 'dark_mode' }}
                                </span>
        </template>
    </a-button>
</template>

<script>
import {useThemeStore} from "::admin/Store/theme";

export default {
    name: "ThemeSwitcher",
    setup () {
        const {toggleDark, isDark} = useThemeStore();

        return {
            toggleDark,
            isDark
        }
    }
}
</script>

<style scoped>

</style>
