<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserDataController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Protected Dashboard & API Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('home');

    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Public Mobile & External API Routes (Sanctum Token Auth)
    Route::prefix('api/v1')->group(function () {
        // Authentication
        Route::post('/auth/login', [AuthController::class, 'login']);

        // Protected User Data Endpoints (Requires Bearer token)
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/auth/logout', [AuthController::class, 'logout']);
            Route::get('/auth/me', [AuthController::class, 'me']);

            // Data Provider Endpoints (Serves AngelOne data stored in DB)
            Route::get('/user/profile', [UserDataController::class, 'getProfile']);
            Route::get('/user/rms', [UserDataController::class, 'getRms']);
        });
    });
});
