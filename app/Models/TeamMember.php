<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TeamMember extends Model
{
    protected $fillable = [
        'name',
        'role_en', 'role_ar', 'role_fr',
        'bio_en', 'bio_ar', 'bio_fr',
        'photo', 'linkedin', 'email', 'is_active', 'sort',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): ?string
    {
        if (! $this->photo) {
            return null;
        }

        return Str::startsWith($this->photo, 'img/')
            ? asset($this->photo)
            : Storage::disk('public')->url($this->photo);
    }
}
