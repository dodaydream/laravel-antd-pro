<template>
    <ProfileLayout>
        <a-form layout="vertical" class="max-w-xl">
            <a-form-item label="Avatar" name="avatar">
                <avatar-cropper :user="user"/>
            </a-form-item>

            <a-form-item label="Name" name="name" v-bind="form.validation.name">
                <a-input v-model:value="form.name"/>
            </a-form-item>

            <a-form-item label="Email" name="email" v-bind="form.validation.email">
                <a-input v-model:value="form.email" type="email"/>
            </a-form-item>

            <a-form-item label="Password" name="password" v-bind="form.validation.password">
                <a-input-password v-model:value="form.password"/>
            </a-form-item>

            <a-form-item label="Password Confirmation" name="password_confirmation"
                         v-bind="form.validation.password_confirmation">
                <a-input-password v-model:value="form.password_confirmation"/>
            </a-form-item>

            <a-form-item>
                <div class="flex gap-3">
                    <a-button @click="submit">Save</a-button>
                </div>
            </a-form-item>
        </a-form>
    </ProfileLayout>
</template>

<script>
import useForm from "::admin/Utils/useForm.js";
import AvatarCropper from "../../Components/AvatarCropper.vue";
import ProfileLayout from "./ProfileLayout.vue";

export default {
    name: "Index",
    components: {ProfileLayout, AvatarCropper},
    props: {
        user: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const form = useForm({
            name: props.user.name,
            email: props.user.email,
            roles: props.user.roles,
            password: '',
            password_confirmation: ''
        })

        return { form }
    },
    methods: {
        submit() {
            this.form.submit(
                'put',
                route('admin.system.users.update', {
                    user: this.user.id
                }), {
                    onSuccess: () => this.$message.success('Profile updated successfully.')
                }
            )
        }
    }
}
</script>

<style scoped>

</style>
