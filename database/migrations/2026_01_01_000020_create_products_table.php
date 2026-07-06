<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('group')->default('rigs')->comment('rigs | bits | pipes — used for public filters');
            $table->string('title_en');
            $table->string('title_ar');
            $table->string('title_fr');
            $table->text('meta_en')->nullable();
            $table->text('meta_ar')->nullable();
            $table->text('meta_fr')->nullable();
            $table->unsignedInteger('hp')->nullable()->comment('Horsepower badge');
            $table->string('price_note')->nullable()->comment('e.g. 800 EUR — empty means price on request');
            $table->string('image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('sort')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
