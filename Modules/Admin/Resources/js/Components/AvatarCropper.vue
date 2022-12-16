<template>
    <a-modal
        v-model:visible="modalVisible"
        title="Edit Avatar"
        okText="Change Avatar"
        @ok="changeAvatar"
        :maskClosable="false"
    >
        <div class="flex gap-6">
            <div>
                <cropper
                    class="cropper"
                    ref="cropper"
                    :aspect-ratio="1"
                    :canvas="{
                        width: 256,
                        height: 256,
                    }"
                    :stencil-component="$options.components.CircleStencil"
                    :src="newAvatar"
                    @change="onChange"
                    auto-zoom
                />
            </div>

            <div class="flex flex-col gap-3">
                <div>Preview</div>
                <preview
                    class="hidden md:block ring-2 ring-slate-100"
                    :width="120"
                    :height="120"
                    :image="result.image"
                    :coordinates="result.coordinates"
                />

                <preview
                    class="hidden md:block rounded-full ring-2 ring-slate-100"
                    :width="120"
                    :height="120"
                    :image="result.image"
                    :coordinates="result.coordinates"
                />
            </div>

        </div>

    </a-modal>

    <a-upload
        v-model:file-list="avatar"
        name="avatar"
        list-type="picture-card"
        class="avatar-uploader"
        :show-upload-list="false"
        accept="image/png, image/jpeg, image/webp, image/heic"
        :before-upload="beforeUpload"
    >
        <img v-if="user.avatar_url" :src="user.avatar_url" alt="avatar"/>
        <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
        </div>
    </a-upload>
</template>

<script>
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons-vue";
import {Cropper, CircleStencil, Preview} from 'vue-advanced-cropper';
import { Modal as AModal } from 'ant-design-vue';

import 'vue-advanced-cropper/dist/style.css';

export default {
    name: "AvatarCropper",
    components: {
        AModal,
        LoadingOutlined,
        PlusOutlined,
        Cropper,
        Preview,
        CircleStencil
    },
    data() {
        return {
            avatar: [],
            modalVisible: false,
            loading: false,
            newAvatar: null,
            result: {
                coordinates: null,
                image: null
            }
        }
    },
    props: {
        user: {
            type: Object,
            required: true
        }
    },
    methods: {
        onChange({coordinates, image}) {
            this.result = {
                coordinates,
                image
            };
        },
        blobToData(file) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result)
                reader.readAsDataURL(file)
            })
        },
        async beforeUpload(file) {
            this.loading = true
            this.newAvatar = await this.blobToData(file)
            this.modalVisible = true
            this.loading = false
        },
        async changeAvatar() {
            // TODO: change the avatar
            const { canvas } = this.$refs.cropper.getResult()

            const avatar = await this.dataUrlToBlob(canvas.toDataURL('image/png'))

            this.$inertia.post(
                route('admin.system.users.avatar', {
                    user: this.user.id
                }), {
                    _method: 'put',
                    avatar: avatar
                }, {
                    onSuccess: () => {
                        this.modalVisible = false
                        this.$message.success('Avatar changed successfully.')
                    }
                })
        },
        async dataUrlToBlob(dataUrl) {
            const res = await fetch(dataUrl);
            return await res.blob();
        }
    }
}
</script>

<style scoped>
.cropper {
    @apply w-48;
    @apply h-48;
    @apply md:w-80;
    @apply md:h-80;
    background: #DDD;
}
</style>
