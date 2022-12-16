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
        key: 'admin.admin',
        icon: 'BuildOutlined',
        title: 'layout.menu.admin',
        children: [
            {
                icon: 'UserOutlined',
                route: 'admin.admin.bulletins.index',
                key: 'admin.admin.bulletins',
                title: 'layout.menu.bulletins',
                permission: 'admin.system.users.view',
            }
        ]
    }
]
