<?php

namespace Modules\Admin\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use Inertia\Inertia;
use Spatie\QueryBuilder\QueryBuilder;

class BulletinController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Bulletin/Index', [
            'bulletins' => QueryBuilder::for(Bulletin::class)
                ->allowedFilters(['title', 'excerpt', 'markdown', 'html'])
                ->allowedSorts(['created_at', 'updated_at', 'id'])
                ->paginate()
                ->appends(request()->query())
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Bulletin/Create');
    }
}
