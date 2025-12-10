<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Holiday extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'date',
        'year',
        'scope',
        'country_code',
        'is_paid',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'is_paid' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public static function isHoliday($date, $companyId = null, $countryCode = null): bool
    {
        $query = static::where('date', $date)
                      ->where('is_active', true);

        if ($companyId) {
            $query->where(function ($q) use ($companyId) {
                $q->where('company_id', $companyId)
                  ->orWhereNull('company_id');
            });
        }

        if ($countryCode) {
            $query->where(function ($q) use ($countryCode) {
                $q->where('country_code', $countryCode)
                  ->orWhereNull('country_code');
            });
        }

        return $query->exists();
    }
}

