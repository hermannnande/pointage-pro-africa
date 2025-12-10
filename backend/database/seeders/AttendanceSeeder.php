<?php

namespace Database\Seeders;

use App\Models\Attendance;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $employeeIds = [4, 5, 6, 7, 8]; // IDs des employés (pas les admins)
        
        // Créer des pointages pour les 7 derniers jours
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            
            // Skip weekend
            if ($date->isWeekend()) {
                continue;
            }
            
            foreach ($employeeIds as $userId) {
                // 80% de présence
                if (rand(1, 100) <= 80) {
                    $clockIn = $date->copy()->setTime(8, 0)->addMinutes(rand(-10, 20));
                    $clockOut = $date->copy()->setTime(17, 0)->addMinutes(rand(-10, 20));
                    
                    $lateMinutes = max(0, $clockIn->diffInMinutes($date->copy()->setTime(8, 0)));
                    $totalMinutes = $clockIn->diffInMinutes($clockOut);
                    $workMinutes = $totalMinutes - 60; // -1h pause
                    
                    Attendance::create([
                        'user_id' => $userId,
                        'site_id' => 1,
                        'date' => $date->toDateString(),
                        'clock_in' => $clockIn,
                        'clock_in_latitude' => 5.3599,
                        'clock_in_longitude' => -3.8997,
                        'clock_out' => $clockOut,
                        'clock_out_latitude' => 5.3599,
                        'clock_out_longitude' => -3.8997,
                        'total_minutes' => $totalMinutes,
                        'break_minutes' => 60,
                        'work_minutes' => $workMinutes,
                        'late_minutes' => $lateMinutes,
                        'overtime_minutes' => max(0, $workMinutes - 480),
                        'status' => $lateMinutes > 0 ? 'LATE' : 'PRESENT',
                        'is_synced' => true,
                        'synced_at' => now(),
                    ]);
                }
            }
        }
    }
}

