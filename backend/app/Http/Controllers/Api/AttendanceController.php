<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    /**
     * Pointer l'entrée
     */
    public function clockIn(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|image|max:5120', // 5MB max
            'device_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $today = now()->toDateString();

        // Vérifier si déjà pointé aujourd'hui
        $existingAttendance = Attendance::where('user_id', $user->id)
                                       ->where('date', $today)
                                       ->first();

        if ($existingAttendance && $existingAttendance->clock_in) {
            return response()->json([
                'message' => 'Vous avez déjà pointé votre entrée aujourd\'hui',
                'attendance' => $existingAttendance
            ], 400);
        }

        // Vérifier la géolocalisation si activée
        if ($user->gps_required && $user->site) {
            $site = $user->site;
            
            if (!$site->isWithinRadius($request->latitude, $request->longitude)) {
                return response()->json([
                    'message' => 'Vous n\'êtes pas dans la zone autorisée pour pointer',
                    'required_site' => $site->name,
                    'distance_info' => 'Vous devez être à moins de ' . $site->radius_meters . ' mètres'
                ], 403);
            }
        }

        // Traiter la photo si fournie
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('attendance_photos', 'public');
        }

        // Créer ou mettre à jour le pointage
        DB::beginTransaction();
        try {
            $attendance = Attendance::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'date' => $today,
                ],
                [
                    'site_id' => $user->site_id,
                    'clock_in' => now(),
                    'clock_in_latitude' => $request->latitude,
                    'clock_in_longitude' => $request->longitude,
                    'clock_in_photo' => $photoPath,
                    'clock_in_device' => $request->device_info,
                    'clock_in_ip' => $request->ip(),
                    'status' => 'PRESENT',
                ]
            );

            // Calculer si en retard
            if ($user->workSchedule) {
                $dayName = strtolower(now()->format('l'));
                $schedule = $user->workSchedule->getScheduleForDay($dayName);
                
                if ($schedule && isset($schedule['start'])) {
                    $attendance->calculateLateTime($schedule['start']);
                    $attendance->save();
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Pointage d\'entrée enregistré avec succès',
                'attendance' => $attendance,
                'time' => now()->format('H:i:s'),
                'status' => $attendance->isLate() ? 'En retard' : 'À l\'heure',
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement du pointage',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Pointer la sortie
     */
    public function clockOut(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'photo' => 'nullable|image|max:5120',
            'device_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $today = now()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
                                ->where('date', $today)
                                ->first();

        if (!$attendance || !$attendance->clock_in) {
            return response()->json([
                'message' => 'Vous devez d\'abord pointer votre entrée'
            ], 400);
        }

        if ($attendance->clock_out) {
            return response()->json([
                'message' => 'Vous avez déjà pointé votre sortie aujourd\'hui',
                'attendance' => $attendance
            ], 400);
        }

        // Traiter la photo si fournie
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('attendance_photos', 'public');
        }

        DB::beginTransaction();
        try {
            $attendance->update([
                'clock_out' => now(),
                'clock_out_latitude' => $request->latitude,
                'clock_out_longitude' => $request->longitude,
                'clock_out_photo' => $photoPath,
                'clock_out_device' => $request->device_info,
                'clock_out_ip' => $request->ip(),
            ]);

            // Calculer la durée et les heures sup
            $attendance->calculateDuration();
            
            if ($user->workSchedule) {
                $dailyThreshold = $user->workSchedule->daily_hours_threshold * 60;
                $attendance->calculateOvertime($dailyThreshold);
            }
            
            $attendance->save();

            DB::commit();

            return response()->json([
                'message' => 'Pointage de sortie enregistré avec succès',
                'attendance' => $attendance,
                'time' => now()->format('H:i:s'),
                'work_hours' => $attendance->work_hours,
                'overtime_hours' => $attendance->overtime_hours,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement du pointage',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Synchroniser les pointages offline
     */
    public function syncOfflineAttendances(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'attendances' => 'required|array',
            'attendances.*.date' => 'required|date',
            'attendances.*.clock_in' => 'required|date',
            'attendances.*.latitude' => 'required|numeric',
            'attendances.*.longitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        $synced = [];
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($request->attendances as $data) {
                try {
                    $attendance = Attendance::updateOrCreate(
                        [
                            'user_id' => $user->id,
                            'date' => $data['date'],
                        ],
                        [
                            'site_id' => $user->site_id,
                            'clock_in' => $data['clock_in'],
                            'clock_in_latitude' => $data['latitude'],
                            'clock_in_longitude' => $data['longitude'],
                            'clock_out' => $data['clock_out'] ?? null,
                            'is_synced' => true,
                            'synced_at' => now(),
                        ]
                    );

                    $synced[] = $attendance;
                } catch (\Exception $e) {
                    $errors[] = [
                        'date' => $data['date'],
                        'error' => $e->getMessage()
                    ];
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Synchronisation terminée',
                'synced_count' => count($synced),
                'error_count' => count($errors),
                'synced' => $synced,
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erreur lors de la synchronisation',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Obtenir l'historique des pointages
     */
    public function getHistory(Request $request)
    {
        $user = auth()->user();
        
        $query = Attendance::where('user_id', $user->id);

        // Filtres optionnels
        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        if ($request->has('month')) {
            $query->whereMonth('date', $request->month);
        }

        if ($request->has('year')) {
            $query->whereYear('date', $request->year);
        }

        $attendances = $query->orderBy('date', 'desc')
                            ->paginate($request->per_page ?? 30);

        return response()->json($attendances);
    }

    /**
     * Obtenir le pointage du jour
     */
    public function getToday()
    {
        $user = auth()->user();
        $attendance = $user->getTodayAttendance();

        return response()->json([
            'attendance' => $attendance,
            'can_clock_in' => $user->canClockIn(),
            'can_clock_out' => $user->canClockOut(),
        ]);
    }

    /**
     * Statistiques de la semaine
     */
    public function getWeekStats()
    {
        $user = auth()->user();
        
        $attendances = Attendance::where('user_id', $user->id)
                                 ->thisWeek()
                                 ->get();

        $totalMinutes = $attendances->sum('work_minutes');
        $overtimeMinutes = $attendances->sum('overtime_minutes');
        $lateCount = $attendances->where('late_minutes', '>', 0)->count();
        $lateTotalMinutes = $attendances->sum('late_minutes');

        return response()->json([
            'total_hours' => round($totalMinutes / 60, 2),
            'overtime_hours' => round($overtimeMinutes / 60, 2),
            'late_count' => $lateCount,
            'late_total_minutes' => $lateTotalMinutes,
            'days_worked' => $attendances->count(),
        ]);
    }
}

