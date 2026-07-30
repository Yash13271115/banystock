<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AngelOneRms extends Model
{
    protected $table = 'angel_one_rms';

    protected $fillable = [
        'user_id',
        'client_code',
        'net',
        'available_cash',
        'collateral',
        'm2m_unrealized',
        'm2m_realized',
        'utilized_margin',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'net' => 'decimal:2',
        'available_cash' => 'decimal:2',
        'collateral' => 'decimal:2',
        'm2m_unrealized' => 'decimal:2',
        'm2m_realized' => 'decimal:2',
        'utilized_margin' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
