<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    use HasFactory, Notifiable;

    /** Browses and may submit listings for review. */
    public const ROLE_USER = 'user';

    /** A user who has had at least one listing approved. */
    public const ROLE_SELLER = 'seller';

    /** Manages content in the panel, but may only *view* users. */
    public const ROLE_SUB_ADMIN = 'sub_admin';

    /** Full control, including managing staff accounts. */
    public const ROLE_ADMIN = 'admin';

    protected $fillable = ['name', 'email', 'password', 'role', 'phone', 'country'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    public function jobApplications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isSubAdmin(): bool
    {
        return $this->role === self::ROLE_SUB_ADMIN;
    }

    public function isSeller(): bool
    {
        return $this->role === self::ROLE_SELLER;
    }

    /** Anyone allowed inside the admin panel. */
    public function isStaff(): bool
    {
        return $this->isAdmin() || $this->isSubAdmin();
    }

    /**
     * Only staff reach the Filament panel. Public registration is open, so
     * this must never key off something a registrant controls (e.g. e-mail).
     */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->isStaff();
    }
}
