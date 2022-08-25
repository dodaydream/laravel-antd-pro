<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

class UserPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->can('admin.system.users.view');
    }

    public function view(User $user, User $model): bool
    {
        return $user->can('admin.system.users.edit');
    }

    public function create(User $user): bool
    {
        return $user->can('admin.system.users.create');
    }

    public function update(User $user, User $model): bool
    {
        return $user->can('admin.system.users.edit');
    }

    public function delete(User $user, User $model): bool
    {
        return $user->can('admin.system.users.delete');
    }

    public function bulkDelete(User $user): bool
    {
        return $user->can('admin.system.users.bulk-delete');
    }

    public function restore(User $user, User $model): bool
    {
    }

    public function forceDelete(User $user, User $model): bool
    {
    }
}
