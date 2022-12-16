<?php

namespace Modules\Admin\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DeveloperController extends Controller
{
    public function index()
    {
        return Inertia::render('Developer/Index');
    }
}
