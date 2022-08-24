<template>
    <ProfileLayout>
        <div class="gap-3 grid grid-cols-1 md:grid-cols-2">
        <a-card
            v-for="(session, index) in sessions"
            :key="index"
            class="relative overflow-clip"
        >
            <div class="flex gap-3 items-center">
                <div
                    v-if="session.is_current_device"
                    class="absolute top-0 -left-6 -rotate-45 bg-green-500 w-12 h-4"
                ></div>
                <div>
                    <DesktopOutlined v-if="session.agent.is_desktop" class="!text-4xl !text-slate-500"/>
                    <MobileOutlined v-else class="!text-4xl !text-slate-500"/>
                </div>

                <div class="flex-1">
                    <div class="text-base">
                        {{ session.agent.platform }} {{ session.agent.browser }}
                    </div>
                    <div class="text-slate-500">
                        {{ session.ip_address }}
                    </div>
                </div>
                <div>
                    {{ session.last_active }}
                </div>
            </div>
        </a-card>
        </div>
    </ProfileLayout>
</template>

<script>
import useForm from "::admin/Utils/useForm.js";
import AvatarCropper from "../../Components/AvatarCropper.vue";
import ProfileLayout from "./ProfileLayout.vue";
import {DesktopOutlined, MobileOutlined} from '@ant-design/icons-vue';

export default {
    name: "Index",
    components: {ProfileLayout, DesktopOutlined, MobileOutlined},
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            sessions: []
        }
    },
    mounted() {
        window.axios.get(route('admin.system.users.sessions', {
            user: this.user.id
        })).then(({data}) => {
            this.sessions = data
        })
    }
}
</script>

<style scoped>

</style>
