<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Fills a couple of products with the new commercial detail fields and a
 * specification table, so the revamped product page shows the feature working.
 */
class ProductDetailDemoSeeder extends Seeder
{
    public function run(): void
    {
        $p = Product::where('is_featured', true)->orderBy('sort')->first() ?? Product::first();
        if (! $p) {
            return;
        }

        $p->update([
            'model_number' => 'OD-RIG-750X',
            'condition' => 'used',
            'country_of_origin' => 'United States',
            'availability' => 'In stock',
            'lead_time' => '2–4 weeks',
            'specs' => [
                ['label' => 'Rated power', 'value' => '750 HP'],
                ['label' => 'Max drilling depth', 'value' => '3,000 m'],
                ['label' => 'Mast height', 'value' => '38 m'],
                ['label' => 'Hook load', 'value' => '170 t'],
                ['label' => 'Mud pump', 'value' => 'Triplex, 1,300 HP'],
                ['label' => 'Weight', 'value' => '62,000 kg'],
            ],
        ]);
    }
}
