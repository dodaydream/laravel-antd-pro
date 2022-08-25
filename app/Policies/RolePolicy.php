<?php

namespace App\Policies;

use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class RolePolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('admin.system.roles.view');
    }

    public function view(User $user, Role $role): bool
    {
        return $user->can('admin.system.roles.view');
    }

    public function create(User $user): bool
    {
        return $user->can('admin.system.roles.create');
    }

    public function update(User $user, Role $role): bool
    {
        return $user->can('admin.system.roles.edit');
    }

    public function delete(User $user, Role $role): bool
    {
        return $user->can('admin.system.roles.delete');
    }

    public function bulkDelete(User $user): bool
    {
        return $user->can('admin.system.roles.bulk-delete');
    }

    public function restore(User $user, Role $role): bool
    {
    }

    public function forceDelete(User $user, Role $role): bool
    {
    }
}
