import { defineComponent, h, reactive, computed, ref, nextTick } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import useForm from './useForm';
import { trans } from 'laravel-vue-i18n'

import {
    Form as AForm,
    FormItem as AFormItem,
    InputPassword as AInputPassword,
} from 'ant-design-vue';

// NOTE: this is a workaround
// see: https://github.com/vueComponent/ant-design-vue/issues/5763
import Modal from 'ant-design-vue/lib/modal';

const form = useForm({
    password: '',
}, {}, false);

const modal = ref(null);

export const confirmPassword = defineComponent({
    components: {
        LockOutlined,
        AForm,
        AFormItem,
        AInputPassword,
    },
    setup() {
        return { form, trans }
    },
    render () {
        return <div>
            <p> {trans('please_confirm_your_password_before_continuing') }</p>
            <a-form>
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
            </a-form>
        </div>
    },
    watch: {
        'form.password': (val) => {
            if (val !== '') {
                nextTick(() => {
                    modal.value.update({
                        okButtonProps: {
                            disabled: false
                        }
                    })
                })
            }
        }
    }
})

export default async function (forceReconfirm=false) {
    let dialogPromiseResolve, dialogPromiseReject;

    const dialogPromise = new Promise(function (resolve, reject) {
        dialogPromiseResolve = resolve;
        dialogPromiseReject = reject;
    })

    if (!forceReconfirm) {
        console.debug('check if recently confirmed')

        const confirmed = await axios.get(route("password.confirmation")).then((response) => {
            return response.data.confirmed;
        })

        if (confirmed) {
            dialogPromiseResolve();
            return await dialogPromise;
        }
    }

    modal.value = Modal.confirm({
        title: trans('confirm_password'),
        centered: true,
        content: h(confirmPassword),
        okButtonProps: {
            disabled: true
        },
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

            form.submit('post', route("password.confirm"), {
                preserveState: true,
                onSuccess: () => {
                    promiseResolve();
                    dialogPromiseResolve();
                    form.password = ''
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
