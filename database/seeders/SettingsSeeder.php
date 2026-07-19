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
            'contact_address_en' => 'Evangelou Papanoutsou 5, Larnaca 6027, Cyprus',
            'contact_address_ar' => 'إيفانجيلو بابانوتسو 5، لارنكا 6027، قبرص',
            'contact_address_fr' => 'Evangelou Papanoutsou 5, Larnaca 6027, Chypre',
            'contact_map_query' => 'Evangelou Papanoutsou 5, Larnaca, Cyprus',
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
