<?php

namespace Modules\Admin\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\Admin\Jobs\TrackableJob;
use Modules\Admin\Notifications\TestNotification;

class MiscController extends Controller
{
    public function index()
    {
        return Inertia::render('Developer/Misc');
    }

    public function dispatchJob()
    {
        $job = new TrackableJob([]);
        dispatch($job);

        return redirect()->back();
    }

    public function sendNotification()
    {
        $user = auth()->user();
        $user->notify(new TestNotification());

        return redirect()->back();
    }
}
