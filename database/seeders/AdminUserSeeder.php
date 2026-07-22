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
                // Must be set explicitly: on a fresh database the migration's
                // domain backfill runs before this seeder (no users exist yet),
                // so without this the account would default to a plain 'user'
                // role and be unable to reach the /admin panel.
                'role' => User::ROLE_ADMIN,
            ]
        );
    }
}
