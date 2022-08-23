<?php

namespace Modules\Admin\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('System/Users/Index', [
            'users' => QueryBuilder::for(User::class)
                ->with('roles')
                ->allowedFilters(['name', 'email'])
                ->allowedSorts(['name', 'email'])
                ->paginate(
                    request('per_page', 10)
                )->appends(request()->query()),
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->user()->id) {
            return redirect()->back()->with('message', 'You cannot delete yourself.');
        }

        $user->delete();

        return redirect()->back();
    }

    public function show(User $user)
    {
        $user->roles = $user->roles()->pluck('id');

        return Inertia::render('System/Users/Show', [
            'user' => $user,
            'roles' => Role::all(),
        ]);
    }

    public function update(User $user)
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'roles' => ['required', 'array', 'exists:roles,id'],
        ]);

        if ($validated['password'] !== null) {
            $validated['password'] = Hash::make(request('password'));
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        $user->roles()->sync(request('roles'));

        return redirect()->back();
    }

    /**
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkDestroy()
    {
        if (in_array(auth()->user()->id, request('ids'))) {
            return redirect()->back()->with('message', 'You cannot delete yourself.');
        }

        User::destroy(request('ids'));

        return redirect()->back();
    }
}
