<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\LeaveRequestController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes - Pointage Pro Africa
|--------------------------------------------------------------------------
*/

// Routes publiques (sans authentification)
Route::prefix('v1')->group(function () {
    
    // Authentification
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/login-pin', [AuthController::class, 'loginWithPin']);
        Route::post('/request-otp', [AuthController::class, 'requestOtp']);
        Route::post('/login-otp', [AuthController::class, 'loginWithOtp']);
    });

    // Routes protégées (authentification requise)
    Route::middleware('auth:api')->group(function () {
        
        // Auth user
        Route::prefix('auth')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        // Pointage (Attendance)
        Route::prefix('attendance')->group(function () {
            Route::post('/clock-in', [AttendanceController::class, 'clockIn']);
            Route::post('/clock-out', [AttendanceController::class, 'clockOut']);
            Route::post('/sync-offline', [AttendanceController::class, 'syncOfflineAttendances']);
            Route::get('/today', [AttendanceController::class, 'getToday']);
            Route::get('/history', [AttendanceController::class, 'getHistory']);
            Route::get('/week-stats', [AttendanceController::class, 'getWeekStats']);
        });

        // Congés (Leave Requests)
        Route::prefix('leave-requests')->group(function () {
            Route::get('/', [LeaveRequestController::class, 'index']);
            Route::post('/', [LeaveRequestController::class, 'store']);
            Route::get('/{id}', [LeaveRequestController::class, 'show']);
            Route::put('/{id}', [LeaveRequestController::class, 'update']);
            Route::delete('/{id}', [LeaveRequestController::class, 'destroy']);
            Route::post('/{id}/approve', [LeaveRequestController::class, 'approve']);
            Route::post('/{id}/reject', [LeaveRequestController::class, 'reject']);
        });
        
        // Types de congés
        Route::get('/leave-types', [LeaveRequestController::class, 'leaveTypes']);

        // Profil utilisateur
        Route::prefix('profile')->group(function () {
            Route::get('/', [UserController::class, 'profile']);
            Route::put('/', [UserController::class, 'updateProfile']);
            Route::post('/change-password', [UserController::class, 'changePassword']);
            Route::post('/change-pin', [UserController::class, 'changePin']);
            Route::post('/upload-photo', [UserController::class, 'uploadPhoto']);
        });

        // Dashboard & Stats (pour managers/admins)
        Route::prefix('dashboard')->group(function () {
            Route::get('/stats', [DashboardController::class, 'stats']);
            Route::get('/attendances', [DashboardController::class, 'attendances']);
            Route::get('/late-employees', [DashboardController::class, 'lateEmployees']);
            Route::get('/absent-employees', [DashboardController::class, 'absentEmployees']);
            Route::get('/pending-requests', [DashboardController::class, 'pendingRequests']);
            Route::get('/weekly-stats', [DashboardController::class, 'weeklyStats']);
            Route::get('/monthly-stats', [DashboardController::class, 'monthlyStats']);
        });

        // Admin - Gestion des employés
        Route::prefix('admin')->group(function () {
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
        });
    });
});

// Route de santé (health check)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'version' => '1.0.0',
        'timestamp' => now()->toIso8601String(),
    ]);
});

