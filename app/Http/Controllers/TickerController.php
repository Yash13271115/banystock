<?php

namespace App\Http\Controllers;

use App\Services\AngelOneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use OTPHP\TOTP as OtphpTotp;

class TickerController extends Controller
{
    /**
     * Default stock symbols with their AngelOne symbol tokens.
     *
     * @var array<string, array{token: string, exchange: string, name: string}>
     */
    private array $defaultStocks = [
        'TATASTEEL' => ['token' => '3499', 'exchange' => 'NSE', 'name' => 'Tata Steel Ltd'],
        'RELIANCE' => ['token' => '2885', 'exchange' => 'NSE', 'name' => 'Reliance Industries Ltd'],
        'TCS' => ['token' => '11536', 'exchange' => 'NSE', 'name' => 'TCS Ltd'],
        'INFY' => ['token' => '1594', 'exchange' => 'NSE', 'name' => 'Infosys Ltd'],
        'HDFCBANK' => ['token' => '1333', 'exchange' => 'NSE', 'name' => 'HDFC Bank Ltd'],
        'ICICIBANK' => ['token' => '4963', 'exchange' => 'NSE', 'name' => 'ICICI Bank Ltd'],
        'SBIN' => ['token' => '3045', 'exchange' => 'NSE', 'name' => 'State Bank of India'],
        'WIPRO' => ['token' => '3787', 'exchange' => 'NSE', 'name' => 'Wipro Ltd'],
        'ITC' => ['token' => '1660', 'exchange' => 'NSE', 'name' => 'ITC Ltd'],
        'BAJFINANCE' => ['token' => '317', 'exchange' => 'NSE', 'name' => 'Bajaj Finance Ltd'],
    ];

    /**
     * Render the historical ticker page via Inertia.
     */
    public function show(string $symbol = 'TATASTEEL'): Response
    {
        $symbol = strtoupper($symbol);
        $stockInfo = $this->defaultStocks[$symbol] ?? $this->defaultStocks['TATASTEEL'];
        $stockName = $stockInfo['name'];

        return Inertia::render('ticker', [
            'symbol' => $symbol,
            'symbolToken' => $stockInfo['token'],
            'exchange' => $stockInfo['exchange'],
            'stockName' => $stockName,
            'availableStocks' => collect($this->defaultStocks)->map(fn (array $info, string $sym) => [
                'symbol' => $sym,
                'name' => $info['name'],
                'token' => $info['token'],
                'exchange' => $info['exchange'],
            ])->values()->all(),
        ]);
    }

    /**
     * Fetch historical candle data as JSON (used by React via useHttp).
     */
    public function history(Request $request, AngelOneService $angelOneService): JsonResponse
    {
        $request->validate([
            'exchange' => 'required|string|in:NSE,BSE,NFO,BFO,MCX',
            'symboltoken' => 'required|string',
            'interval' => 'required|string|in:ONE_MINUTE,FIVE_MINUTE,FIFTEEN_MINUTE,THIRTY_MINUTE,ONE_HOUR,ONE_DAY',
            'fromdate' => 'required|string',
            'todate' => 'required|string',
        ]);

        // Authenticate with AngelOne to get JWT token
        $authResult = $this->authenticateAngelOne($angelOneService);

        if (! $authResult['success']) {
            return response()->json([
                'success' => false,
                'message' => 'AngelOne authentication failed: '.($authResult['message'] ?? 'Unknown error'),
                'data' => [],
            ], 401);
        }

        $result = $angelOneService->getCandleData(
            $authResult['jwtToken'],
            env('ANGELONE_API_KEY'),
            $request->input('exchange'),
            $request->input('symboltoken'),
            $request->input('interval'),
            $request->input('fromdate'),
            $request->input('todate'),
        );

        return response()->json($result);
    }

    /**
     * Authenticate with AngelOne SmartAPI using environment credentials.
     *
     * @return array{success: bool, jwtToken?: string, message?: string}
     */
    private function authenticateAngelOne(AngelOneService $angelOneService): array
    {
        $clientCode = env('ANGELONE_CLIENT_CODE');
        $password = env('ANGELONE_PASSWORD');
        $totpSecret = env('ANGELONE_TOTP_SECRET');
        $totp = env('ANGELONE_TOTP');
        $apiKey = env('ANGELONE_API_KEY');

        if ($totpSecret) {
            try {
                $cleanSecret = strtoupper(preg_replace('/[^A-Za-z2-7]/', '', $totpSecret));
                $remainder = strlen($cleanSecret) % 8;
                if ($remainder !== 0) {
                    $cleanSecret .= str_repeat('=', 8 - $remainder);
                }

                $otpInstance = OtphpTotp::createFromSecret($cleanSecret);
                $otpInstance->setPeriod(30);
                $otpInstance->setDigits(6);
                $otpInstance->setDigest('sha1');
                $totp = $otpInstance->now();
            } catch (\Throwable $e) {
                return ['success' => false, 'message' => 'TOTP generation failed: '.$e->getMessage()];
            }
        }

        if (! $clientCode || ! $password || ! $totp || ! $apiKey) {
            return ['success' => false, 'message' => 'Missing AngelOne credentials'];
        }

        return $angelOneService->loginByPassword($clientCode, $password, $totp, $apiKey);
    }
}
