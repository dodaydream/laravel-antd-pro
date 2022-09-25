<template>
    <div class="w-screen h-screen dark:bg-[#2e3440] flex flex-col">
        <a-page-header title="創建公告" @back="back">
            <template #extra>
                <a-button type="primary" @click="submit">發表</a-button>
            </template>
        </a-page-header>

        <div class="mx-auto prose max-w-none flex-1 dark:prose-invert">
            <milkdown-editor class="flex-1" />
        </div>
    </div>
</template>

<script>
import { defineComponent, h} from 'vue';
import { Editor, rootCtx, themeFactory } from '@milkdown/core';
import { VueEditor, useEditor } from '@milkdown/vue';
import { commonmark } from '@milkdown/preset-commonmark';
import { tooltip } from '@milkdown/plugin-tooltip';
import { upload } from '@milkdown/plugin-upload';
import { getNord } from '@milkdown/theme-nord';
import { menu } from '@milkdown/plugin-menu';
import { useDark } from '@vueuse/core';

export const MilkdownEditor = defineComponent(() => {
    const isDark = useDark()

    const editor = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
            })
            .use(menu)
            .use(getNord(isDark.value))
            .use(tooltip)
            .use(upload)
            .use(commonmark),
    );

    return () => h(VueEditor, { editor: editor });

});
export default {
    name: "Create",
    components: {
        MilkdownEditor
    },
    methods: {
        back: function () {
            this.$inertia.visit(route('admin.admin.bulletins.index'))
        }
    }
}
</script>

<style scoped>

</style>
