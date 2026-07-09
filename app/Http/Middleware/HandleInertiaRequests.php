<?php

namespace App\Http\Middleware;

use App\Models\Category;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'flash' => [
                'ok' => fn () => $request->session()->get('ok'),
            ],
            // Drives the nav bar's login / account state on every page.
            'auth' => [
                'user' => fn () => $request->user()
                    ? $request->user()->only(['id', 'name', 'email', 'role'])
                    : null,
            ],
            // Categories shared on every page so the nav bar can show its
            // hover dropdown of sections on any route.
            'navCategories' => fn () => Category::query()
                ->withCount('products')
                ->orderBy('sort')
                ->get(['id', 'cid', 'slug', 'name_en', 'name_ar', 'name_fr']),
            // Editable contact details & social links, controlled from the admin.
            'settings' => fn () => Setting::allAsArray(),
        ];
    }
}
