<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::name('admin.')->prefix('admin')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Login');
    })->name('login');

    Route::middleware([\Modules\Admin\Http\Middleware\Authenticate::class])->group(function () {
        Route::get('/', function () {
            return Inertia::render('Welcome');
        })->name('welcome');

        Route::name('system.')->prefix('/system')->group(function () {
            Route::resource('users', 'System\UserController')->names('users');
            Route::delete('users', 'System\UserController@bulkDestroy')->name('users.bulk-destroy');

            Route::resource('roles', 'System\RoleController')->names('roles');
            Route::delete('roles', 'System\RoleController@bulkDestroy')->name('roles.bulk-destroy');
            Route::resource('logs', 'System\LogController')->names('logs');
        });
    });
});
