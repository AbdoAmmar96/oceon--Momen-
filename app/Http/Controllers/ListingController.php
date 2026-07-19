<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    /** The member's own listings and job applications, whatever their status. */
    public function dashboard(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Dashboard', [
            'listings' => $user->listings()
                ->with('category')
                ->latest()
                ->get(),
            'applications' => $user->jobApplications()
                ->with('jobOpening:id,slug,title_en,title_ar,title_fr')
                ->latest()
                ->get(['id', 'job_opening_id', 'status', 'admin_note', 'cv_name', 'created_at']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Listings/Create', [
            'categories' => $this->categories(),
            'types' => Listing::TYPES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);

        $listing = new Listing([
            ...Arr::except($data, ['image', 'images', 'catalog_pdf']),
            'user_id' => $request->user()->id,
            'slug' => Listing::uniqueSlug($data['title']),
            // Every submission starts hidden; an admin must approve it.
            'status' => Listing::STATUS_PENDING,
        ]);

        $this->attachFiles($request, $listing);
        $listing->save();

        return redirect()->route('dashboard')
            ->with('ok', __('Your listing was submitted and is awaiting admin approval.'));
    }

    public function edit(Request $request, Listing $listing): Response
    {
        $this->authorizeOwner($request, $listing);

        return Inertia::render('Listings/Edit', [
            'listing' => $listing,
            'categories' => $this->categories(),
            'types' => Listing::TYPES,
        ]);
    }

    public function update(Request $request, Listing $listing): RedirectResponse
    {
        $this->authorizeOwner($request, $listing);

        $data = $this->validated($request);
        $listing->fill(Arr::except($data, ['image', 'images', 'catalog_pdf']));

        $this->attachFiles($request, $listing);

        // Edited content has not been reviewed, so it goes back into the queue.
        $listing->status = Listing::STATUS_PENDING;
        $listing->admin_note = null;
        $listing->reviewed_at = null;
        $listing->reviewed_by = null;
        $listing->save();

        return redirect()->route('dashboard')
            ->with('ok', __('Your listing was updated and is awaiting admin approval again.'));
    }

    public function destroy(Request $request, Listing $listing): RedirectResponse
    {
        $this->authorizeOwner($request, $listing);
        $listing->delete();

        return redirect()->route('dashboard')->with('ok', __('Listing deleted.'));
    }

    private function authorizeOwner(Request $request, Listing $listing): void
    {
        abort_unless($listing->user_id === $request->user()->id, 403);
    }

    private function categories()
    {
        return Category::orderBy('sort')->get(['id', 'slug', 'name_en', 'name_ar', 'name_fr']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'type' => ['required', Rule::in(Listing::TYPES)],
            'title' => ['required', 'string', 'max:180'],
            'model' => ['nullable', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:5000'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'price' => ['nullable', 'numeric', 'min:0', 'max:99999999'],
            'currency' => ['nullable', 'string', 'max:8'],
            'price_note' => ['nullable', 'string', 'max:120'],
            'contact_phone' => ['nullable', 'string', 'max:40'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'location' => ['nullable', 'string', 'max:160'],
            'image' => ['nullable', 'image', 'max:4096'],
            'images' => ['nullable', 'array', 'max:8'],
            'images.*' => ['image', 'max:4096'],
            'catalog_pdf' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ]);
    }

    /**
     * Uploads land on the public disk, which is symlinked into the web root,
     * so the model's resolveUrl() can serve them straight from storage.
     */
    private function attachFiles(Request $request, Listing $listing): void
    {
        if ($request->hasFile('image')) {
            $listing->image = $request->file('image')->store('listings', 'public');
        }

        if ($request->hasFile('images')) {
            $listing->images = array_map(
                fn ($file) => $file->store('listings', 'public'),
                $request->file('images'),
            );
        }

        if ($request->hasFile('catalog_pdf')) {
            $listing->catalog_pdf = $request->file('catalog_pdf')->store('listing-catalogs', 'public');
        }
    }
}
