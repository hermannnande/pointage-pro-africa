<?php

namespace Database\Seeders;

use App\Models\LeaveRequest;
use Illuminate\Database\Seeder;

class LeaveRequestSeeder extends Seeder
{
    public function run(): void
    {
        $leaveRequests = [
            [
                'user_id' => 4,
                'leave_type_id' => 1,
                'start_date' => '2025-01-15',
                'end_date' => '2025-01-19',
                'days_count' => 5,
                'reason' => 'Raisons familiales',
                'status' => 'PENDING',
            ],
            [
                'user_id' => 5,
                'leave_type_id' => 3,
                'start_date' => '2025-12-03',
                'end_date' => '2025-12-03',
                'days_count' => 1,
                'reason' => 'Rendez-vous médical',
                'status' => 'APPROVED',
                'reviewed_by' => 3,
                'reviewed_at' => now(),
            ],
            [
                'user_id' => 6,
                'leave_type_id' => 1,
                'start_date' => '2025-12-25',
                'end_date' => '2025-12-30',
                'days_count' => 5,
                'reason' => 'Congés de fin d\'année',
                'status' => 'REJECTED',
                'reviewed_by' => 3,
                'review_comment' => 'Période de forte activité',
                'reviewed_at' => now(),
            ],
        ];
        
        foreach ($leaveRequests as $request) {
            LeaveRequest::create($request);
        }
    }
}

