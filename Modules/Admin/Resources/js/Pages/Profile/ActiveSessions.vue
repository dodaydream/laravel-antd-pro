<template>
    <ProfileLayout>
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
