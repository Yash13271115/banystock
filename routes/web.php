<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\AngelOneProfile;
use App\Models\AngelOneRms;
use App\Models\AngelOneTopGainer;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes (CRM Portal)
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group.
|
*/

// Authentication Routes (Guest Only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
});

// Protected CRM Portal Routes (Session Auth)
Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    $renderDashboard = function () {
        $topGainers = AngelOneTopGainer::all();
        $profile = AngelOneProfile::latest()->first();
        $rms = AngelOneRms::latest()->first();

        return Inertia::render('dashboard', [
            'topGainers' => $topGainers,
            'profile' => $profile,
            'rms' => $rms,
        ]);
    };

    Route::get('/', $renderDashboard)->name('home');
    Route::get('/dashboard', $renderDashboard)->name('dashboard');
});
