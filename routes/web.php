<?php

use App\Http\Controllers\Api\AngelOneController;
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

    // AngelOne SmartAPI Integration Routes
    Route::prefix('api/angelone')->group(function () {
        Route::post('/login', [AngelOneController::class, 'login']);
        Route::get('/profile', [AngelOneController::class, 'getProfile']);
        Route::get('/rms', [AngelOneController::class, 'getRms']);
    });
});
