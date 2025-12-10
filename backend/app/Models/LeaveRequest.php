<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'days_count',
        'reason',
        'document_path',
        'status',
        'reviewed_by',
        'review_comment',
        'reviewed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function reviewedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'PENDING');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'APPROVED');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'REJECTED');
    }

    // Methods
    public function approve($reviewerId, $comment = null): void
    {
        $this->update([
            'status' => 'APPROVED',
            'reviewed_by' => $reviewerId,
            'review_comment' => $comment,
            'reviewed_at' => now(),
        ]);

        // Mettre à jour les jours de congés utilisés
        $this->user->increment('used_leave_days', $this->days_count);
    }

    public function reject($reviewerId, $comment): void
    {
        $this->update([
            'status' => 'REJECTED',
            'reviewed_by' => $reviewerId,
            'review_comment' => $comment,
            'reviewed_at' => now(),
        ]);
    }

    public function isPending(): bool
    {
        return $this->status === 'PENDING';
    }

    public function isApproved(): bool
    {
        return $this->status === 'APPROVED';
    }
}

