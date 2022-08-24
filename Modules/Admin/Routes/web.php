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

    Route::get('language/{locale}', function ($locale) {
        app()->setLocale($locale);
        session()->put('locale', $locale);

        return response()->noContent();
    })->name('locale.update');

    Route::middleware([\Modules\Admin\Http\Middleware\Authenticate::class])->group(function () {
        Route::get('/', function () {
            return Inertia::render('Welcome');
        })->name('welcome');

        Route::name('profile.')->prefix('profile')->group(function () {
            Route::get('/', 'ProfileController@index')->name('index');
            Route::get('two-factor-authentication', 'ProfileController@twoFactorAuthentication')->name('two-factor-authentication');
            Route::get('active-sessions', 'ProfileController@activeSessions')->name('active-sessions');
        });

        Route::name('system.')->prefix('/system')->group(function () {
            Route::resource('users', 'System\UserController')->names('users');
            Route::delete('users', 'System\UserController@bulkDestroy')->name('users.bulk-destroy');
            Route::put('users/{user}/avatar', 'System\UserController@updateAvatar')->name('users.avatar');
            Route::get('users/{user}/sessions', 'System\UserController@sessions')->name('users.sessions');

            Route::resource('roles', 'System\RoleController')->names('roles');
            Route::delete('roles', 'System\RoleController@bulkDestroy')->name('roles.bulk-destroy');

            Route::resource('logs', 'System\LogController')->names('logs');
            Route::delete('logs', 'System\LogController@bulkDestroy')->name('logs.bulk-destroy');
        });
    });
});
