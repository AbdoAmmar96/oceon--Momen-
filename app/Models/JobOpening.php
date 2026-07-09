<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobOpening extends Model
{
    public const TYPES = ['full_time', 'part_time', 'contract', 'internship'];

    protected $table = 'job_openings';

    protected $fillable = [
        'slug', 'department', 'location', 'employment_type',
        'title_en', 'title_ar', 'title_fr',
        'description_en', 'description_ar', 'description_fr',
        'is_open', 'closes_at', 'sort',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'closes_at' => 'date',
    ];

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    /** Openings the public may see and apply to. */
    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('is_open', true)
            ->where(fn ($q) => $q->whereNull('closes_at')->orWhereDate('closes_at', '>=', now()->toDateString()));
    }

    /** True when the opening still accepts applications. */
    public function isOpen(): bool
    {
        return $this->is_open && (! $this->closes_at || ! $this->closes_at->isPast());
    }

    public static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'job';
        $slug = $base;
        $i = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
