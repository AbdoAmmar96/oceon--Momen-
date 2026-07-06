<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['cid', 'slug', 'name_en', 'name_ar', 'name_fr', 'sort'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
