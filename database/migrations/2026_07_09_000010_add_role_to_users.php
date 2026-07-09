<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('user')->after('email');
            $table->string('phone')->nullable()->after('role');
            $table->string('country')->nullable()->after('phone');
        });

        // Preserve panel access for the staff accounts that relied on the old
        // e-mail-domain check before roles existed.
        DB::table('users')
            ->where('email', 'like', '%@oceandrilling.co.uk')
            ->update(['role' => 'admin']);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'country']);
        });
    }
};
