<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();

            $table->string('title_en');
            $table->string('title_ar')->nullable();
            $table->string('title_fr')->nullable();

            $table->string('summary_en')->nullable();
            $table->string('summary_ar')->nullable();
            $table->string('summary_fr')->nullable();

            // Language-neutral facts (req #17 fields).
            $table->string('client_name')->nullable();
            $table->string('client_industry')->nullable();
            $table->string('country')->nullable();
            $table->string('equipment_supplied')->nullable();
            $table->date('supplied_date')->nullable();

            $table->text('challenge_en')->nullable();
            $table->text('challenge_ar')->nullable();
            $table->text('challenge_fr')->nullable();

            $table->text('solution_en')->nullable();
            $table->text('solution_ar')->nullable();
            $table->text('solution_fr')->nullable();

            $table->text('result_en')->nullable();
            $table->text('result_ar')->nullable();
            $table->text('result_fr')->nullable();

            $table->string('image')->nullable();
            // The client's Active / Disactive control.
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }
};
