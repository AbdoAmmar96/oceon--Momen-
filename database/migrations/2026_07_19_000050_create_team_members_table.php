<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // Role/title per language; bio is optional per language.
            $table->string('role_en');
            $table->string('role_ar')->nullable();
            $table->string('role_fr')->nullable();
            $table->text('bio_en')->nullable();
            $table->text('bio_ar')->nullable();
            $table->text('bio_fr')->nullable();
            $table->string('photo')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('email')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('team_members');
    }
};
