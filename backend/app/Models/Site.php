<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'address',
        'latitude',
        'longitude',
        'radius_meters',
        'phone',
        'email',
        'manager_id',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    // Methods
    public function isWithinRadius(float $latitude, float $longitude): bool
    {
        if (!$this->latitude || !$this->longitude) {
            return true; // Pas de restriction GPS
        }

        $distance = $this->calculateDistance($latitude, $longitude);
        
        return $distance <= $this->radius_meters;
    }

    /**
     * Calcule la distance en mètres entre deux coordonnées GPS (formule Haversine)
     */
    private function calculateDistance(float $lat, float $lng): float
    {
        $earthRadius = 6371000; // Rayon de la terre en mètres

        $latFrom = deg2rad($this->latitude);
        $lonFrom = deg2rad($this->longitude);
        $latTo = deg2rad($lat);
        $lonTo = deg2rad($lng);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
            cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return $angle * $earthRadius;
    }

    public function getActiveEmployeesCountAttribute(): int
    {
        return $this->users()->active()->count();
    }
}

