<template>
    <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" :src="user.avatar" />
          <span class="ml-2">{{ user.name }}</span>
        </span>
        <template #overlay>
            <a-menu class="user-dropdown-menu-wrapper">
                <a-menu-item key="4">
                    <a>
                        <SettingOutlined />
                        Settings
                    </a>
                </a-menu-item>
                <a-menu-item key="3">
                    <a @click="logout">
                        <LogoutOutlined />
                        Logout
                    </a>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script>
// import {logout} from '@/services/user'
import {
    SettingOutlined,
    LogoutOutlined,
} from '@ant-design/icons-vue'

export default {
    name: 'HeaderAvatar',
    components: {
        SettingOutlined,
        LogoutOutlined,
    },
    props: {
        user: {
            default: () => {
                return {
                    avatar: '',
                    name: 'User Name',
                }
            }
        }
    },
    methods: {
        logout() {
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
