<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    /** Brands we distribute — used for the products filter and the admin select. */
    public const BRANDS = [
        'Caterpillar', 'Atlas Copco', 'Gardner Denver', 'Komatsu',
        'Ingersoll Rand', 'Epiroc', 'Cummins', 'Schramm', 'Sandvik',
    ];

    /** Shown as the download until the client uploads real per-product PDFs. */
    public const PLACEHOLDER_CATALOG = 'catalogs/placeholder.pdf';

    protected $fillable = [
        'slug', 'category_id', 'group', 'brand',
        'title_en', 'title_ar', 'title_fr',
        'meta_en', 'meta_ar', 'meta_fr',
        'hp', 'price_note', 'image', 'images', 'catalog_pdf', 'is_featured', 'sort',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'images' => 'array',
    ];

    protected $appends = ['image_url', 'gallery_urls', 'catalog_url'];

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
    /**
     * A downloadable catalogue for the product. Falls back to a shared
     * placeholder PDF so the download button is present before the client
     * has uploaded real spec sheets.
     */
    public function getCatalogUrlAttribute(): string
    {
        if ($this->catalog_pdf) {
            return Str::startsWith($this->catalog_pdf, 'catalogs/')
                ? asset($this->catalog_pdf)
                : Storage::disk('public')->url($this->catalog_pdf);
        }

        return asset(self::PLACEHOLDER_CATALOG);
    }

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
