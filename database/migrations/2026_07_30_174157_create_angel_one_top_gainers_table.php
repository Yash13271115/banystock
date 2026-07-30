<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('angel_one_top_gainers', function (Blueprint $table) {
            $table->id();
            $table->string('trading_symbol');
            $table->string('symbol_token')->nullable();
            $table->decimal('ltp', 15, 2)->default(0.00);
            $table->decimal('net_change', 15, 2)->default(0.00);
            $table->decimal('percent_change', 8, 2)->default(0.00);
            $table->string('data_type')->default('GAINERS'); // GAINERS or LOSERS
            $table->json('raw_data')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('angel_one_top_gainers');
    }
};
