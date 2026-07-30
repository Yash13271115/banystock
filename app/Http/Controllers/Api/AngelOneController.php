<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AngelOneProfile;
use App\Models\AngelOneRms;
use App\Services\AngelOneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AngelOneController extends Controller
{
    public function __construct(public AngelOneService $angelOneService) {}

    /**
     * Authenticate with AngelOne SmartAPI and automatically fetch/save Profile and RMS.
     */
    public function login(Request $request): JsonResponse
    {
        $clientCode = $request->input('client_code', config('services.angelone.client_code', env('ANGELONE_CLIENT_CODE')));
        $password = $request->input('password', config('services.angelone.password', env('ANGELONE_PASSWORD')));
        $totp = $request->input('totp', config('services.angelone.totp', env('ANGELONE_TOTP')));
        $apiKey = $request->input('api_key', config('services.angelone.api_key', env('ANGELONE_API_KEY')));

        if (! $clientCode || ! $password || ! $totp || ! $apiKey) {
            return response()->json([
                'success' => false,
                'message' => 'Missing required AngelOne credentials (client_code, password, totp, api_key). Please provide them in the request body or configure them in your .env file.',
            ], 422);
        }

        $authResult = $this->angelOneService->loginByPassword(
            $clientCode,
            $password,
            $totp,
            $apiKey
        );

        if (! $authResult['success']) {
            return response()->json([
                'success' => false,
                'message' => $authResult['message'],
            ], 400);
        }

        $jwtToken = $authResult['jwtToken'];
        $user = $request->user();

        // Fetch & save Profile
        $profileResult = $this->angelOneService->fetchAndSaveProfile($user, $jwtToken, $apiKey);

        // Fetch & save RMS
        $rmsResult = $this->angelOneService->fetchAndSaveRms($user, $jwtToken, $apiKey, $clientCode);

        return response()->json([
            'success' => true,
            'message' => 'AngelOne SmartAPI login successful. Profile and RMS data saved to database.',
            'tokens' => [
                'jwtToken' => $authResult['jwtToken'],
                'refreshToken' => $authResult['refreshToken'],
                'feedToken' => $authResult['feedToken'],
            ],
            'profile' => $profileResult['profile'] ?? null,
            'rms' => $rmsResult['rms'] ?? null,
        ]);
    }

    /**
     * Get stored user profile from database.
     */
    public function getProfile(Request $request): JsonResponse
    {
        $profile = AngelOneProfile::where('user_id', $request->user()->id)->first();

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * Get stored RMS (Funds & Margin) logs from database.
     */
    public function getRms(Request $request): JsonResponse
    {
        $rmsLogs = AngelOneRms::where('user_id', $request->user()->id)->latest()->take(20)->get();

        return response()->json([
            'success' => true,
            'data' => $rmsLogs,
        ]);
    }
}
