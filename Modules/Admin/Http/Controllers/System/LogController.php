<?php

namespace Modules\Admin\Http\Controllers\System;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;
use Spatie\QueryBuilder\QueryBuilder;

class LogController extends Controller
{
    public function index()
    {
        $this->authorize('admin.system.logs');

        return Inertia::render('System/Logs/Index', [
            'logs' => QueryBuilder::for(Activity::class)
                ->latest()
                ->paginate(
                    request('per_page', 10)
                )->appends(request()->query()),
        ]);
    }
}
