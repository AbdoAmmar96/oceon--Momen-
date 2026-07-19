<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // Extra commercial detail requested for each product. All nullable so
            // the product page only ever renders the fields that are filled in.
            $table->string('model_number')->nullable()->after('brand')->comment('Part Number / Model');
            $table->string('condition')->nullable()->after('model_number')->comment('new | used | refurbished');
            $table->string('country_of_origin')->nullable()->after('condition');
            $table->string('availability')->nullable()->after('country_of_origin')->comment('e.g. In stock, To order');
            $table->string('lead_time')->nullable()->after('availability')->comment('e.g. 2–4 weeks');
            // Technical specifications rendered as a table: [{label, value}, …].
            $table->json('specs')->nullable()->after('lead_time');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'model_number', 'condition', 'country_of_origin',
                'availability', 'lead_time', 'specs',
            ]);
        });
    }
};
