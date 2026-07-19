<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            // The site's cut of the sale, set by the admin. The public price shown
            // to buyers is the seller's price increased by this percentage (req #12).
            // 0 means no markup — the seller's price is shown as-is.
            $table->decimal('commission_pct', 5, 2)->default(0)->after('price_note');
        });
    }

    public function down(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->dropColumn('commission_pct');
        });
    }
};
