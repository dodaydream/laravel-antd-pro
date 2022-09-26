<template>
    <div class="w-screen h-screen dark:bg-[#2e3440] flex flex-col">
        <a-page-header title="創建公告" @back="back">
            <template #extra>
                <a-button type="primary" @click="submit">發表</a-button>
            </template>
        </a-page-header>

        <div class="">
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
import { upload,uploadPlugin } from '@milkdown/plugin-upload';
import { getNord } from '@milkdown/theme-nord';
import { menu } from '@milkdown/plugin-menu';
import { useDark } from '@vueuse/core';

export const MilkdownEditor = defineComponent(() => {
    const isDark = useDark({
        selector: 'html',
        attribute: 'data-theme',
    });

    const uploader = async (files, schema) => {
        const images = [];

        for (let i = 0; i < files.length; i++) {
            const file = files.item(i);
            if (!file) {
                continue;
            }

            // You can handle whatever the file type you want, we handle image here.
            if (!file.type.includes('image')) {
                continue;
            }

            images.push(file);
        }

        const nodes = await Promise.all(
            images.map(async (image) => {
                const src = '123'
                const alt = image.name;
                return schema.nodes.image.createAndFill({
                    src,
                    alt,
                });
            }),
        );

        return nodes;
    };

    const editor = useEditor((root) =>
        Editor.make()
            .config((ctx) => {
                ctx.set(rootCtx, root);
            })
            .use(menu)
            .use(getNord(isDark.value))
            .use(tooltip)
            .use(
                upload.configure(uploadPlugin, {
                    uploader,
                    enableHtmlFileUploader: true,
                })
            )
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
