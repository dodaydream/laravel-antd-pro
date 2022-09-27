<?php

use Illuminate\Support\Facades\Route;
use Imtigger\LaravelJobStatus\JobStatus;
use Inertia\Inertia;
use Modules\Admin\Jobs\TrackableJob;

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
        if (auth()->check()) {
            return redirect()->route('admin.welcome');
        }

        return Inertia::render('Login');
    })->name('login');

    Route::get('language/{locale}', 'Api\LocaleController@index')->name('locale.update');

    Route::middleware(['can:admin', \Modules\Admin\Http\Middleware\Authenticate::class])->group(function () {
        Route::get('/', 'DashboardController@index')->name('welcome');

        Route::prefix('/jobs')->name('jobs.')->group(function () {
            Route::delete('/dismiss-all-finished', 'Api\JobController@dismissAllFinished')->name('dismiss-all-finished');
            Route::get('/statuses', 'Api\JobController@jobStatuses')->name('statuses');
            Route::delete('/{jobStatus}', 'Api\JobController@remove')->name('remove');
        });

        Route::prefix('/notifications')->name('notifications.')->group(function () {
            Route::get('/unread', 'Api\NotificationController@unreadNotifications')->name('unread');
            Route::post('/{notification}/read', 'Api\NotificationController@markAsRead')->name('read');
            Route::post('/read-all', 'Api\NotificationController@markAllAsRead')->name('read-all');
        });

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

        Route::name('admin.')->prefix('/admin')->group(function () {
            Route::resource('bulletin', 'Admin\BulletinController')->names('bulletins');
            Route::post('bulletin/{bulletin}/images', 'Admin\BulletinController@uploadImage')->name('bulletins.upload-image');
            Route::delete('bulletins', 'Admin\BulletinController@bulkDestroy')->name('bulletins.bulk-destroy');
            Route::post('bulletins/{bulletin}/publish', 'Admin\BulletinController@publish')->name('bulletins.publish');
        });

        Route::name('developer.')->prefix('/developer')->group(function () {
            Route::get('/routes', 'Developer\RouteController@index')->name('routes');
            Route::get('/misc', 'Developer\MiscController@index')->name('misc');
            Route::get('/misc/dispatch-job', 'Developer\MiscController@dispatchJob')->name('misc.dispatch-job');
            Route::get('/misc/send-notification', 'Developer\MiscController@sendNotification')->name('misc.send-notification');
        });
    });

    // Route::mediaLibrary('media');
});
