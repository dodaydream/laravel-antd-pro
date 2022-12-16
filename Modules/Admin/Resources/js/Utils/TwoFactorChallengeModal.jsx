import {defineComponent, createVNode, reactive, computed, ref, nextTick, withModifiers} from 'vue';
import {LockOutlined} from '@ant-design/icons-vue';
import useForm from './useForm';
import {trans} from 'laravel-vue-i18n'

import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
} from 'ant-design-vue';

// NOTE: this is a workaround
// see: https://github.com/vueComponent/ant-design-vue/issues/5763
import Modal from 'ant-design-vue/lib/modal';

const form = useForm({
    code: '',
}, {});

const modal = ref(null);

const confirmPassword = defineComponent({
    components: {
        LockOutlined,
        AForm,
        AFormItem,
        AInput,
    },
    render() {
        return <div>
            <p>{trans('two_factor_auth_request')}</p>
            <a-form>
                <a-form-item name="code" {...form.validation.code}>
                    <a-input
                        autocomplete="one-time-code"
                        inputmode="numeric"
                        placeholder={trans('two_factor_auth_code')}
                        v-model:value={form.code}
                        autofocus
                    >
                        <template slot="prefix">
                            <lock-outlined/>
                        </template>
                    </a-input>
                </a-form-item>
            </a-form>
        </div>
    },
    setup() {
        return {form, trans}
    },
    watch: {
        'form.code': (val) => {
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

export default async () => {
    let dialogPromiseResolve, dialogPromiseReject;

    const dialogPromise = new Promise(function (resolve, reject) {
        dialogPromiseResolve = resolve;
        dialogPromiseReject = reject;
    })

    const vnode = createVNode(confirmPassword)

    modal.value = Modal.confirm({
        title: trans('two_factor_auth'),
        centered: true,
        content: vnode,
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

            form.submit('post', route("two-factor.login"), {
                onSuccess: () => {
                    promiseResolve();
                    dialogPromiseResolve();
                    form.code = ''
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
