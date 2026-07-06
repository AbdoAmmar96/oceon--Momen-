<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@oceandrilling.co.uk'],
            [
                'name' => 'Ocean Admin',
                'password' => Hash::make('OceanAdmin@2026'),
            ]
        );
    }
}
