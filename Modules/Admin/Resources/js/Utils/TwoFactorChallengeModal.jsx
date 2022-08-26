import { defineComponent, createVNode, reactive, computed, ref, nextTick } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import useForm from './useForm';
import { trans } from 'laravel-vue-i18n'

import {
    Modal,
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
} from 'ant-design-vue';

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
    template: `
        <div>
            <p>{{ trans('two_factor_auth_request') }}</p>
            <a-form>
                <a-form-item name="code" v-bind="form.validation.code">
                    <a-input
                        :placeholder="trans('two_factor_auth_code')"
                        autocomplete="one-time-code"
                        v-model:value="form.code"
                        inputmode="numeric"
                        autofocus
                    >
                        <template #prefix>
                            <lock-outlined />
                        </template>
                    </a-input>
                </a-form-item>
            </a-form>
        </div>
    `,
    setup() {
        return { form, trans }
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

export default async () =>  {
    let dialogPromiseResolve, dialogPromiseReject;

    const dialogPromise = new Promise(function (resolve, reject) {
        dialogPromiseResolve = resolve;
        dialogPromiseReject = reject;
    })

    const vnode = createVNode(confirmPassword)

    modal.value = Modal.confirm({
        title: trans('two_factor_auth'),
        centered: true,
        content:  vnode,
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
