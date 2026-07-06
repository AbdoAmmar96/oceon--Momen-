<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    protected $fillable = [
        'slug', 'category_id', 'group',
        'title_en', 'title_ar', 'title_fr',
        'meta_en', 'meta_ar', 'meta_fr',
        'hp', 'price_note', 'image', 'images', 'is_featured', 'sort',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'images' => 'array',
    ];

    protected $appends = ['image_url', 'gallery_urls'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Turn a stored path into a public URL. Seeded images live in /public/img/…
     * while admin uploads live on the public disk.
     */
    protected function resolveUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return Str::startsWith($path, 'img/')
            ? asset($path)
            : Storage::disk('public')->url($path);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->resolveUrl($this->image);
    }

    /**
     * Every image for the product detail gallery: the cover first, then any
     * additional gallery photos, de-duplicated.
     */
    public function getGalleryUrlsAttribute(): array
    {
        $paths = array_merge(
            $this->image ? [$this->image] : [],
            is_array($this->images) ? $this->images : [],
        );

        $urls = array_values(array_unique(array_filter(array_map(
            fn ($p) => $this->resolveUrl($p),
            $paths,
        ))));

        return $urls;
    }
}
