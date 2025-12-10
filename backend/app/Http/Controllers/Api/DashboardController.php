<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Statistiques globales
     */
    public function stats(Request $request)
    {
        $user = auth()->user();
        $date = $request->date ?? now()->toDateString();
        
        $query = Attendance::whereDate('date', $date);
        
        // Filtrer par site si spécifié
        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        } elseif ($user->hasRole('manager') && !$user->hasRole('admin')) {
            // Manager voit seulement son site
            $query->where('site_id', $user->site_id);
        }
        
        $attendances = $query->get();
        
        $presentCount = $attendances->whereIn('status', ['PRESENT', 'LATE'])->count();
        $lateCount = $attendances->where('status', 'LATE')->count();
        $absentCount = User::where('company_id', $user->company_id)
                           ->where('is_active', true)
                           ->whereNotIn('id', $attendances->pluck('user_id'))
                           ->count();
        
        $totalEmployees = User::where('company_id', $user->company_id)
                             ->where('is_active', true)
                             ->count();
        
        $presentPercentage = $totalEmployees > 0 
            ? round(($presentCount / $totalEmployees) * 100, 1) 
            : 0;
        
        return response()->json([
            'date' => $date,
            'present_count' => $presentCount,
            'late_count' => $lateCount,
            'absent_count' => $absentCount,
            'total_employees' => $totalEmployees,
            'present_percentage' => $presentPercentage,
        ]);
    }
    
    /**
     * Liste des présences du jour
     */
    public function attendances(Request $request)
    {
        $user = auth()->user();
        $date = $request->date ?? now()->toDateString();
        
        $query = Attendance::with(['user', 'site'])
                          ->whereDate('date', $date);
        
        if ($request->has('site_id')) {
            $query->where('site_id', $request->site_id);
        } elseif ($user->hasRole('manager') && !$user->hasRole('admin')) {
            $query->where('site_id', $user->site_id);
        }
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        $attendances = $query->orderBy('clock_in', 'desc')
                            ->paginate($request->per_page ?? 50);
        
        return response()->json($attendances);
    }
    
    /**
     * Employés en retard
     */
    public function lateEmployees(Request $request)
    {
        $user = auth()->user();
        $date = $request->date ?? now()->toDateString();
        
        $query = Attendance::with(['user', 'site'])
                          ->whereDate('date', $date)
                          ->where('late_minutes', '>', 0);
        
        if ($user->hasRole('manager') && !$user->hasRole('admin')) {
            $query->where('site_id', $user->site_id);
        }
        
        $lateEmployees = $query->orderBy('late_minutes', 'desc')
                              ->get();
        
        return response()->json($lateEmployees);
    }
    
    /**
     * Employés absents
     */
    public function absentEmployees(Request $request)
    {
        $user = auth()->user();
        $date = $request->date ?? now()->toDateString();
        
        $presentUserIds = Attendance::whereDate('date', $date)
                                   ->pluck('user_id');
        
        $query = User::with(['site', 'department'])
                    ->where('company_id', $user->company_id)
                    ->where('is_active', true)
                    ->whereNotIn('id', $presentUserIds);
        
        if ($user->hasRole('manager') && !$user->hasRole('admin')) {
            $query->where('site_id', $user->site_id);
        }
        
        $absentEmployees = $query->get();
        
        return response()->json($absentEmployees);
    }
    
    /**
     * Demandes en attente de validation
     */
    public function pendingRequests()
    {
        $user = auth()->user();
        
        $query = LeaveRequest::with(['user', 'leaveType'])
                            ->where('status', 'PENDING');
        
        if ($user->hasRole('manager') && !$user->hasRole('admin')) {
            // Manager voit seulement les demandes de son équipe
            $subordinateIds = $user->subordinates()->pluck('id');
            $query->whereIn('user_id', $subordinateIds);
        }
        
        $pendingRequests = $query->orderBy('created_at', 'asc')
                                ->get();
        
        return response()->json($pendingRequests);
    }
    
    /**
     * Statistiques hebdomadaires
     */
    public function weeklyStats()
    {
        $user = auth()->user();
        $startOfWeek = now()->startOfWeek();
        $endOfWeek = now()->endOfWeek();
        
        $stats = [];
        
        for ($i = 0; $i < 7; $i++) {
            $date = $startOfWeek->copy()->addDays($i);
            
            $query = Attendance::whereDate('date', $date->toDateString());
            
            if ($user->hasRole('manager') && !$user->hasRole('admin')) {
                $query->where('site_id', $user->site_id);
            }
            
            $attendances = $query->get();
            
            $stats[] = [
                'date' => $date->toDateString(),
                'day' => $date->format('l'),
                'day_fr' => $this->getDayFrench($date->format('l')),
                'present_count' => $attendances->whereIn('status', ['PRESENT', 'LATE'])->count(),
                'late_count' => $attendances->where('status', 'LATE')->count(),
                'total_hours' => round($attendances->sum('work_minutes') / 60, 1),
            ];
        }
        
        return response()->json($stats);
    }
    
    /**
     * Statistiques mensuelles
     */
    public function monthlyStats(Request $request)
    {
        $user = auth()->user();
        $month = $request->month ?? now()->month;
        $year = $request->year ?? now()->year;
        
        $query = Attendance::whereMonth('date', $month)
                          ->whereYear('date', $year);
        
        if ($user->hasRole('manager') && !$user->hasRole('admin')) {
            $query->where('site_id', $user->site_id);
        }
        
        $attendances = $query->get();
        
        $totalHours = round($attendances->sum('work_minutes') / 60, 1);
        $overtimeHours = round($attendances->sum('overtime_minutes') / 60, 1);
        $totalLateCount = $attendances->where('late_minutes', '>', 0)->count();
        $totalLateDuration = $attendances->sum('late_minutes');
        
        return response()->json([
            'month' => $month,
            'year' => $year,
            'total_hours' => $totalHours,
            'overtime_hours' => $overtimeHours,
            'late_count' => $totalLateCount,
            'late_duration_minutes' => $totalLateDuration,
            'average_daily_hours' => round($totalHours / $attendances->count(), 1),
        ]);
    }
    
    private function getDayFrench($day)
    {
        $days = [
            'Monday' => 'Lundi',
            'Tuesday' => 'Mardi',
            'Wednesday' => 'Mercredi',
            'Thursday' => 'Jeudi',
            'Friday' => 'Vendredi',
            'Saturday' => 'Samedi',
            'Sunday' => 'Dimanche',
        ];
        
        return $days[$day] ?? $day;
    }
}

