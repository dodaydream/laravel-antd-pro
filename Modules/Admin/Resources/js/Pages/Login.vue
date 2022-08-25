<template>
    <div class="h-screen w-screen bg-slate-100 flex items-center justify-center">
        <div class="max-w-sm w-full p-4">
            <h1 class="text-lg font-bold text-center">Laravel Antd Pro</h1>
            <p class="text-slate-500 text-base text-center mb-12">Welcome to Laravel Antd Pro</p>
            <a-form>
                <a-form-item name="email" v-bind="form.validation.email">
                    <a-input
                        placeholder="Email Address"
                        v-model:value="form.email"
                        size="large"
                    >
                        <template #prefix>
                            <UserOutlined />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item name="password" v-bind="form.validation.password">
                    <a-input-password placeholder="Password" size="large" v-model:value="form.password"
                                      @keydown.enter="login">
                    >
                        <template #prefix>
                            <LockOutlined />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-checkbox name="remember" v-model:checked="form.remember">Remember Me</a-checkbox>

                    <inertia-link :href="route('password.request')" class="float-right">Forget Password?</inertia-link>
                </a-form-item>

                <a-form-item>
                    <a-button @click="login" block type="primary" size="large">Login</a-button>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script>
import useForm from '../Utils/useForm.js'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default {
    name: "Login",
    components: {
        UserOutlined,
        LockOutlined
    },
    setup () {
        const form = useForm({
            email: '',
            password: '',
            remember: false
        }, {
            email: [
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入正确的邮箱' }
            ],
            password: [
                { required: true, message: '请输入密码' }
            ]
        })

        return { form }
    },
    methods: {
        login () {
            this.form.submit('post', route('login', {
                ref: 'admin.welcome'
            }), {
                onSuccess: (result) => {
                    this.$notification.success({
                        message: 'Login Success',
                        description: 'Welcome back!'
                    })
                }
            })
        }
    }
}
</script>
