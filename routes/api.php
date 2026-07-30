<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserDataController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes (v1)
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

Route::prefix('v1')->group(function () {

    // Public Mobile / External Authentication Routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected API Endpoints (Requires Sanctum Bearer Token)
    Route::middleware('auth:sanctum')->group(function () {

        // Session & User Info
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Data Provider Endpoints (Serves AngelOne Data from DB)
        Route::get('/user/profile', [UserDataController::class, 'getProfile']);
        Route::get('/user/rms', [UserDataController::class, 'getRms']);
    });
});
