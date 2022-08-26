<?php

namespace Modules\Admin\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\Admin\Jobs\TrackableJob;

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
}
