<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'contact_phone' => '+357 977 53 878',
            'contact_phone2' => '+353 87 170 2860',
            'contact_phone3' => '+213 541 21 54 88',
            'contact_email' => 'info@oceandrilling.co.uk',
            'contact_address_en' => 'Faneromenis 148, 3rd Floor, Office 301, 6035 Larnaca, Cyprus',
            'contact_address_ar' => 'فانيروميني 148، الطابق الثالث، مكتب 301، 6035 لارنكا، قبرص',
            'contact_address_fr' => 'Faneromenis 148, 3e étage, bureau 301, 6035 Larnaca, Chypre',
            'contact_map_query' => 'Faneromenis 148, Larnaca, Cyprus',
            'social_facebook' => 'https://www.facebook.com/ocean.drilling',
            'social_x' => 'https://twitter.com/OceanDrilling',
            'social_instagram' => 'https://www.instagram.com/ocean.drilling/',
            'social_linkedin' => 'https://www.linkedin.com/in/ocean-drilling-382789155/',
            'social_youtube' => 'https://www.youtube.com/channel/UCSR9sanE8NIHQcjHmtEutGA',
            'social_whatsapp' => '',
        ];

        foreach ($defaults as $key => $value) {
            // Only create if missing — never overwrite admin edits on reseed.
            Setting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
