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
        Schema::create('angel_one_rms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('client_code');
            $table->decimal('net', 15, 2)->default(0.00);
            $table->decimal('available_cash', 15, 2)->default(0.00);
            $table->decimal('collateral', 15, 2)->default(0.00);
            $table->decimal('m2m_unrealized', 15, 2)->default(0.00);
            $table->decimal('m2m_realized', 15, 2)->default(0.00);
            $table->decimal('utilized_margin', 15, 2)->default(0.00);
            $table->json('raw_response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('angel_one_rms');
    }
};
