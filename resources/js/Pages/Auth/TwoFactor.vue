<template>
    <div class="h-screen w-screen bg-slate-100 flex items-center justify-center">
        <div class="fixed top-0 right-0 p-4">
            <LocaleSwitcher/>
        </div>
        <div class="max-w-sm w-full p-4">
            <h1 class="text-lg font-bold text-center">Two-factor Challenge</h1>
            <p class="text-slate-500 text-base text-center mb-12">
                <template v-if="!recovery">
                    Please confirm access to your account by entering the authentication
                    code provided by your authenticator application.
                </template>

                <template v-else>
                    Please confirm access to your account by entering one of your
                    emergency recovery codes.
                </template>
            </p>
            <a-form @submit.prevent="submit">
                <a-form-item v-if="!recovery" label="Code" v-bind="form.validation.code">
                    <a-input
                        ref="code"
                        id="code"
                        type="text"
                        inputmode="numeric"
                        v-model:value="form.code"
                        autofocus
                        autocomplete="one-time-code"
                    />
                </a-form-item>

                <a-form-item v-else label="Recovery Code" v-bind="form.validation.recovery_code">
                    <a-input
                        ref="recovery_code"
                        id="recovery_code"
                        type="text"
                        v-model:value="form.recovery_code"
                        autocomplete="one-time-code"
                    />
                </a-form-item>

                <div class="flex items-center justify-end mt-4">
                    <a-button
                        type="button"
                        class="
              text-sm text-gray-600
              hover:text-gray-900
              underline
              cursor-pointer
            "
                        @click.prevent="toggleRecovery"
                    >
                        <template v-if="!recovery"> Use a recovery code </template>

                        <template v-else> Use an authentication code </template>
                    </a-button>

                    <a-button
                        class="ml-4"
                        @click="submit"
                        :loading="form.processing"
                    >
                        Log in
                    </a-button>
                </div>
            </a-form>>
        </div>
    </div>
</template>

<script>
import useForm from "::admin/Utils/useForm.js";
export default {
    name: "TwoFactor",
    setup() {
        const form = useForm({
            code: null,
            recovery_code: null,
        });

        return { form }
    },

    data() {
        return {
            recovery: false,
        };
    },

    methods: {
        toggleRecovery() {
            this.recovery ^= true;

            this.$nextTick(() => {
                if (this.recovery) {
                    this.form.code = "";
                } else {
                    this.form.recovery_code = "";
                }
            });
        },

        submit() {
            this.form.submit('post', this.route("two-factor.login"));
        },
    },
}
</script>

<style scoped>

</style>
