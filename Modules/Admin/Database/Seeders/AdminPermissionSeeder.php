<?php

namespace Modules\Admin\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AdminPermissionSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = collect([
            'admin.system.users.create',
            'admin.system.users.edit',
            'admin.system.users.delete',
            'admin.system.users.view',
            'admin.system.users.bulk-delete',

            'admin.system.roles.create',
            'admin.system.roles.edit',
            'admin.system.roles.delete',
            'admin.system.roles.view',
            'admin.system.roles.bulk-delete',

            'admin.system.logs',
            'admin.developer.route',
        ]);

        $permissions->each(function ($permission) {
            try {
            Permission::create(['name' => $permission, 'module' => 'admin']);
            } catch (PermissionAlreadyExists $e) {
                $this->command->info("Permission $permission already exists.");
            }
        });

        Role::findOrCreate('role.super-admin')->givePermissionTo($permissions);
    }
}
