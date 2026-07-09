<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Listing extends Model
{
    public const TYPES = ['sale', 'rent', 'service'];

    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'user_id', 'category_id', 'type', 'slug', 'title', 'description',
        'price', 'currency', 'price_note',
        'contact_phone', 'contact_email', 'location',
        'image', 'images',
        'status', 'admin_note', 'reviewed_at', 'reviewed_by',
    ];

    protected $casts = [
        'images' => 'array',
        'price' => 'decimal:2',
        'reviewed_at' => 'datetime',
    ];

    protected $appends = ['image_url', 'gallery_urls'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    /** Only approved listings are ever visible to the public. */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /** Publish the listing and promote its author to a verified seller. */
    public function approve(?User $admin = null): void
    {
        $this->update([
            'status' => self::STATUS_APPROVED,
            'admin_note' => null,
            'reviewed_at' => now(),
            'reviewed_by' => $admin?->id,
        ]);

        if ($this->user && $this->user->role === User::ROLE_USER) {
            $this->user->update(['role' => User::ROLE_SELLER]);
        }
    }

    public function reject(?User $admin = null, ?string $note = null): void
    {
        $this->update([
            'status' => self::STATUS_REJECTED,
            'admin_note' => $note,
            'reviewed_at' => now(),
            'reviewed_by' => $admin?->id,
        ]);
    }

    /**
     * Build a unique slug from the title, e.g. "Drill Rig 750hp" -> drill-rig-750hp-7.
     */
    public static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'listing';
        $slug = $base;
        $i = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

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

    public function getGalleryUrlsAttribute(): array
    {
        $paths = array_merge(
            $this->image ? [$this->image] : [],
            is_array($this->images) ? $this->images : [],
        );

        return array_values(array_unique(array_filter(array_map(
            fn ($p) => $this->resolveUrl($p),
            $paths,
        ))));
    }
}
