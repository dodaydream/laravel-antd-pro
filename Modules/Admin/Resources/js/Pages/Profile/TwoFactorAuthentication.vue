<template>
    <ProfileLayout>
        <h3 class="text-lg font-medium text-gray-900">
            <template v-if="twoFactorEnabled">
                Two Factor Authentication is enabled
            </template>

            <template v-else>
                Two Factor Authentication is disabled
            </template>
        </h3>

        <div class="mt-3 max-w-xl text-sm text-gray-600">
            <p>
                Two Factor Authentication is a security feature that requires you to enter a code from your phone
                every time you log in. This is to prevent someone from logging into your account without your knowledge.
            </p>
        </div>

        <div v-if="twoFactorEnabled">
            <div v-if="qrCode">
                <div class="mt-4 max-w-xl text-sm text-gray-600">
                    <p class="font-semibold">
                        Scan this QR code with your authenticator app to enable Two Factor Authentication.
                    </p>
                </div>

                <div class="mt-4" v-html="qrCode"></div>
            </div>

            <div v-if="recoveryCodes.length > 0">
                <div class="mt-4 max-w-xl text-sm text-gray-600">
                    <p class="font-semibold">
                        Recovery codes are used to access your account in the event you lose your phone.
                    </p>
                </div>

                <div
                    class="
            grid
            gap-1
            max-w-xl
            mt-4
            px-4
            py-4
            font-mono
            text-sm
            bg-gray-100
            rounded-lg
          "
                >
                    <div v-for="code in recoveryCodes" :key="code">
                        {{ code }}
                    </div>
                </div>
            </div>
        </div>

        <div class="mt-5">
            <div v-if="!twoFactorEnabled">
                <a-button :loading="enabling" @click="confirmPassword('enable', true)">Enable</a-button>
            </div>

            <div v-else>
                <a-space>
                    <a-button v-if="recoveryCodes.length > 0" @click="confirmPassword('regenerate')" :loading="enabling">
                        Regenerate Recovery Codes
                    </a-button>

                    <a-button v-if="recoveryCodes.length === 0" @click="confirmPassword('show')" :loading="enabling">
                        Show Recovery Codes
                    </a-button>

                    <a-button type="danger" :loading="disabling" @click="confirmPassword('disable', true)"> Disable </a-button>
                </a-space>
            </div>
        </div>
    </ProfileLayout>
</template>

<script>
import useForm from "::admin/Utils/useForm.js";
import AvatarCropper from "../../Components/AvatarCropper.vue";
import ProfileLayout from "./ProfileLayout.vue";
import confirmPassword from '::admin/Utils/confirmPassword.jsx';

export default {
    name: "Index",
    components: {ProfileLayout, AvatarCropper},
    props: {
        currentUser: {
            type: Object,
            required: true,
        },
    },
    computed: {
        twoFactorEnabled() {
            return !this.enabling && this.$page.props.currentUser.two_factor_enabled;
        },
    },
    setup(props) {
        const form = useForm({
            name: props.currentUser.name,
            email: props.currentUser.email,
            roles: props.currentUser.roles,
            password: '',
            password_confirmation: ''
        })

        return { form }
    },
    data () {
        return {
            enabling: false,
            disabling: false,

            qrCode: null,
            recoveryCodes: [],
        };
    },
    mounted () {
    },

    methods: {
        enableTwoFactorAuthentication() {
            this.enabling = true;

            this.$inertia.post(
                "/user/two-factor-authentication",
                {},
                {
                    preserveScroll: true,
                    onSuccess: () =>
                        Promise.all([this.showQrCode(), this.showRecoveryCodes()]),
                    onFinish: () => (this.enabling = false),
                }
            );
        },

        showQrCode() {
            return axios.get("/user/two-factor-qr-code").then((response) => {
                this.qrCode = response.data.svg;
            });
        },

        showRecoveryCodes() {
            return axios.get("/user/two-factor-recovery-codes").then((response) => {
                this.recoveryCodes = response.data;
            });
        },

        regenerateRecoveryCodes() {
            axios.post("/user/two-factor-recovery-codes").then((response) => {
                this.showRecoveryCodes();
            });
        },

        confirmPassword(event, force=false) {
            confirmPassword(force).then(() => {
                switch (event) {
                    case 'disable':
                        this.disableTwoFactorAuthentication();
                        break;

                    case 'enable':
                        this.enableTwoFactorAuthentication();
                        break;

                    case 'regenerate':
                        this.regenerateRecoveryCodes();
                        break;

                    case 'show':
                        this.showRecoveryCodes();
                        break;
                }
            }).catch((e) => {
                console.log(e);
                this.$message.warning('Authentication cancelled');
            })
        },

        disableTwoFactorAuthentication() {
            this.disabling = true;

            window.axios.delete(route('two-factor.disable')).then(() => {
                this.disabling = false;
                this.$inertia.reload();
            });
        }
    },
}
</script>

<style scoped>

</style>
