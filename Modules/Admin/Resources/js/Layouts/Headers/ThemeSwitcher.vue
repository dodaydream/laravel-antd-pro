<template>
    <a-button @click="toggleDark()" type="text" size="large">
        <template #icon>
            <i class="material-icons-outlined mdi" style="font-size: 20px">
                {{ isDark ? 'light_mode' : 'dark_mode' }}
            </i>
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
