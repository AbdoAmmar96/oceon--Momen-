<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplication extends Model
{
    public const STATUSES = ['new', 'reviewed', 'shortlisted', 'rejected'];

    /** CVs live on the private disk; there is deliberately no public URL. */
    public const CV_DISK = 'local';

    protected $fillable = [
        'job_opening_id', 'user_id',
        'full_name', 'email', 'phone', 'country',
        'current_title', 'years_experience', 'linkedin_url', 'qualifications',
        'cover_letter',
        'cv_path', 'cv_name',
        'status', 'admin_note', 'reviewed_at', 'reviewed_by',
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function jobOpening(): BelongsTo
    {
        return $this->belongsTo(JobOpening::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
