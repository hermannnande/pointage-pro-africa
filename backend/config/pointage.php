<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuration Système de Pointage
    |--------------------------------------------------------------------------
    */

    // Géolocalisation
    'gps' => [
        'enabled' => env('GPS_ENABLED', true),
        'tolerance_meters' => env('GPS_TOLERANCE_METERS', 100),
    ],

    // Selfie anti-fraude
    'selfie' => [
        'required' => env('SELFIE_REQUIRED', false),
        'max_size_mb' => 5,
        'allowed_formats' => ['jpg', 'jpeg', 'png'],
    ],

    // Pointage
    'attendance' => [
        'offline_sync_enabled' => env('OFFLINE_SYNC_ENABLED', true),
        'late_threshold_minutes' => 10,
        'max_work_hours_per_day' => 12,
    ],

    // Heures supplémentaires
    'overtime' => [
        'daily_threshold' => 8, // heures
        'weekly_threshold' => 40, // heures
        'rate_normal' => 1.25, // +25%
        'rate_night' => 1.50, // +50%
        'rate_sunday' => 2.00, // +100%
        'rate_holiday' => 2.00, // +100%
    ],

    // Sécurité
    'security' => [
        'max_login_attempts' => env('MAX_LOGIN_ATTEMPTS', 5),
        'lockout_duration_minutes' => 15,
        'session_lifetime_minutes' => 120,
    ],

    // Notifications
    'notifications' => [
        'sms_enabled' => env('SMS_ENABLED', true),
        'email_enabled' => env('EMAIL_ENABLED', true),
        'push_enabled' => env('PUSH_ENABLED', true),
    ],

    // Export
    'export' => [
        'formats' => ['excel', 'csv', 'pdf'],
        'max_rows' => 10000,
    ],
];

