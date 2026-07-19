<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    /** Attachments live on the private disk — admin-only download. */
    public const ATTACH_DISK = 'local';

    protected $fillable = [
        'kind', 'name', 'email', 'phone', 'company', 'subject', 'body',
        'attachments', 'payload', 'locale', 'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'attachments' => 'array',
        'payload' => 'array',
    ];
}
