<?php

namespace Modules\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Modules\Admin\Charts\TotalUsersChart;

class DashboardController extends Controller
{
    public function index(TotalUsersChart $chart)
    {
        return Inertia::render('Welcome', [
            'top4Charts' => [
                $chart->build(),
            ]
        ]);
    }
}
