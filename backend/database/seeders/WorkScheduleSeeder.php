<?php

namespace Database\Seeders;

use App\Models\WorkSchedule;
use Illuminate\Database\Seeder;

class WorkScheduleSeeder extends Seeder
{
    public function run(): void
    {
        WorkSchedule::create([
            'company_id' => 1,
            'name' => 'Horaire Standard (8h-17h)',
            'type' => 'FIXED',
            'schedule' => json_encode([
                'monday' => ['start' => '08:00', 'end' => '17:00', 'enabled' => true],
                'tuesday' => ['start' => '08:00', 'end' => '17:00', 'enabled' => true],
                'wednesday' => ['start' => '08:00', 'end' => '17:00', 'enabled' => true],
                'thursday' => ['start' => '08:00', 'end' => '17:00', 'enabled' => true],
                'friday' => ['start' => '08:00', 'end' => '17:00', 'enabled' => true],
                'saturday' => ['start' => '08:00', 'end' => '13:00', 'enabled' => true],
                'sunday' => ['enabled' => false],
            ]),
            'late_tolerance_minutes' => 10,
            'break_duration_minutes' => 60,
            'daily_hours_threshold' => 8,
            'weekly_hours_threshold' => 40,
            'overtime_rate_normal' => 1.25,
            'overtime_rate_night' => 1.50,
            'overtime_rate_weekend' => 1.50,
            'overtime_rate_holiday' => 2.00,
            'is_active' => true,
        ]);
    }
}

