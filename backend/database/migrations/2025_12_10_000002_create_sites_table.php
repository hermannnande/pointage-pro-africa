<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->string('code')->unique();
            $table->text('address')->nullable();
            
            // Géolocalisation pour pointage GPS
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->integer('radius_meters')->default(100);
            
            // Contact
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            
            // Manager responsable du site
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};

