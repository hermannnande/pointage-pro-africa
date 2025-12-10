<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('site_id')->nullable()->constrained()->nullOnDelete();
            
            $table->string('name');
            $table->enum('type', ['FIXED', 'SHIFT'])->default('FIXED');
            
            // Horaires fixes (JSON pour flexibilité)
            // Exemple: {"monday": {"start": "08:00", "end": "17:00", "enabled": true}, ...}
            $table->json('schedule')->nullable();
            
            // Règles
            $table->integer('late_tolerance_minutes')->default(10);
            $table->integer('break_duration_minutes')->default(60);
            $table->integer('daily_hours_threshold')->default(8);
            $table->integer('weekly_hours_threshold')->default(40);
            
            // Taux heures supplémentaires
            $table->decimal('overtime_rate_normal', 5, 2)->default(1.25);
            $table->decimal('overtime_rate_night', 5, 2)->default(1.50);
            $table->decimal('overtime_rate_weekend', 5, 2)->default(1.50);
            $table->decimal('overtime_rate_holiday', 5, 2)->default(2.00);
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_schedules');
    }
};

