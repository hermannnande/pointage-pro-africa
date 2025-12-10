<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('holidays', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained()->onDelete('cascade');
            
            $table->string('name');
            $table->date('date');
            $table->integer('year');
            
            // Portée
            $table->enum('scope', ['GLOBAL', 'COUNTRY', 'COMPANY'])->default('COMPANY');
            $table->string('country_code', 2)->nullable(); // CI, BF, SN, etc.
            
            $table->boolean('is_paid')->default(true);
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            // Index
            $table->index(['date', 'country_code']);
            $table->index(['company_id', 'year']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('holidays');
    }
};

