<template>
    <a-dropdown>
        <div class="action ant-dropdown-link user-dropdown-menu flex items-center">
          <a-avatar
              class="avatar ring-1 ring-slate-200"
              :src="$page.props.user.avatar_thumb_url"
              size="large"
          />
            <div class="ml-2 leading-normal">
                <div class="font-medium">
                    {{ $page.props.user.name }}
                </div>
                <div class="text-slate-500">
                    {{ $page.props.user.email }}
                </div>
            </div>
        </div>
        <template #overlay>
            <a-menu class="user-dropdown-menu-wrapper">
                <a-menu-item key="4">
                    <a>
                        <UserOutlined />
                        {{ i18n.trans('admin::layout.profile') }}
                    </a>
                </a-menu-item>
                <a-menu-item key="3">
                    <a @click="logout">
                        <LogoutOutlined />
                        {{ i18n.trans('admin::layout.logout') }}
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
            this.$inertia.post(route('logout'), {
                onSuccess () {
                    this.$message.success('Logout success')
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
