<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\JobOpening;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class JobApplicationController extends Controller
{
    public function store(Request $request, JobOpening $job): RedirectResponse
    {
        abort_unless($job->isOpen(), 404);

        $user = $request->user();

        if ($job->applications()->where('user_id', $user->id)->exists()) {
            throw ValidationException::withMessages([
                'cv' => __('You have already applied to this position.'),
            ]);
        }

        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:180'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:40'],
            'country' => ['nullable', 'string', 'max:100'],
            'current_title' => ['nullable', 'string', 'max:180'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:60'],
            'linkedin_url' => ['nullable', 'url', 'max:255'],
            'qualifications' => ['nullable', 'string', 'max:5000'],
            'cover_letter' => ['nullable', 'string', 'max:5000'],
            'cv' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ]);

        $cv = $request->file('cv');

        JobApplication::create([
            'job_opening_id' => $job->id,
            'user_id' => $user->id,
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'country' => $data['country'] ?? null,
            'current_title' => $data['current_title'] ?? null,
            'years_experience' => $data['years_experience'] ?? null,
            'linkedin_url' => $data['linkedin_url'] ?? null,
            'qualifications' => $data['qualifications'] ?? null,
            'cover_letter' => $data['cover_letter'] ?? null,
            // Private disk: the CV is only reachable through the admin panel.
            'cv_path' => $cv->store('cvs', JobApplication::CV_DISK),
            'cv_name' => $cv->getClientOriginalName(),
        ]);

        return redirect()->route('dashboard')
            ->with('ok', __('Your application was sent. We will contact you soon.'));
    }
}
