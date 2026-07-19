<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CaseStudy extends Model
{
    protected $fillable = [
        'slug',
        'title_en', 'title_ar', 'title_fr',
        'summary_en', 'summary_ar', 'summary_fr',
        'client_name', 'client_industry', 'country', 'equipment_supplied', 'supplied_date',
        'challenge_en', 'challenge_ar', 'challenge_fr',
        'solution_en', 'solution_ar', 'solution_fr',
        'result_en', 'result_ar', 'result_fr',
        'image', 'is_active', 'sort',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'supplied_date' => 'date',
    ];

    protected $appends = ['image_url'];

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        return Str::startsWith($this->image, 'img/')
            ? asset($this->image)
            : Storage::disk('public')->url($this->image);
    }
}
