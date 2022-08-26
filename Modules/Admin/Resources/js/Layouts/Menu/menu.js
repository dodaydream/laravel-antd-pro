export default [
    {
        key: 'admin.system',
        icon: 'SettingOutlined',
        title: 'layout.menu.system_settings',
        children: [
            {
                icon: 'UserOutlined',
                route: 'admin.system.users.index',
                key: 'admin.system.users',
                title: 'layout.menu.users',
                permission: 'admin.system.users.view',
            },
            {
                icon: 'ApartmentOutlined',
                key: 'admin.system.roles',
                route: 'admin.system.roles.index',
                title: 'layout.menu.roles',
                permission: 'admin.system.roles.view',
            },
            {
                icon: 'DatabaseOutlined',
                key: 'admin.system.logs',
                route: 'admin.system.logs.index',
                title: 'layout.menu.logs',
                permission: 'admin.system.logs',
            }
        ]
    },
    {
        key: 'admin.developer',
        icon: 'CodeOutlined',
        title: 'layout.menu.developer',
        children: [
            {
                icon: 'NodeIndexOutlined',
                key: 'admin.developer.routes',
                route: 'admin.developer.routes',
                title: 'layout.menu.route',
                permission: 'admin.developer.route',
            },
            {
                icon: 'ThunderboltOutlined',
                key: 'admin.developer.misc',
                route: 'admin.developer.misc',
                title: 'layout.menu.misc',
                permission: 'admin.developer.misc',
            }
        ]
    }
]
