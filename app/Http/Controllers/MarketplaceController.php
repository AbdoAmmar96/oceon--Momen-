<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketplaceController extends Controller
{
    /** Public board of member listings — approved rows only. */
    public function index(Request $request): Response
    {
        $type = $request->query('type');

        $listings = Listing::query()
            ->approved()
            ->with(['category', 'user:id,name,country'])
            ->when(in_array($type, Listing::TYPES, true), fn ($q) => $q->where('type', $type))
            ->latest()
            ->get();

        return Inertia::render('Marketplace/Index', [
            'listings' => $listings,
            'categories' => Category::orderBy('sort')->get(['id', 'slug', 'name_en', 'name_ar', 'name_fr']),
            'activeType' => in_array($type, Listing::TYPES, true) ? $type : null,
        ]);
    }

    /**
     * A member's public storefront: every approved listing they've posted, all
     * on one page — the "store within a store" (req #12).
     */
    public function seller(User $user): Response
    {
        $listings = Listing::approved()
            ->with('category')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        // Only members who actually have public listings get a storefront.
        abort_if($listings->isEmpty(), 404);

        return Inertia::render('Marketplace/Seller', [
            'seller' => [
                'id' => $user->id,
                'name' => $user->name,
                'country' => $user->country,
                'member_since' => $user->created_at?->format('Y'),
            ],
            'listings' => $listings,
        ]);
    }

    public function show(Listing $listing): Response
    {
        abort_unless($listing->isApproved(), 404);

        $listing->load(['category', 'user:id,name,country']);

        $related = Listing::approved()
            ->with('category')
            ->where('id', '!=', $listing->id)
            ->where('type', $listing->type)
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('Marketplace/Show', [
            'listing' => $listing,
            'related' => $related,
        ]);
    }
}
