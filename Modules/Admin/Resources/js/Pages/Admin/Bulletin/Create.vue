<template>
    <div class="w-screen h-screen dark:bg-[#2e3440] flex flex-col fixed top-0 bottom-0 z-50 left-0 right-0">
        <a-page-header @back="back">
            <template #title>
                <a-tooltip placement="bottom" v-if="!isEditingTitle">
                    <template #title>
                        Edit
                    </template>
                    <div @click="isEditingTitle = true">{{ form.title }}</div>
                </a-tooltip>

                <a-input v-model:value="form.title"
                         @blur="save"
                         @focusout="save"
                         @keydown.enter="save"
                         v-else/>
            </template>
            <template #extra>
                <a-popconfirm
                    title="Are you sure to publish this bulletin?"
                    @confirm="publish"
                >
                    <a-button type="primary">發表</a-button>
                </a-popconfirm>
            </template>
        </a-page-header>

        <milkdown-editor class="md-editor" v-model:value="form.markdown" :uploader="uploader"/>
    </div>
</template>

<script>
import {defineComponent, h, defineProps, defineEmits} from 'vue';
import {Editor, rootCtx, themeFactory, defaultValueCtx, createCmdKey, CommandsReady} from '@milkdown/core';
import {VueEditor, useEditor} from '@milkdown/vue';
import {commonmark, image} from '@milkdown/preset-commonmark';
import {tooltip} from '@milkdown/plugin-tooltip';
import {upload, uploadPlugin} from '@milkdown/plugin-upload';
import {listener, listenerCtx} from '@milkdown/plugin-listener';
import {getNord} from '@milkdown/theme-nord';
import {menu, defaultConfig, menuPlugin} from '@milkdown/plugin-menu';
import {prism} from '@milkdown/plugin-prism';
import {indent} from '@milkdown/plugin-indent';
import {useDark} from '@vueuse/core';
import useForm from '::admin/Utils/useForm';
import { slash } from '@milkdown/plugin-slash';
import { gfm } from '@milkdown/preset-gfm';
import {debounce} from 'lodash';
import 'prism-themes/themes/prism-nord.css';
import {
    imagePickerPreset,
    imagePickerView
} from 'milkdown-plugin-image-picker'

export const MilkdownEditor = defineComponent({
    props: {
        value: {
            type: String,
            default: '',
        },
        uploader: {
            type: Function,
            default: () => {
            },
        }
    },
    setup(props, context) {
        const isDark = useDark({
            selector: 'html',
            attribute: 'data-theme',
        });

        const editor = useEditor((root) =>
            Editor.make()
                .config((ctx) => {
                    ctx.set(rootCtx, root);
                    if (props.value) {
                        ctx.set(defaultValueCtx, props.value);
                    }

                    ctx.get(listenerCtx).markdownUpdated((ctx, markdown, prevMarkdown) => {
                        context.emit('update:value', markdown);
                    });
                })
                .use(menu)
                .use(getNord(isDark.value).override(imagePickerView))
                .use(gfm.replace(image, imagePickerPreset()({
                    uploader: props.uploader,
                })))
                .use(listener)
                .use(prism)
                .use(indent)
                .use(slash)
                .use(tooltip)
                .use(
                    upload.configure(uploadPlugin, {
                        uploader: props.uploader,
                        enableHtmlFileUploader: true,
                    })
                )
        );

        return () => h(VueEditor, {editor: editor});
    }
});

export default {
    name: "Create",
    components: {
        MilkdownEditor
    },
    props: {
        bulletin: {
            type: Object,
            default: () => ({})
        }
    },
    setup(props) {
        const form = useForm({
            id: props.bulletin?.id,
            title: props.bulletin?.title ?? '(untitled)',
            markdown: props.bulletin?.markdown ?? '',
        })

        const uploader = async (files, schema) => {
            console.log(files)
            const images = new FormData()

            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (!file) {
                    continue;
                }

                // You can handle whatever the file type you want, we handle image here.
                if (!file.type.includes('image')) {
                    continue;
                }

                images.append('images[]', file, file.name);
            }

            console.log(images)

            // TODO: upload image
            const {data} = await window.axios.post(route('admin.admin.bulletins.upload-image', [
                form.id,
            ]), images, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            if (schema) {
                return data.map((media) => schema.nodes.image.createAndFill({
                    src: media.original_url,
                    alt: media.file_name,
                }));
            }

            return data.map((media) => ({
                src: media.original_url,
                alt: media.file_name,
            }));
        };

        return {form, uploader}
    },
    data() {
        return {
            isEditingTitle: false,
        }
    },
    watch: {
        'form.markdown': debounce(function (val, oldVal) {
            if (val === oldVal) {
                return
            }

            this.save();

        }, 5000)
    },
    methods: {
        save (callback=null) {
            this.isEditingTitle = false
            this.$message.loading({
                class: 'fixed right-1 bottom-0',
                content: 'Saving...',
                duration: 29999,
            })
            this.form.submit('post', route('admin.admin.bulletins.store'), {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    this.$message.destroy()
                    this.$message.success({
                        class: 'fixed right-1 bottom-0',
                        content: 'Saved!',
                    })

                    this.form.id = page.props.bulletin.id

                    if (callback) {
                        callback()
                    }
                },
                onError: () => {
                    this.$message.destroy()
                    this.$message.error({
                        class: 'fixed right-1 bottom-0',
                        content: 'Failed to save!',
                    })
                }
            })
        },
        back () {
            this.$inertia.visit(route('admin.admin.bulletins.index'))
        },
        publish () {
            this.$inertia.post(route('admin.admin.bulletins.publish', [
                this.form.id,
            ]), {

            }, {
                onSuccess: () => {
                    this.$notification.success({
                        title: 'Success',
                        message: 'Bulletin published!',
                    })
                }
            })
        }
    }
}
</script>

<style scoped lang="less">
:deep(.milkdown-menu-wrapper),
.md-editor {
@apply flex;
@apply flex-col;
@apply flex-1;
@apply h-full;
@apply overflow-hidden;
}

:deep(.milkdown) {
@apply flex-1;
@apply w-full;
@apply h-full;
@apply overflow-scroll;
}

:deep(.milkdown-menu) {
    @apply border-t-transparent;
    @apply border-x-transparent;
}

:deep(.ProseMirror.editor) {
@apply max-w-4xl;
@apply mx-auto;
}
</style>
