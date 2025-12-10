<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'site_id',
        'date',
        'clock_in',
        'clock_in_latitude',
        'clock_in_longitude',
        'clock_in_photo',
        'clock_in_device',
        'clock_in_ip',
        'clock_out',
        'clock_out_latitude',
        'clock_out_longitude',
        'clock_out_photo',
        'clock_out_device',
        'clock_out_ip',
        'total_minutes',
        'break_minutes',
        'work_minutes',
        'late_minutes',
        'overtime_minutes',
        'early_leave_minutes',
        'status',
        'is_synced',
        'synced_at',
        'notes',
        'approved_by',
        'approved_at',
        'is_modified',
        'modified_by',
        'modification_reason',
        'modified_at',
    ];

    protected $casts = [
        'date' => 'date',
        'clock_in' => 'datetime',
        'clock_out' => 'datetime',
        'clock_in_latitude' => 'decimal:7',
        'clock_in_longitude' => 'decimal:7',
        'clock_out_latitude' => 'decimal:7',
        'clock_out_longitude' => 'decimal:7',
        'is_synced' => 'boolean',
        'synced_at' => 'datetime',
        'approved_at' => 'datetime',
        'is_modified' => 'boolean',
        'modified_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by');
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->where('date', now()->toDateString());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('date', [
            now()->startOfWeek(),
            now()->endOfWeek(),
        ]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('date', now()->month)
                     ->whereYear('date', now()->year);
    }

    public function scopeLate($query)
    {
        return $query->where('late_minutes', '>', 0);
    }

    public function scopeWithOvertime($query)
    {
        return $query->where('overtime_minutes', '>', 0);
    }

    // Methods
    public function calculateDuration(): void
    {
        if (!$this->clock_in || !$this->clock_out) {
            return;
        }

        $this->total_minutes = $this->clock_in->diffInMinutes($this->clock_out);
        $this->work_minutes = $this->total_minutes - $this->break_minutes;
    }

    public function calculateLateTime($scheduleStartTime): void
    {
        if (!$this->clock_in) {
            return;
        }

        $scheduledStart = \Carbon\Carbon::parse($this->date->format('Y-m-d') . ' ' . $scheduleStartTime);
        
        if ($this->clock_in->greaterThan($scheduledStart)) {
            $this->late_minutes = $scheduledStart->diffInMinutes($this->clock_in);
            $this->status = 'LATE';
        }
    }

    public function calculateOvertime($dailyThreshold = 480): void
    {
        if (!$this->work_minutes) {
            return;
        }

        if ($this->work_minutes > $dailyThreshold) {
            $this->overtime_minutes = $this->work_minutes - $dailyThreshold;
        }
    }

    public function isLate(): bool
    {
        return $this->late_minutes > 0;
    }

    public function hasOvertime(): bool
    {
        return $this->overtime_minutes > 0;
    }

    public function getWorkHoursAttribute(): float
    {
        return round($this->work_minutes / 60, 2);
    }

    public function getOvertimeHoursAttribute(): float
    {
        return round($this->overtime_minutes / 60, 2);
    }
}

