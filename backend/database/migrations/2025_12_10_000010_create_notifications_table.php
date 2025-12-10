<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            $table->string('type'); // LEAVE_APPROVED, LATE_ALERT, etc.
            $table->string('title');
            $table->text('message');
            
            $table->json('data')->nullable(); // Données additionnelles
            
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            $table->enum('channel', ['APP', 'SMS', 'EMAIL', 'PUSH'])->default('APP');
            $table->boolean('is_sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            
            $table->timestamps();
            
            // Index
            $table->index(['user_id', 'is_read']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};

