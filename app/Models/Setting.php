<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        $value = static::query()->where('key', $key)->value('value');

        return $value === null || $value === '' ? $default : $value;
    }

    public static function set(string $key, $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /** All settings as a flat key => value array (for the admin form and frontend share). */
    public static function allAsArray(): array
    {
        return static::query()->pluck('value', 'key')->toArray();
    }
}
