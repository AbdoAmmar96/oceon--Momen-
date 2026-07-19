<?php

namespace App\Http\Controllers;

use App\Models\JobOpening;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Jobs/Index', [
            'jobs' => JobOpening::open()
                ->withCount('applications')
                ->orderBy('department')
                ->orderBy('sort')
                ->latest()
                ->get(),
            // The canonical department order carried over from the old site, so
            // the Careers grid always mirrors those sections (req #8).
            'departments' => JobOpening::DEPARTMENTS,
        ]);
    }

    public function show(Request $request, JobOpening $job): Response
    {
        abort_unless($job->isOpen(), 404);

        $user = $request->user();

        return Inertia::render('Jobs/Show', [
            'job' => $job,
            // Drives the form state: apply, "already applied", or "please log in".
            'hasApplied' => $user
                ? $job->applications()->where('user_id', $user->id)->exists()
                : false,
        ]);
    }
}
