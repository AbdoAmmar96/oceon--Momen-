<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            [20, 'oilfield-equipment', 'Oilfield Equipment', 'معدات حقول النفط', 'Équipement pétrolier'],
            [18, 'drill-rigs', 'Drill Rigs', 'حفارات', 'Foreuses'],
            [17, 'air-booster-compressors', 'Air & Booster Compressors', 'ضواغط الهواء والمعزّزات', 'Compresseurs air & booster'],
            [16, 'mud-pumps-systems', 'Mud Pumps & Systems', 'مضخات وأنظمة الطين', 'Pompes et systèmes de boue'],
            [15, 'engines-generator-sets', 'Engines & Generator Sets', 'المحركات ومجموعات المولدات', 'Moteurs et groupes électrogènes'],
            [14, 'dth-hammers-bits', 'DTH Hammers & Bits', 'مطارق ولقم DTH', 'Marteaux et taillants SRD'],
            [13, 'components-for-drills', 'Components for Drills', 'مكونات الحفارات', 'Composants pour foreuses'],
            [12, 'drilling-equipment-tooling', 'Drilling Equipment & Tooling', 'معدات وأدوات الحفر', 'Matériel de forage et outillage'],
            [11, 'construction-equipment-machinery', 'Construction Equipment & Machinery', 'معدات وآلات البناء', 'Équipement de construction et machines'],
            [10, 'trucks-pump-hoist-service-water', 'Trucks — Pump Hoist, Service & Water', 'شاحنات — رافعات مضخات وخدمة ومياه', 'Camions — levage de pompes, service & eau'],
            [9, 'spare-parts', 'Spare Parts', 'قطع الغيار', 'Pièces détachées'],
            [8, 'agriculture-equipment', 'Agriculture Equipment', 'المعدات الزراعية', 'Équipements agricoles'],
            [7, 'general-products-equipment', 'General Products & Equipment', 'منتجات ومعدات عامة', 'Produits et équipements généraux'],
        ];

        foreach ($rows as $i => [$cid, $slug, $en, $ar, $fr]) {
            Category::updateOrCreate(['cid' => $cid], [
                'slug' => $slug,
                'name_en' => $en,
                'name_ar' => $ar,
                'name_fr' => $fr,
                'sort' => $i,
            ]);
        }
    }
}
