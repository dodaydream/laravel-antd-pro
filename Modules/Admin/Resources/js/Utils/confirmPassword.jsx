import { defineComponent, createVNode, reactive, computed, ref, nextTick } from 'vue';
import { LockOutlined } from '@ant-design/icons-vue';
import useForm from './useForm';

import {
    Modal,
    Form as AForm,
    FormItem as AFormItem,
    InputPassword as AInputPassword,
} from 'ant-design-vue';

const form = useForm({
    password: '',
}, {}, false);

const modal = ref(null);

const confirmPassword = defineComponent({
    components: {
        LockOutlined,
        AForm,
        AFormItem,
        AInputPassword,
    },
    template: `
        <div>
            <p>Please confirm your password before continuing.</p>
            <a-form>
                <a-form-item name="password" v-bind="form.validation.password">
                    <a-input-password
                        placeholder="Password"
                        autocomplete="new-password"
                        v-model:value="form.password"
                    >
                        <template #prefix>
                            <lock-outlined />
                        </template>
                    </a-input-password>
                </a-form-item>
            </a-form>
        </div>
    `,
    setup() {
        return { form }
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

    const vnode = createVNode(confirmPassword)

    modal.value = Modal.confirm({
        title: 'Confirm Password',
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
