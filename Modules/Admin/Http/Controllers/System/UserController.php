<?php

namespace Modules\Admin\Http\Controllers\System;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Jenssegers\Agent\Agent;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileDoesNotExist;
use Spatie\MediaLibrary\MediaCollections\Exceptions\FileIsTooBig;
use Spatie\QueryBuilder\QueryBuilder;

class UserController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

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
            'roles' => ['nullable', 'array', 'exists:roles,id'],
        ]);

        if ($validated['password'] !== null) {
            $validated['password'] = Hash::make(request('password'));
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if (isset($validated['roles'])) {
            $user->roles()->sync(request('roles'));
        }

        return redirect()->back();
    }

    /**
     * @return RedirectResponse
     */
    public function bulkDestroy()
    {
        if (in_array(auth()->user()->id, request('ids'))) {
            return redirect()->back()->with('message', 'You cannot delete yourself.');
        }

        User::destroy(request('ids'));

        return redirect()->back();
    }

    /**
     * @param Request $request
     * @param User $user
     * @return RedirectResponse
     */
    public function updateAvatar(Request $request, User $user)
    {
        request()->validate([
            'avatar' => ['required', 'image', 'mimes:png'],
        ]);

        try {
            $user->addMedia($request->file('avatar'))
                ->usingFileName(uniqid('avatar-').'.png')
                ->toMediaCollection('avatar');
        } catch (FileDoesNotExist $e) {
            return redirect()->back()->with('message', 'File does not exist.');
        } catch (FileIsTooBig $e) {
            return redirect()->back()->with('message', 'File is too big.');
        }

        return redirect()->back();
    }

    /**
     * Get the current sessions.
     *
     * @param Request $request
     * @param User $user
     * @return Collection
     */
    public function sessions(Request $request, User $user)
    {
        if (config('session.driver') !== 'database') {
            return collect();
        }

        return collect(
            DB::connection(config('session.connection'))->table(config('session.table', 'sessions'))
                ->where('user_id', $user->id)
                ->orderBy('last_activity', 'desc')
                ->get()
        )->map(function ($session) use ($request) {
            $agent = $this->createAgent($session);

            return (object) [
                'agent' => [
                    'is_desktop' => $agent->isDesktop(),
                    'platform' => $agent->platform(),
                    'browser' => $agent->browser(),
                ],
                'ip_address' => $session->ip_address,
                'is_current_device' => $session->id === $request->session()->getId(),
                'last_active' => Carbon::createFromTimestamp($session->last_activity)->diffForHumans(),
            ];
        });
    }

    public function create()
    {
        return Inertia::render('System/Users/Create', [
            'roles' => Role::all(),
        ]);
    }

    public function store()
    {
        $validated = request()->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'roles' => ['nullable', 'array', 'exists:roles,id'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->route('admin.system.users.show', $user);
    }

    /**
     * Create a new agent instance from the given session.
     *
     * @param  mixed  $session
     * @return \Jenssegers\Agent\Agent
     */
    protected function createAgent($session)
    {
        return tap(new Agent, function ($agent) use ($session) {
            $agent->setUserAgent($session->user_agent);
        });
    }
}
