<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('site_id')->constrained()->onDelete('cascade');
            
            $table->date('date');
            
            // Pointage d'entrée
            $table->timestamp('clock_in')->nullable();
            $table->decimal('clock_in_latitude', 10, 7)->nullable();
            $table->decimal('clock_in_longitude', 10, 7)->nullable();
            $table->string('clock_in_photo')->nullable();
            $table->string('clock_in_device')->nullable();
            $table->ipAddress('clock_in_ip')->nullable();
            
            // Pointage de sortie
            $table->timestamp('clock_out')->nullable();
            $table->decimal('clock_out_latitude', 10, 7)->nullable();
            $table->decimal('clock_out_longitude', 10, 7)->nullable();
            $table->string('clock_out_photo')->nullable();
            $table->string('clock_out_device')->nullable();
            $table->ipAddress('clock_out_ip')->nullable();
            
            // Calculs
            $table->integer('total_minutes')->nullable();
            $table->integer('break_minutes')->default(0);
            $table->integer('work_minutes')->nullable();
            $table->integer('late_minutes')->default(0);
            $table->integer('overtime_minutes')->default(0);
            $table->integer('early_leave_minutes')->default(0);
            
            // Status
            $table->enum('status', ['PRESENT', 'LATE', 'ABSENT', 'HALF_DAY', 'LEAVE'])->default('PRESENT');
            $table->boolean('is_synced')->default(true); // Pour mode offline
            $table->timestamp('synced_at')->nullable();
            
            // Justification
            $table->text('notes')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            
            // Modifications
            $table->boolean('is_modified')->default(false);
            $table->foreignId('modified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('modification_reason')->nullable();
            $table->timestamp('modified_at')->nullable();
            
            $table->timestamps();
            
            // Index pour performance
            $table->unique(['user_id', 'date']);
            $table->index(['date', 'site_id']);
            $table->index(['user_id', 'date', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

