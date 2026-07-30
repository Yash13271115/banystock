<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\AngelOneService;
use Illuminate\Console\Command;

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
        $totp = env('ANGELONE_TOTP');
        $apiKey = env('ANGELONE_API_KEY');

        if (! $clientCode || ! $password || ! $totp || ! $apiKey) {
            $this->error('Missing required AngelOne credentials in .env (ANGELONE_CLIENT_CODE, ANGELONE_PASSWORD, ANGELONE_TOTP, ANGELONE_API_KEY).');

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

        if ($profileResult['success'] && $rmsResult['success']) {
            $this->info('AngelOne SmartAPI data synced successfully to database!');

            return Command::SUCCESS;
        }

        $this->warn('AngelOne sync completed with warnings: Profile ('.($profileResult['message'] ?? '').'), RMS ('.($rmsResult['message'] ?? '').')');

        return Command::SUCCESS;
    }
}
