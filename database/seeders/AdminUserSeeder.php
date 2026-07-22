<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Creates the first panel administrator.
 *
 * The password is never hard-coded here: this repository is public, so a
 * literal would be a working login for anyone who reads it. Set ADMIN_PASSWORD
 * in .env to choose one, otherwise a random password is generated and printed
 * once so it can be copied and changed on first sign-in.
 */
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL', 'admin@oceandrilling.co.uk');

        $user = User::where('email', $email)->first();

        if (! $user) {
            $password = env('ADMIN_PASSWORD') ?: Str::password(16);

            $user = User::create([
                'name' => 'Ocean Admin',
                'email' => $email,
                'password' => Hash::make($password),
                'role' => User::ROLE_ADMIN,
            ]);

            if (! env('ADMIN_PASSWORD')) {
                $this->command?->warn("Admin created: {$email}");
                $this->command?->warn("Generated password: {$password}");
                $this->command?->warn('Save it now — it is not stored anywhere and will not be shown again.');
            }

            return;
        }

        /*
         * The account already exists. Never touch its password — re-seeding must
         * not reset a password the client has since changed. Only repair the
         * role, which is the part that actually breaks panel access: on a fresh
         * database the migration's domain backfill runs before any user exists,
         * so the account would otherwise be left as a plain 'user'.
         */
        if (! $user->isStaff()) {
            $user->update(['role' => User::ROLE_ADMIN]);
            $this->command?->info("Restored admin role for {$email}.");
        }
    }
}
