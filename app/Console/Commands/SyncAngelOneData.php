<?php

namespace App\Console\Commands;

use App\Models\AngelOneTopGainer;
use App\Models\User;
use App\Services\AngelOneService;
use Illuminate\Console\Command;
use OTPHP\TOTP as OtphpTotp;

class SyncAngelOneData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'angelone:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Internal service tool to authenticate with AngelOne SmartAPI and sync live Profile and RMS data to database';

    /**
     * Execute the console command.
     */
    public function handle(AngelOneService $angelOneService): int
    {
        $clientCode = env('ANGELONE_CLIENT_CODE');
        $password = env('ANGELONE_PASSWORD');
        $totpSecret = env('ANGELONE_TOTP_SECRET');
        $totp = env('ANGELONE_TOTP');
        $apiKey = env('ANGELONE_API_KEY');

        // Dynamically generate current 6-digit TOTP if TOTP secret is provided in .env
        if ($totpSecret) {
            try {
                // Sanitize base32 key: uppercase, strip non-Base32 chars, pad to valid length
                $cleanSecret = strtoupper(preg_replace('/[^A-Za-z2-7]/', '', $totpSecret));

                // Ensure proper Base32 padding (must be multiple of 8)
                $remainder = strlen($cleanSecret) % 8;
                if ($remainder !== 0) {
                    $cleanSecret .= str_repeat('=', 8 - $remainder);
                }

                $otpInstance = OtphpTotp::createFromSecret($cleanSecret);
                $otpInstance->setPeriod(30);
                $otpInstance->setDigits(6);
                $otpInstance->setDigest('sha1');
                $totp = $otpInstance->now();
                $this->info("Generated dynamic 6-digit TOTP code: {$totp}");
            } catch (\Throwable $e) {
                $this->warn("Failed to generate TOTP from secret: {$e->getMessage()}");
            }
        }

        if (! $clientCode || ! $password || ! $totp || ! $apiKey) {
            $this->error('Missing required AngelOne credentials in .env (ANGELONE_CLIENT_CODE, ANGELONE_PASSWORD, ANGELONE_TOTP or ANGELONE_TOTP_SECRET, ANGELONE_API_KEY).');

            return Command::FAILURE;
        }

        $this->info('Authenticating with AngelOne SmartAPI...');

        $authResult = $angelOneService->loginByPassword($clientCode, $password, $totp, $apiKey);

        if (! $authResult['success']) {
            $this->error('AngelOne SmartAPI authentication failed: '.($authResult['message'] ?? 'Unknown error'));

            return Command::FAILURE;
        }

        $jwtToken = $authResult['jwtToken'];
        $user = User::first() ?? new User(['id' => 1]);

        $this->info('Fetching and saving Profile data...');
        $profileResult = $angelOneService->fetchAndSaveProfile($user, $jwtToken, $apiKey);

        $this->info('Fetching and saving RMS/Margin data...');
        $rmsResult = $angelOneService->fetchAndSaveRms($user, $jwtToken, $apiKey, $clientCode);

        $this->info('Fetching live Top Gainers telemetry...');
        $topGainersResult = $angelOneService->getTopGainers($jwtToken, $apiKey, 'GAINERS', 'NEAR');

        if ($topGainersResult['success'] && ! empty($topGainersResult['data'])) {
            AngelOneTopGainer::truncate();
            foreach ($topGainersResult['data'] as $gainer) {
                AngelOneTopGainer::create([
                    'trading_symbol' => $gainer['tradingSymbol'] ?? ($gainer['symboltoken'] ?? 'UNKNOWN'),
                    'symbol_token' => $gainer['symboltoken'] ?? null,
                    'ltp' => (float) ($gainer['ltp'] ?? 0.0),
                    'net_change' => (float) ($gainer['netChange'] ?? 0.0),
                    'percent_change' => (float) ($gainer['percentChange'] ?? 0.0),
                    'data_type' => 'GAINERS',
                    'raw_data' => $gainer,
                ]);
            }
            $this->info('Top Gainers data persisted successfully to database!');
        }

        if ($profileResult['success'] && $rmsResult['success']) {
            $this->info('AngelOne SmartAPI data synced successfully to database!');

            return Command::SUCCESS;
        }

        $this->warn('AngelOne sync completed with warnings: Profile ('.($profileResult['message'] ?? '').'), RMS ('.($rmsResult['message'] ?? '').')');

        return Command::SUCCESS;
    }
}
