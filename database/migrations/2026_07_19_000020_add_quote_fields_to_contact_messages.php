<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            // Distinguishes a plain contact message from a product quote request
            // or a multi-item RFQ, so the admin inbox can group them.
            $table->string('kind')->default('contact')->after('id')->comment('contact | quote | rfq');
            $table->string('company')->nullable()->after('phone');
            // Structured request data: product id/model/quantity for a quote, or
            // the list of items for an RFQ.
            $table->json('payload')->nullable()->after('attachments');
        });
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropColumn(['kind', 'company', 'payload']);
        });
    }
};
