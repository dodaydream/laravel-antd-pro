<template>
    <a-dropdown>
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center h-full">
          <a-avatar
              class="p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
              :src="$page.props.currentUser.avatar_thumb_url"
              size="large"
          />
            <div class="ml-2 leading-normal hidden md:block">
                <div class="font-bold">
                    {{ $page.props.currentUser.name }}
                </div>
                <div class="text-neutral-500">
                    {{ $page.props.currentUser.email }}
                </div>
            </div>
        </div>
        <template #overlay>
            <a-menu class="user-dropdown-menu-wrapper">
                <a-menu-item key="4">
                    <inertia-link :href="route('admin.profile.index')">
                        <UserOutlined />
                        {{ $t('layout.profile') }}
                    </inertia-link>
                </a-menu-item>
                <a-menu-item key="3">
                    <a @click="logout">
                        <LogoutOutlined />
                        {{ $t('layout.logout') }}
                    </a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
import {
    SettingOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons-vue'

export default {
    name: 'HeaderAvatar',
    components: {
        SettingOutlined,
        LogoutOutlined,
        UserOutlined,
    },
    methods: {
        logout () {
            this.$inertia.post(route('logout', {
                next: 'admin.login',
            }), {}, {
                onSuccess: () => {
                    this.$notification.success({
                        message: 'Logout success',
                        description: 'You have been logged out successfully.',
                    })
                }
            })
        }
    }
}
</script>

<style lang="less">
.header-avatar{
    display: inline-flex;
    .avatar, .name{
        align-self: center;
    }
    .avatar{
        margin-right: 8px;
    }
    .name{
        font-weight: 500;
    }
}
.avatar-menu{
    width: 150px;
}

</style>
