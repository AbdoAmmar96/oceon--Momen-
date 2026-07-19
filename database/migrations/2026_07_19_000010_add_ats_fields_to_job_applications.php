<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Structured applicant details so the form captures qualifications and
 * experience up front (req #8) and reads cleanly into an ATS-style pipeline.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->string('current_title')->nullable()->after('country');
            $table->unsignedSmallInteger('years_experience')->nullable()->after('current_title');
            $table->string('linkedin_url')->nullable()->after('years_experience');
            $table->text('qualifications')->nullable()->after('linkedin_url');
        });
    }

    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['current_title', 'years_experience', 'linkedin_url', 'qualifications']);
        });
    }
};
