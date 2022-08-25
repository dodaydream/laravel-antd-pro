export default [
    {
        key: 'admin.system',
        icon: 'SettingOutlined',
        title: 'admin::layout.menu.system_settings',
        children: [
            {
                icon: 'UserOutlined',
                route: 'admin.system.users.index',
                key: 'admin.system.users',
                title: 'admin::layout.menu.users',
            },
            {
                icon: 'ApartmentOutlined',
                key: 'admin.system.roles',
                route: 'admin.system.roles.index',
                title: 'admin::layout.menu.roles',
            },
            {
                icon: 'DatabaseOutlined',
                key: 'admin.system.logs',
                route: 'admin.system.logs.index',
                title: 'admin::layout.menu.logs',
            }
        ]
    },
    {
        key: 'admin.developer',
        icon: 'CodeOutlined',
        title: 'admin::layout.menu.developer',
        children: [
            {
                icon: 'NodeIndexOutlined',
                key: 'admin.developer.routes',
                route: 'admin.developer.routes',
                title: 'admin::layout.menu.route',
            }
        ]
    }
]
