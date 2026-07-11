<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Home', [
            'categories' => Category::withCount('products')->orderBy('sort')->get(),
            'featured' => Product::with('category')->where('is_featured', true)->orderBy('sort')->take(8)->get(),
        ]);
    }

    public function about(): Response
    {
        return Inertia::render('About');
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
}
