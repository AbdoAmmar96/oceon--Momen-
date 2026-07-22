<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ListingController;
use App\Http\Controllers\MarketplaceController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;

Route::get('/sitemap.xml', [SitemapController::class, 'index'])->name('sitemap');

Route::get('/', [PageController::class, 'home'])->name('home');
/* "About the company" group, mirroring the old site's عن الشركة menu. */
Route::get('/about', [PageController::class, 'about'])->name('about');
Route::get('/objectives', [PageController::class, 'objectives'])->name('objectives');
Route::get('/team', [PageController::class, 'team'])->name('team');
Route::get('/catalog', [PageController::class, 'catalog'])->name('catalog');
Route::get('/products', [PageController::class, 'products'])->name('products');
Route::get('/products/{product:slug}', [PageController::class, 'product'])->name('products.show');
Route::get('/services', [PageController::class, 'services'])->name('services');
Route::get('/contact', [PageController::class, 'contact'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

/* Product-bound quote request and the multi-item RFQ list. */
Route::post('/quote', [QuoteController::class, 'store'])->name('quote.store');
Route::get('/rfq', [PageController::class, 'rfq'])->name('rfq');
Route::post('/rfq', [QuoteController::class, 'storeRfq'])->name('rfq.store');

/* Case studies — public showcase of completed supply projects. */
Route::get('/case-studies', [PageController::class, 'caseStudies'])->name('case-studies');
Route::get('/case-studies/{caseStudy:slug}', [PageController::class, 'caseStudy'])->name('case-studies.show');

/*
 * Marketplace — the "Advertise Here" board. Public pages only ever surface
 * listings an admin has approved.
 */
Route::get('/marketplace', [MarketplaceController::class, 'index'])->name('marketplace');
// A seller's own storefront — all of one member's approved listings.
Route::get('/marketplace/seller/{user}', [MarketplaceController::class, 'seller'])->name('marketplace.seller');

/* Careers — anyone may browse, only signed-in members may apply. */
Route::get('/jobs', [JobController::class, 'index'])->name('jobs');
Route::get('/jobs/{job:slug}', [JobController::class, 'show'])->name('jobs.show');
Route::post('/jobs/{job:slug}/apply', [JobApplicationController::class, 'store'])
    ->middleware('auth')->name('jobs.apply');

Route::middleware('guest')->group(function () {
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [ListingController::class, 'dashboard'])->name('dashboard');

    // Declared before the public {listing:slug} route below so that "create"
    // is not swallowed by the wildcard.
    Route::get('/listings/create', [ListingController::class, 'create'])->name('listings.create');
    Route::post('/listings', [ListingController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
    Route::put('/listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');
});

Route::get('/listings/{listing:slug}', [MarketplaceController::class, 'show'])->name('listings.show');

// Staff-only download of a quote-request attachment (kept off the public disk).
Route::get('/staff/quote/{message}/attachment/{index}', [ContactController::class, 'attachment'])
    ->middleware('auth')->name('quote.attachment');
