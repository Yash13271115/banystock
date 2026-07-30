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
        $validated = $request->validate([
            'client_code' => 'required|string',
            'password' => 'required|string',
            'totp' => 'required|string',
            'api_key' => 'required|string',
        ]);

        $authResult = $this->angelOneService->loginByPassword(
            $validated['client_code'],
            $validated['password'],
            $validated['totp'],
            $validated['api_key']
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
        $profileResult = $this->angelOneService->fetchAndSaveProfile($user, $jwtToken, $validated['api_key']);

        // Fetch & save RMS
        $rmsResult = $this->angelOneService->fetchAndSaveRms($user, $jwtToken, $validated['api_key'], $validated['client_code']);

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
