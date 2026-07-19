<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProductDetailDemoSeeder::class,
            SettingsSeeder::class,
            CaseStudySeeder::class,
            JobOpeningSeeder::class,
            TeamMemberSeeder::class,
            MarketplaceDemoSeeder::class,
        ]);
    }
}
