<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /** Attachments live on the private disk — admin-only download. */
    public const ATTACH_DISK = 'local';

    protected $fillable = ['name', 'email', 'phone', 'subject', 'body', 'attachments', 'locale', 'is_read'];

    protected $casts = [
        'is_read' => 'boolean',
        'attachments' => 'array',
    ];
}
