<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Named "job_openings" rather than "jobs" — Laravel's queue driver already
     * owns the `jobs` table.
     */
    public function up(): void
    {
        Schema::create('job_openings', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();

            $table->string('title_en');
            $table->string('title_ar');
            $table->string('title_fr');
            $table->text('description_en');
            $table->text('description_ar');
            $table->text('description_fr');

            $table->string('department')->nullable();
            $table->string('location')->nullable();
            // full_time | part_time | contract | internship
            $table->string('employment_type')->default('full_time');

            $table->boolean('is_open')->default(true)->index();
            $table->date('closes_at')->nullable();
            $table->unsignedInteger('sort')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_openings');
    }
};
