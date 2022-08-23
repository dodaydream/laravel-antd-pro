export default [
    {
        key: 'admin.system',
        icon: 'SettingOutlined',
        title: 'System Settings',
        children: [
            {
                icon: 'UserOutlined',
                route: 'admin.system.users.index',
                key: 'admin.system.users',
                title: 'Users'
            },
            {
                icon: 'ApartmentOutlined',
                key: 'admin.system.roles',
                route: 'admin.system.roles.index',
                title: 'Roles'
            },
            {
                icon: 'DatabaseOutlined',
                key: 'admin.system.logs',
                route: 'admin.system.logs.index',
                title: 'Logs'
            }
        ]
    },
]
