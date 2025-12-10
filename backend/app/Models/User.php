<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $fillable = [
        'company_id',
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'photo',
        'password',
        'pin',
        'site_id',
        'department_id',
        'manager_id',
        'position',
        'contract_type',
        'hire_date',
        'contract_end_date',
        'base_salary',
        'annual_leave_days',
        'used_leave_days',
        'work_schedule_id',
        'gps_required',
        'selfie_required',
        'is_active',
        'last_activity_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'pin',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'hire_date' => 'date',
        'contract_end_date' => 'date',
        'base_salary' => 'decimal:2',
        'gps_required' => 'boolean',
        'selfie_required' => 'boolean',
        'is_active' => 'boolean',
        'last_activity_at' => 'datetime',
    ];

    // JWT Methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'company_id' => $this->company_id,
            'role' => $this->roles->first()?->name,
        ];
    }

    // Relationships
    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(User::class, 'manager_id');
    }

    public function workSchedule(): BelongsTo
    {
        return $this->belongsTo(WorkSchedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getRemainingLeaveDaysAttribute(): int
    {
        return $this->annual_leave_days - $this->used_leave_days;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAtSite($query, $siteId)
    {
        return $query->where('site_id', $siteId);
    }

    public function scopeInDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // Methods
    public function canClockIn(): bool
    {
        $today = now()->toDateString();
        $attendance = $this->attendances()->where('date', $today)->first();
        
        return !$attendance || !$attendance->clock_in;
    }

    public function canClockOut(): bool
    {
        $today = now()->toDateString();
        $attendance = $this->attendances()->where('date', $today)->first();
        
        return $attendance && $attendance->clock_in && !$attendance->clock_out;
    }

    public function getTodayAttendance()
    {
        return $this->attendances()->where('date', now()->toDateString())->first();
    }
}

