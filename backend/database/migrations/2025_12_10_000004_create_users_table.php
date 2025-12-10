<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            
            // Informations personnelles
            $table->string('employee_code')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique()->nullable();
            $table->string('phone')->unique();
            $table->string('photo')->nullable();
            
            // Authentification
            $table->string('password');
            $table->string('pin', 6)->nullable(); // PIN pour pointage rapide
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            
            // Informations professionnelles
            $table->foreignId('site_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->string('position')->nullable(); // Poste
            $table->enum('contract_type', ['CDI', 'CDD', 'JOURNALIER', 'STAGIAIRE', 'FREELANCE'])->default('CDI');
            $table->date('hire_date')->nullable();
            $table->date('contract_end_date')->nullable();
            
            // Salaire & congés
            $table->decimal('base_salary', 12, 2)->nullable();
            $table->integer('annual_leave_days')->default(22);
            $table->integer('used_leave_days')->default(0);
            
            // Horaires
            $table->foreignId('work_schedule_id')->nullable()->constrained()->nullOnDelete();
            
            // Paramètres de pointage
            $table->boolean('gps_required')->default(true);
            $table->boolean('selfie_required')->default(false);
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_activity_at')->nullable();
            
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
            
            // Index pour performance
            $table->index(['company_id', 'is_active']);
            $table->index(['site_id', 'is_active']);
            $table->index('employee_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};

