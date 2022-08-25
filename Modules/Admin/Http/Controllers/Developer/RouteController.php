<?php

namespace Modules\Admin\Http\Controllers\Developer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route as RouteFacade;
use Illuminate\Routing\Route;

class RouteController extends Controller
{
    public function index()
    {
        $this->authorize('admin.developer.route');

        return Inertia::render('Developer/Route', [
            'routes' => collect(RouteFacade::getRoutes())->map(function (Route $route) {
                return [
                    'name' => $route->getName(),
                    'methods' => $route->methods(),
                    'action' => $route->getActionName(),
                    'uri' => $route->uri(),
                    'middleware' => $route->middleware(),
                ];
            })
        ]);
    }
}
