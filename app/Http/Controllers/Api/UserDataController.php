<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AngelOneProfile;
use App\Models\AngelOneRms;
use App\Models\AngelOneTopGainer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserDataController extends Controller
{
    /**
     * Get stored AngelOne profile for the authenticated mobile/dashboard user.
     */
    public function getProfile(Request $request): JsonResponse
    {
        $profile = AngelOneProfile::where('user_id', $request->user()->id)->first();

        if (! $profile) {
            // Fallback to latest available profile in system if per-user profile is not linked
            $profile = AngelOneProfile::latest()->first();
        }

        return response()->json([
            'success' => true,
            'data' => $profile,
        ]);
    }

    /**
     * Get stored AngelOne RMS (Funds & Margin) logs for mobile/dashboard user.
     */
    public function getRms(Request $request): JsonResponse
    {
        $rmsLogs = AngelOneRms::where('user_id', $request->user()->id)->latest()->take(20)->get();

        if ($rmsLogs->isEmpty()) {
            // Fallback to latest system RMS data if per-user RMS is not linked
            $rmsLogs = AngelOneRms::latest()->take(20)->get();
        }

        return response()->json([
            'success' => true,
            'data' => $rmsLogs,
        ]);
    }

    /**
     * Get live AngelOne Top Gainers market data.
     */
    public function getTopGainers(Request $request): JsonResponse
    {
        $topGainers = AngelOneTopGainer::all();

        return response()->json([
            'success' => true,
            'data' => $topGainers,
        ]);
    }
}
