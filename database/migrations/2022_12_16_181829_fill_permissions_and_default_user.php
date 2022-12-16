<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    protected $permissions = [
        'admin',
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

        'admin.admin.bulletins.create',
        'admin.admin.bulletins.edit',
        'admin.admin.bulletins.delete',
        'admin.admin.bulletins.view',
        'admin.admin.bulletins.bulk-delete',

        'admin.system.logs'
    ];

    public function __construct()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
    }

    public function up()
    {
        $user = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'email_verified_at' => now()
        ]);

        collect($this->permissions)->each(function ($permission) {
            Permission::create(['name' => $permission, 'module' => 'admin']);
        });

        Role::findOrCreate('role.super-admin')->givePermissionTo($this->permissions);
        $user->assignRole('role.super-admin');
    }

    public function down()
    {
        $user = User::where('email', 'admin@example.com')->first();

        Role::findOrCreate('role.super-admin')->revokePermissionTo($this->permissions);
        Role::where('name', 'role.super-admin')->delete();

        collect($this->permissions)->each(function ($permission) {
            Permission::where('name', $permission)->delete();
        });

        $user->removeRole('role.super-admin');
        $user->delete();
    }
};
