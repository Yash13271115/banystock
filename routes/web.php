<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Authentication Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

// Protected Dashboard Routes
Route::get('/', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }
    return Inertia::render('dashboard');
})->name('home');

Route::get('/dashboard', function () {
    if (! auth()->check()) {
        return redirect()->route('login');
    }
    return Inertia::render('dashboard');
})->name('dashboard');
