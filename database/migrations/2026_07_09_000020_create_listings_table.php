<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            // sale | rent | service
            $table->string('type');

            $table->string('slug')->unique();
            $table->string('title');
            $table->text('description');

            $table->decimal('price', 12, 2)->nullable();
            $table->string('currency', 8)->default('EUR');
            // e.g. "per day", "negotiable" — free text shown next to the price.
            $table->string('price_note')->nullable();

            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('location')->nullable();

            $table->string('image')->nullable();
            $table->json('images')->nullable();

            // pending | approved | rejected — nothing is public until approved.
            $table->string('status')->default('pending')->index();
            $table->text('admin_note')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['status', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('listings');
    }
};
