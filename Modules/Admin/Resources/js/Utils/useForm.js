import {Form, Modal} from 'ant-design-vue'

const AntUseForm = Form.useForm;

import { useForm as InertiaUseForm } from '@inertiajs/inertia-vue3'

import { reactive, nextTick } from 'vue'

export default function (props, rules={}, useInertia=true) {
    const inertiaForm = InertiaUseForm(props)

    const {
        resetFields,
        validate,
        validateInfos,
        clearValidate
    } = AntUseForm(inertiaForm, reactive(rules))

    const displayError = (errors) => {
        console.debug('displayError', errors)
        Object.keys(errors).forEach(field => {
            if (!validateInfos[field]) {
                validateInfos[field] = {}
            }

            validateInfos[field].help = [[ inertiaForm.errors[field] ]]
            validateInfos[field].validateStatus = "error"
        })
    }

    /**
     * @param params
     */
    const resetDisplayError = (...params) => {
        if (params.length) {
            for (let field of params) {
                validateInfos[field] = {}
            }
        } else {
            Object.keys(inertiaForm.validation).forEach(field => {
                validateInfos[field] = {}
            })
        }
    }

    const onError = (onErrorHandler, errorTransformer) => {
        return (errors) => {
            if (onErrorHandler) {
                onErrorHandler(errors)
            }

            if (errorTransformer) {
                displayError(errorTransformer(errors))
            } else {
                displayError(errors)
            }
        }
    }

    const inertiaSubmit = inertiaForm.submit.bind(inertiaForm)
    const inertiaReset = inertiaForm.reset.bind(inertiaForm)

    const axiosSubmit = function (method, url, options) {
        window.axios({
            method: method,
            url: url,
            data: inertiaForm.data()
        }).then(({data}) => {
            options.onSuccess && options.onSuccess(data)
        }).catch((error) => {
            if (error.response?.status === 422) {
                const errorHandler = onError(options.onError, options.errorTransformer)

                // form validation errors
                const errors = error.response.data.errors

                for (let key in errors) {
                    errors[key] = errors[key][0]
                }

                inertiaForm.errors = errors
                errorHandler(errors)
            } else {
                return Promise.reject(error)
            }
        })
    }

    const submit = function (method, url, options={}) {
        // FIXME: this is a workaround for ant-design-vue v2.2.2
        // @see: https://github.com/vueComponent/ant-design-vue/issues/4238
        clearValidate(Object.keys(validateInfos))

        const submitHandler = useInertia ? inertiaSubmit : axiosSubmit

        validate().then(() => {
            submitHandler(method, url, {
                ...options,
                onError: onError(options.onError, options.errorTransformer)
            })
        }).catch((e) => {
            if (e.errorFields.length === 0) {
                submitHandler(method, url, {
                    ...options,
                    onError: onError(options.onError, options.errorTransformer)
                })
            } else {
              if (options.onValidateError) {
                options.onValidateError()
              }
            }
        })
    }

    /**
     * Reset form
     *
     * @param params fields to reset
     */
    const reset = function (...params) {
        nextTick(() => {
            if (params.length) {
                resetDisplayError(...params)
                clearValidate(...params)
                inertiaReset(...params)
            } else {
                resetDisplayError()
                clearValidate()
                inertiaReset()
            }
        })
    }

    inertiaForm.validation = validateInfos
    inertiaForm.submit = submit
    inertiaForm.reset = reset
    inertiaForm.validate = validate
    inertiaForm.layout = {
      colon: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }

    return inertiaForm
}
