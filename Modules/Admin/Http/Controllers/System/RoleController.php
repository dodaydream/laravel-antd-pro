<?php

namespace Modules\Admin\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use App\Models\Role;
use Spatie\Permission\PermissionRegistrar;
use Spatie\QueryBuilder\QueryBuilder;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Role::class);
    }

    /**
     * @return Response
     */
    public function index()
    {
        return Inertia::render('System/Roles/Index', [
            'roles' => QueryBuilder::for(Role::class)
                ->withCount('permissions')
                ->paginate(
                    request('per_page', 10)
                )->appends(request()->query()),
        ]);
    }

    /**
     * @param Role $role
     * @return Response
     */
    public function show(Role $role)
    {
        return Inertia::render('System/Roles/Show', [
            'role' => $role,
            'rolePermissions' => $role->permissions()->pluck('id'),
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * @return Response
     */
    public function create()
    {
        return Inertia::render('System/Roles/Create', [
            'permissions' => Permission::all(),
        ]);
    }

    /**
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(Role $role)
    {
        $role->update(request()->validate([
            'name' => 'required|unique:roles,name,' . $role->id,
            'description' => 'nullable',
        ]));

        $role->syncPermissions(request('permissions'));

        activity()->performedOn($role)
            ->causedBy(auth()->user())
            ->withProperties([
                'name' => $role->name,
                'permissions' => $role->permissions()->pluck('name' ,'id'),
            ])
            ->log('update.permission');

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->back();
    }

    /**
     * @return RedirectResponse
     */
    public function store()
    {
        $role = Role::create(
            array_merge(
            request()->validate([
            'name' => 'required|unique:roles,name',
            'description' => 'nullable',
        ]), [
            'guard_name' => 'web',
        ]));

        $role->syncPermissions(request('permissions'));

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('admin.system.roles.show', $role);
    }

    /**
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role)
    {
        $role->delete();

        // FIXME: disassociate users
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return redirect()->route('admin.system.roles.index');
    }

    /**
     * @return RedirectResponse
     */
    public function bulkDestroy()
    {
        Role::destroy(request('ids'));

        return redirect()->route('admin.system.roles.index');
    }
}
