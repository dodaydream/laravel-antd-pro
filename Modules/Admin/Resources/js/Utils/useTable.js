import {
    h,
    reactive,
    resolveComponent,
    computed,
    ref,
    createVNode
} from 'vue'
import { Inertia } from '@inertiajs/inertia'
import {ExclamationCircleOutlined} from "@ant-design/icons-vue";
import { Modal } from 'ant-design-vue'

/**
 * Traits of using table
 *
 * @param binding data source
 * @param options
 *
 * options.fieldName
 * options.selectable
 */
export default function (binding, options) {
    const reserved = ['keyword', 'sort', 'order', 'page', 'size']

    const filtered = ref({});
    const sorted = ref({});

    const loading = ref(false);

    const items = ref(binding.data);

    const selectedRowKeys = reactive([]);

    let url = new URL(window.location.href)

    const syncColumnFilters = () => {
        const filters = {}
        for (const [param, value] of url.searchParams) {
            if (!reserved.includes(param)) {
                filters[param] = value.split(',')
            }
        }
        filtered.value = filters
    }

    const syncColumnSorter = () => {
        if (url.searchParams.has('sort') && url.searchParams.has('order')) {
            sorted.value = {
                columnKey: url.searchParams.get('sort'),
                order: url.searchParams.get('order') === 'asc' ? 'ascend' : 'descend'
            }
        }
    }

    syncColumnFilters();
    syncColumnSorter();

    const pagination = ref({
        total: binding.total,
        current: binding.current_page,
        pageSize: binding.per_page,
        showSizeChanger: true,
        hideOnSinglePage: true
    })

    const setPagination = (data) => {
        pagination.value.total = data.total
        pagination.value.current = data.current_page
        pagination.value.pageSize = data.per_page
    }


    const onPaginationChange = (page, pageSize) => {
        loading.value = true
        Inertia.get(url.href, {
            ...(page && {page: page}),
            ...(pageSize && {per_page: pageSize})
        }, {
            preserveState: true,
            onSuccess: (page) => {
                loading.value = false
                setPagination(page.props[options.fieldName])
                items.value = page.props[options.fieldName].data
            }
        })
    }

    pagination.value.onChange = onPaginationChange
    pagination.value.onShowSizeChange = onPaginationChange

    const search = reactive({
        keyword: url.searchParams.get('keyword') ?? '' ,
        apply (keyword) {
            loading.value = true
            url = new URL(window.location.href)
            url.search = ''
            Inertia.get(url.href, {
                ...( keyword && { keyword: keyword} )
            },  {
                onSuccess: () => {
                    loading.value = false
                }
            })
        },
    })

    const filter = (filters) => {
        const filtersClone = Object.assign({}, filters)
        Object.keys(filtersClone).forEach(function (key) {
            if (typeof filtersClone[key] == 'object') {
                filtersClone[key] = filtersClone[key].join()
            } if (filtersClone[key] === "") {
                delete filtersClone[key]
            }
        })
        return filtersClone
    }

    const sort = (sorter) => {
        if (!sorter.order) {
            return {}
        }

        return {
            ...( sorter.order && { order: sorter.order === 'ascend' ? 'asc' : 'desc' }),
            ...( sorter.columnKey && { sort: sorter.columnKey })
        }
    }

    const navigateToPage = (payload={}) => {
        loading.value = true
        Inertia.get(url.href, {
            ...filter(filtered.value),
            ...sort(sorted.value),
            ...payload,
            // omit default page size and first page
            ...( (pagination.current && pagination.pageSize !== 1) && { page: pagination.current }),
            ...( (pagination.pageSize && pagination.pageSize !== 10) && { per_page: pagination.pageSize }),
            ...( search.keyword && { keyword: search.keyword } )
        },  {
            preserveState: true,
            onSuccess: (page) => {
                loading.value = false
                setPagination(page.props[fieldName])
            }
        })
    }

    const change = (pag, criteria, sorter) => {
        // TODO: update pagination from
        url.search = ''

        filtered.value = criteria
        sorted.value = sorter
        pagination.value = pag
        loading.value = true

        Inertia.get(url.href, {
            ...filter(criteria),
            ...sort(sorter),
            ...( pag.current && { page: pag.current }),
            ...( pag.pageSize !== 10 && { per_page: pag.pageSize }),
            ...( search.keyword && { keyword: search.keyword } )
        },  {
            preserveState: true,
            onSuccess: (page) => {
                loading.value = false
                setPagination(page.props[fieldName])
            }
        })
    }

    const applyFilter = (filters) => {
        // reset to first page
        pagination.value.current = 1
        sorted.value = {}
        filtered.value = filters
        // navigate to url
        navigateToPage()
    }

    const applyRangeFilter = (field, value) => {
        pagination.value.current = 1
        sorted.value = {}

        const payload = {}
        payload[field] = value.join(':')

        navigateToPage(payload)
    }


    const onSelectChange = (newKeys) => {
        selection.selectedRowKeys = newKeys
    }

    const selection = reactive({
        selectedRowKeys: [],
        onChange: onSelectChange,
        clear () {
            selection.selectedRowKeys = []
        },
        selected: computed(() => {
            return selection.selectedRowKeys.length !== 0
        }),
        count: computed(() => {
            return selection.selectedRowKeys.length
        }),
        destroy (handler) {
                Modal.confirm({
                    title: 'Are you sure to delete these records?',
                    icon: createVNode(ExclamationCircleOutlined),
                    content: 'You will not be able to recover these records!',
                    okText: 'Yes',
                    cancelText: 'No',
                    onOk: handler
                });
        }
    })

    const navigate = (params) => {
        Inertia.replace(route(route().current(), params))
    }

    const action = {
        // TODO: fixme
        remove (id) {
            // pass redirection,
            // redirect
            // if last page item of page, go to previous page
            // if first page last item, refresh page only
            navigate(params)
        }
    }

    return reactive({
        rowSelection: options.selectable ? selection : null,
        rowKey: options.rowKey ?? 'id',
        scroll: {x: true},
        pagination,
        // onPaginationChange,
        search,
        filtered,
        sorted,
        change,
        action,
        loading,
        applyFilter,
        applyRangeFilter,
        dataSource: items
    })
}
