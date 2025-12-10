<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->text('address')->nullable();
            
            // Paramètres
            $table->string('currency', 10)->default('FCFA');
            $table->string('timezone')->default('Africa/Abidjan');
            $table->string('language', 5)->default('fr');
            $table->string('country', 2)->default('CI'); // Côte d'Ivoire
            
            // Configuration
            $table->json('settings')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->timestamp('trial_ends_at')->nullable();
            $table->string('subscription_plan')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};

