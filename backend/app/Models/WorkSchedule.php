<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'site_id',
        'name',
        'type',
        'schedule',
        'late_tolerance_minutes',
        'break_duration_minutes',
        'daily_hours_threshold',
        'weekly_hours_threshold',
        'overtime_rate_normal',
        'overtime_rate_night',
        'overtime_rate_weekend',
        'overtime_rate_holiday',
        'is_active',
    ];

    protected $casts = [
        'schedule' => 'array',
        'overtime_rate_normal' => 'decimal:2',
        'overtime_rate_night' => 'decimal:2',
        'overtime_rate_weekend' => 'decimal:2',
        'overtime_rate_holiday' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function getScheduleForDay(string $day): ?array
    {
        return $this->schedule[$day] ?? null;
    }
}

