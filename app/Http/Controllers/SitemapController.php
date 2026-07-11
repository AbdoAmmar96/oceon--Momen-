<?php

namespace App\Http\Controllers;

use App\Models\JobOpening;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = [];

        // Static pages with rough priorities.
        foreach ([
            ['home', 1.0], ['about', 0.8], ['products', 0.9], ['services', 0.8],
            ['contact', 0.7], ['marketplace', 0.7], ['jobs', 0.6],
        ] as [$name, $priority]) {
            $urls[] = ['loc' => route($name), 'priority' => $priority];
        }

        // Every product detail page.
        Product::orderBy('sort')->pluck('slug')->each(function ($slug) use (&$urls) {
            $urls[] = ['loc' => route('products.show', $slug), 'priority' => 0.6];
        });

        // Open job openings.
        JobOpening::open()->pluck('slug')->each(function ($slug) use (&$urls) {
            $urls[] = ['loc' => route('jobs.show', $slug), 'priority' => 0.5];
        });

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

        foreach ($urls as $u) {
            $xml .= '  <url><loc>' . e($u['loc']) . '</loc>'
                . '<changefreq>weekly</changefreq>'
                . '<priority>' . $u['priority'] . '</priority></url>' . "\n";
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }
}
