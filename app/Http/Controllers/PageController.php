<?php

namespace App\Http\Controllers;

use App\Models\CaseStudy;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use App\Models\TeamMember;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'categories' => Category::withCount('products')->orderBy('sort')->get(),
            'featured' => Product::with('category')->where('is_featured', true)->orderBy('sort')->take(8)->get(),
            // Newest additions, so the homepage always shows fresh stock (req #3).
            'recent' => Product::with('category')->latest()->take(8)->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
    }

    public function objectives(): Response
    {
        return Inertia::render('Objectives');
    }

    public function team(): Response
    {
        return Inertia::render('Team', [
            'members' => TeamMember::where('is_active', true)->orderBy('sort')->get(),
        ]);
    }

    /**
     * The company catalogue: a downloadable PDF the admin uploads from Site
     * Settings, plus the category index so the range is browsable either way.
     */
    public function catalog(): Response
    {
        $pdf = Setting::get('company_catalog');

        return Inertia::render('Catalog', [
            'catalogUrl' => $pdf ? Storage::disk('public')->url($pdf) : null,
            'categories' => Category::withCount('products')->orderBy('sort')->get(),
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('Products', [
            'products' => Product::with('category')->orderBy('sort')->get(),
            'categories' => Category::withCount('products')->orderBy('sort')->get(),
            // Only brands actually assigned to products, so empty brands never
            // show as dead filter chips.
            'brands' => Product::query()
                ->whereNotNull('brand')
                ->distinct()
                ->orderBy('brand')
                ->pluck('brand'),
        ]);
    }

    public function product(Product $product): Response
    {
        $product->load('category');

        $related = Product::with('category')
            ->where('id', '!=', $product->id)
            ->when($product->category_id, fn ($q) => $q->where('category_id', $product->category_id))
            ->orderBy('sort')
            ->take(4)
            ->get();

        // Not enough in the same category? Top up with other products.
        if ($related->count() < 4) {
            $related = $related->concat(
                Product::with('category')
                    ->where('id', '!=', $product->id)
                    ->whereNotIn('id', $related->pluck('id'))
                    ->orderBy('sort')
                    ->take(4 - $related->count())
                    ->get()
            );
        }

        return Inertia::render('ProductShow', [
            'product' => $product,
            'related' => $related->values(),
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('Services');
    }

    public function contact(): Response
    {
        return Inertia::render('Contact');
    }

    /**
     * The RFQ list page. The cart itself lives in the browser; we hand the page
     * a light index of products so it can resolve the saved ids to real names,
     * images and models.
     */
    public function rfq(): Response
    {
        return Inertia::render('Rfq', [
            'catalog' => Product::query()
                ->orderBy('title_en')
                ->get(['id', 'slug', 'brand', 'model_number', 'image', 'title_en', 'title_ar', 'title_fr'])
                ->map(fn ($p) => [
                    'id' => $p->id,
                    'slug' => $p->slug,
                    'brand' => $p->brand,
                    'model_number' => $p->model_number,
                    'image_url' => $p->image_url,
                    'title_en' => $p->title_en,
                    'title_ar' => $p->title_ar,
                    'title_fr' => $p->title_fr,
                ]),
        ]);
    }

    public function caseStudies(): Response
    {
        return Inertia::render('CaseStudies/Index', [
            'cases' => CaseStudy::where('is_active', true)->orderBy('sort')->latest('supplied_date')->get(),
        ]);
    }

    public function caseStudy(CaseStudy $caseStudy): Response
    {
        abort_unless($caseStudy->is_active, 404);

        return Inertia::render('CaseStudies/Show', [
            'item' => $caseStudy,
            'more' => CaseStudy::where('is_active', true)
                ->where('id', '!=', $caseStudy->id)
                ->orderBy('sort')->take(3)->get(),
        ]);
    }
}
