<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AngelOneProfile extends Model
{
    protected $fillable = [
        'user_id',
        'client_code',
        'name',
        'email',
        'mobile_number',
        'exchanges',
        'products',
        'broker_title',
        'raw_response',
    ];

    protected $casts = [
        'raw_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
