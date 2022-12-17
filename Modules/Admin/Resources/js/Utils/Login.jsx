import { defineComponent, h, reactive, computed, ref, nextTick } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import useForm from './useForm';
import { trans } from 'laravel-vue-i18n'

import {
    Form as AForm,
    Input as AInput,
    FormItem as AFormItem,
    InputPassword as AInputPassword,
    Checkbox as ACheckbox,
} from 'ant-design-vue';

// NOTE: this is a workaround
// see: https://github.com/vueComponent/ant-design-vue/issues/5763
import Modal from 'ant-design-vue/lib/modal';

const form = useForm({
    email: '',
    password: '',
    remember: false,
}, {}, false);

const modal = ref(null);

const toggleLoginButtonStatus = () => {
    if (form.password !== '' && form.email !== '') {
        nextTick(() => {
            modal.value.update({
                okButtonProps: {
                    disabled: false
                }
            })
        })
    }
}

export const loginModal = defineComponent({
    components: {
        LockOutlined,
        AForm,
        AInput,
        AFormItem,
        ACheckbox,
        AInputPassword,
    },
    setup() {
        return { form, trans }
    },
    render () {
        return <div>
            <p>You have been away for a long time, please login again</p>
            <a-form class="!mt-3">
                <a-form-item name="email" {...form.validation.email}>
                    <a-input placeholder={trans('email_address')}
                             v-model:value={form.email}
                    />
                </a-form-item>
                <a-form-item name="password" {...form.validation.password}>
                    <a-input-password
                        autocomplete="new-password"
                        placeholder={trans('password')}
                        v-model:value={form.password}
                    >
                        <template slot="prefix">
                            <lock-outlined />
                        </template>
                    </a-input-password>
                </a-form-item>
                <a-form-item>
                    <a-checkbox v-model:checked={form.remember} >Remember Me</a-checkbox>
                </a-form-item>
            </a-form>
        </div>
    },
    watch: {
        'form.password': (val) => {
            toggleLoginButtonStatus();
        },
        'form.email': (val) => {
            toggleLoginButtonStatus();
        }
    }
})

export default async function () {
    let dialogPromiseResolve, dialogPromiseReject;

    const dialogPromise = new Promise(function (resolve, reject) {
        dialogPromiseResolve = resolve;
        dialogPromiseReject = reject;
    })

    modal.value = Modal.confirm({
        title: trans('login'),
        centered: true,
        content: h(loginModal),
        okText: 'Login',
        okButtonProps: {
            disabled: true
        },
        icon: null,
        async onOk() {
            nextTick(() => {
                modal.value.update({
                    okButtonProps: {
                        loading: true
                    }
                })
            })

            let promiseResolve, promiseReject;

            const promise = new Promise(function (resolve, reject) {
                promiseResolve = resolve;
                promiseReject = reject;
            })

            form.submit('post', route("login"), {
                preserveState: true,
                onSuccess: () => {
                    promiseResolve();
                    dialogPromiseResolve();
                    form.password = ''
                    form.email = ''
                },
                onError: (error) => {
                    promiseReject(error);
                    nextTick(() => {
                        modal.value.update({
                            okButtonProps: {
                                loading: false
                            }
                        })
                    })
                }
            })

            return await promise;
        },
        onCancel() {
            dialogPromiseReject('cancelled');
        }
    });

    return await dialogPromise;
}
