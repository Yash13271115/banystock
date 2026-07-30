<?php

namespace App\Services;

use App\Models\AngelOneProfile;
use App\Models\AngelOneRms;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AngelOneService
{
    protected string $baseUrl = 'https://apiconnect.angelone.in';

    /**
     * Authenticate with AngelOne SmartAPI using clientCode, password/PIN, TOTP, and API key.
     * Endpoint: /rest/auth/angelbroking/user/v1/loginByPassword
     *
     * @return array{success: bool, jwtToken?: string, refreshToken?: string, feedToken?: string, message?: string}
     */
    public function loginByPassword(string $clientCode, string $password, string $totp, string $apiKey, ?string $clientLocalIp = '127.0.0.1', ?string $clientPublicIp = '127.0.0.1', ?string $macAddress = '00-00-00-00-00-00'): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => $clientLocalIp,
                'X-ClientPublicIP' => $clientPublicIp,
                'X-MACAddress' => $macAddress,
                'X-PrivateKey' => $apiKey,
            ])->post("{$this->baseUrl}/rest/auth/angelbroking/user/v1/loginByPassword", [
                'clientcode' => $clientCode,
                'password' => $password,
                'totp' => $totp,
            ]);

            $json = $response->json();

            if ($response->successful() && isset($json['status']) && $json['status'] === true) {
                return [
                    'success' => true,
                    'jwtToken' => $json['data']['jwtToken'] ?? null,
                    'refreshToken' => $json['data']['refreshToken'] ?? null,
                    'feedToken' => $json['data']['feedToken'] ?? null,
                    'message' => $json['message'] ?? 'Authenticated successfully',
                ];
            }

            return [
                'success' => false,
                'message' => $json['message'] ?? 'Authentication failed',
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne loginByPassword Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Generate new access token using Refresh Token.
     * Endpoint: /rest/auth/angelbroking/jwt/v1/generateTokens
     *
     * @return array{success: bool, jwtToken?: string, refreshToken?: string, feedToken?: string, message?: string}
     */
    public function generateTokens(string $refreshToken, string $apiKey): array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-PrivateKey' => $apiKey,
            ])->post("{$this->baseUrl}/rest/auth/angelbroking/jwt/v1/generateTokens", [
                'refreshToken' => $refreshToken,
            ]);

            $json = $response->json();

            if ($response->successful() && isset($json['status']) && $json['status'] === true) {
                return [
                    'success' => true,
                    'jwtToken' => $json['data']['jwtToken'] ?? null,
                    'refreshToken' => $json['data']['refreshToken'] ?? null,
                    'feedToken' => $json['data']['feedToken'] ?? null,
                    'message' => $json['message'] ?? 'Tokens refreshed successfully',
                ];
            }

            return [
                'success' => false,
                'message' => $json['message'] ?? 'Token refresh failed',
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne generateTokens Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch user profile from SmartAPI and persist it in database.
     * Endpoint: /rest/secure/angelbroking/user/v1/getProfile
     */
    public function fetchAndSaveProfile(User $user, string $jwtToken, string $apiKey): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$jwtToken}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => '127.0.0.1',
                'X-ClientPublicIP' => '127.0.0.1',
                'X-MACAddress' => '00-00-00-00-00-00',
                'X-PrivateKey' => $apiKey,
            ])->get("{$this->baseUrl}/rest/secure/angelbroking/user/v1/getProfile");

            $json = $response->json();

            if ($response->successful() && isset($json['status']) && $json['status'] === true) {
                $data = $json['data'] ?? [];

                $profile = AngelOneProfile::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'client_code' => $data['clientcode'] ?? 'UNKNOWN',
                    ],
                    [
                        'name' => $data['name'] ?? null,
                        'email' => $data['email'] ?? null,
                        'mobile_number' => $data['mobileno'] ?? null,
                        'exchanges' => is_array($data['exchanges'] ?? null) ? implode(',', $data['exchanges']) : ($data['exchanges'] ?? null),
                        'products' => is_array($data['products'] ?? null) ? implode(',', $data['products']) : ($data['products'] ?? null),
                        'broker_title' => $data['brokertitle'] ?? null,
                        'raw_response' => $json,
                    ]
                );

                return [
                    'success' => true,
                    'profile' => $profile,
                    'message' => 'Profile fetched and saved successfully',
                ];
            }

            return [
                'success' => false,
                'message' => $json['message'] ?? 'Failed to fetch user profile',
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne getProfile Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch RMS / funds & margin details from SmartAPI and persist in database.
     * Endpoint: /rest/secure/angelbroking/user/v1/getRMS
     */
    public function fetchAndSaveRms(User $user, string $jwtToken, string $apiKey, string $clientCode): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$jwtToken}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => '127.0.0.1',
                'X-ClientPublicIP' => '127.0.0.1',
                'X-MACAddress' => '00-00-00-00-00-00',
                'X-PrivateKey' => $apiKey,
            ])->get("{$this->baseUrl}/rest/secure/angelbroking/user/v1/getRMS");

            $json = $response->json();

            if ($response->successful() && isset($json['status']) && $json['status'] === true) {
                $data = $json['data'] ?? [];

                $rms = AngelOneRms::create([
                    'user_id' => $user->id,
                    'client_code' => $clientCode,
                    'net' => (float) ($data['net'] ?? 0.0),
                    'available_cash' => (float) ($data['availablecash'] ?? 0.0),
                    'collateral' => (float) ($data['collateral'] ?? 0.0),
                    'm2m_unrealized' => (float) ($data['m2munrealized'] ?? 0.0),
                    'm2m_realized' => (float) ($data['m2mrealized'] ?? 0.0),
                    'utilized_margin' => (float) ($data['utilisedmargin'] ?? 0.0),
                    'raw_response' => $json,
                ]);

                return [
                    'success' => true,
                    'rms' => $rms,
                    'message' => 'RMS data fetched and saved successfully',
                ];
            }

            return [
                'success' => false,
                'message' => $json['message'] ?? 'Failed to fetch RMS details',
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne getRMS Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Logout / invalidate AngelOne session token.
     * Endpoint: /rest/secure/angelbroking/user/v1/logout
     */
    public function logout(string $jwtToken, string $apiKey, string $clientCode): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$jwtToken}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-PrivateKey' => $apiKey,
            ])->post("{$this->baseUrl}/rest/secure/angelbroking/user/v1/logout", [
                'clientcode' => $clientCode,
            ]);

            $json = $response->json();

            return [
                'success' => isset($json['status']) && $json['status'] === true,
                'message' => $json['message'] ?? 'Logged out from AngelOne SmartAPI',
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne logout Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch Top Gainers or Losers from AngelOne SmartAPI.
     * Endpoint: /rest/secure/angelbroking/marketData/v1/topGainersLosers
     */
    public function getTopGainers(string $jwtToken, string $apiKey, string $datatype = 'GAINERS', string $expirytype = 'NEAR'): array
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$jwtToken}",
                'Content-Type' => 'application/json',
                'Accept' => 'application/json',
                'X-UserType' => 'USER',
                'X-SourceID' => 'WEB',
                'X-ClientLocalIP' => '127.0.0.1',
                'X-ClientPublicIP' => '127.0.0.1',
                'X-MACAddress' => '00-00-00-00-00-00',
                'X-PrivateKey' => $apiKey,
            ])->post("{$this->baseUrl}/rest/secure/angelbroking/marketData/v1/topGainersLosers", [
                'datatype' => $datatype,
                'expirytype' => $expirytype,
            ]);

            $json = $response->json();

            if ($response->successful() && isset($json['status']) && $json['status'] === true) {
                return [
                    'success' => true,
                    'data' => $json['data'] ?? [],
                ];
            }

            return [
                'success' => false,
                'message' => $json['message'] ?? 'Failed to fetch Top Gainers data',
                'data' => [],
            ];
        } catch (\Throwable $e) {
            Log::error('AngelOne TopGainers Exception', ['error' => $e->getMessage()]);

            return [
                'success' => false,
                'message' => $e->getMessage(),
                'data' => [],
            ];
        }
    }
}
