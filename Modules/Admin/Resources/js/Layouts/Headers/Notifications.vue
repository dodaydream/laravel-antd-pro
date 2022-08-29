<template>
    <a-dropdown
        placement="bottomRight"
        trigger="click"
        v-model:visible="visible"
    >
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center">
            <a-tooltip placement="bottom">
                <template #title>
                    <span>{{ $t('layout.notifications') }}</span>
                </template>
            <a-button type="text" size="large">
                <template #icon>
                    <a-badge :count="notificationsCount">
                        <bell-outlined/>
                    </a-badge>
                </template>
            </a-button>
            </a-tooltip>
        </div>
        <template #overlay>
            <a-menu class="!p-0">
                <keep-alive>
                    <a-card class="!w-96 !border-0">
                        <template #title>
                            {{ $t('layout.notifications') }}
                        </template>
                        <template #extra>
                            <a-button type="link"
                                      class="!p-0"
                                      @click="markAllAsRead"
                                      :disabled="notificationsCount === 0"
                            >
                                {{ $t('layout.mark_all_as_read') }}
                            </a-button>
                        </template>

                        <perfect-scrollbar class="!h-full" :options="{ suppressScrollX: true }" ref="scroll">
                            <a-list :data-source="notifications" row-key="id" :loading="loading">
                                <transition-group name="list" v-if="notifications.length">
                                    <a-list-item class="!px-6"
                                                 v-for="item in notifications"
                                                 :key="item.id"
                                    >
                                        <a-list-item-meta>
                                            <template #title>
                                                {{ item.data.message }}
                                            </template>

                                            <template #description>
                                                {{
                                                        item.data.description
                                                    }}
                                            </template>
                                        </a-list-item-meta>

                                        <a-button @click="markAsRead(item)"
                                                  type="text"
                                                  shape="circle"
                                                  size="small"
                                                  class="!absolute right-6"
                                        >
                                            <template #icon>
                                                <CloseOutlined/>
                                            </template>
                                        </a-button>
                                    </a-list-item>
                                </transition-group>
                            </a-list>
                        </perfect-scrollbar>
                    </a-card>
                </keep-alive>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
import {
    CloseOutlined,
    CheckCircleOutlined,
    LoadingOutlined,
    CloseCircleOutlined,
    UploadOutlined,
    BellOutlined,
} from '@ant-design/icons-vue'

export default {
    name: "notifications",
    components: {
        BellOutlined,
        CheckCircleOutlined,
        CloseCircleOutlined,
        LoadingOutlined,
        CloseOutlined,
        UploadOutlined
    },
    data () {
        return {
            loading: true,
            notifications: null,
            visible: false,
            ref: null
        }
    },
    computed: {
        notificationsCount() {
            if (this.notifications != null) {
                return this.notifications.length
            }
            return this.$page.props.notificationsCount
        }
    },
    watch: {
        visible: function (val) {
            if (val) {
                if (this.notifications == null) {
                    this.loading = true
                    this.notifications = []
                }
                this.refreshNotifications()
                this.ref = setInterval(this.updateStatuses, 5000)
            } else {
                clearInterval(this.ref)
            }
        },
        'notifications.length': function (val) {
            this.$refs['scroll']?.ps.update()
            console.log(this.$refs['scroll'])
        }
    },
    methods: {
        async markAllAsRead() {
            this.notifications.forEach((notification, index) => {
                setTimeout(() => {
                    this.markAsRead(notification)
                }, 150 * index)
            })
            await window.axios.post(route('admin.notifications.read-all'))
        },
        async markAsRead (notification, sendRequest=true) {
            this.$nextTick(() => {
                const index = this.notifications.findIndex(j => j.id === notification.id)
                this.notifications.splice(index, 1)
            })

            if (sendRequest) {
                await window.axios.post(route('admin.notifications.read', {notification: notification.id}))
            }
        },
        refreshNotifications () {
            window.axios.get(route('admin.notifications.unread')).then(({data}) => {
                this.notifications = data.notifications
                this.loading = false
            })
        }
    }
}
</script>

<style scoped>
:deep(.ant-card-body) {
    padding: 0;
    @apply h-96;
}

:deep(.ant-list-item-action) {
    @apply ml-4;
}

:deep(.ant-list-item) {
    align-items: start;
    @apply hover:bg-gray-50;
}

:deep(.ant-list-item-action) > li {
    padding: 0;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>
