<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AngelOneTopGainer extends Model
{
    use HasFactory;

    protected $table = 'angel_one_top_gainers';

    protected $fillable = [
        'trading_symbol',
        'symbol_token',
        'ltp',
        'net_change',
        'percent_change',
        'data_type',
        'raw_data',
    ];

    protected function casts(): array
    {
        return [
            'ltp' => 'decimal:2',
            'net_change' => 'decimal:2',
            'percent_change' => 'decimal:2',
            'raw_data' => 'array',
        ];
    }
}
