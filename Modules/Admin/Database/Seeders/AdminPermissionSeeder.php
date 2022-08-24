<?php

namespace Modules\Admin\Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Exceptions\PermissionAlreadyExists;
use Spatie\Permission\Models\Permission;

class AdminPermissionSeeder extends Seeder
{
    public function run()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = collect([
            'users',
            'users.create',
            'users.edit',
            'users.delete',
            'users.view',
            'users.bulk-delete',

            'roles',
            'roles.create',
            'roles.edit',
            'roles.delete',
            'roles.view',
            'roles.bulk-delete',

            'logs'
        ]);

        $permissions->each(function ($permission) {
            try {
            Permission::create(['name' => $permission, 'module' => 'admin']);
            } catch (PermissionAlreadyExists $e) {
                $this->command->info("Permission $permission already exists.");
            }
        });
    }
}
