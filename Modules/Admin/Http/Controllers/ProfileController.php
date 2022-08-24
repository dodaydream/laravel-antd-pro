<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('Profile/Index');
    }

    public function twoFactorAuthentication()
    {
        return Inertia::render('Profile/TwoFactorAuthentication');
    }

    public function activeSessions()
    {
        return Inertia::render('Profile/ActiveSessions');
    }
}
