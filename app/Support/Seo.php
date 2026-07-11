<?php

namespace App\Support;

use App\Models\JobOpening;
use App\Models\Listing;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Server-rendered SEO metadata. Computed per request so crawlers get a real
 * <title>, description, canonical, Open Graph tags and JSON-LD without running
 * the React app.
 */
class Seo
{
    private const BRAND = 'Ocean Drilling & Trading';

    /** Static per-route copy, keyed by route name. */
    private const PAGES = [
        'home' => [
            'title' => 'Drilling Rigs, Equipment & Industrial Solutions',
            'desc' => 'Supplying drilling equipment and industrial solutions across the Middle East, Africa and Europe — rigs, mud pumps, DTH hammers, compressors and genuine spare parts.',
        ],
        'about' => [
            'title' => 'Why Ocean Drilling — Global Supply, Fast Delivery & Support',
            'desc' => 'Why operators choose Ocean Drilling: global supply, fast delivery, technical support, genuine spare parts and an experienced team.',
        ],
        'products' => [
            'title' => 'Products — Drilling Rigs, Pumps, Compressors & Parts',
            'desc' => 'Browse drilling and industrial equipment across 13 categories: rigs, mud pumps, DTH hammers & bits, compressors, engines and genuine spare parts.',
        ],
        'services' => [
            'title' => 'Services — Drilling & Trading',
            'desc' => 'Drilling services and factory-authorised trading — sourcing, export logistics and after-sales support for operations worldwide.',
        ],
        'contact' => [
            'title' => 'Contact & Request a Quote',
            'desc' => 'Request a quote or send us your specifications and drawings. Our team responds fast, in English, Arabic and French.',
        ],
        'marketplace' => [
            'title' => 'Advertise Here — Member Marketplace',
            'desc' => 'Buy, rent or offer drilling equipment and services through the Ocean Drilling member marketplace.',
        ],
        'jobs' => [
            'title' => 'Careers',
            'desc' => 'Join the team behind rigs and equipment shipped worldwide. Explore open roles at Ocean Drilling & Trading.',
        ],
    ];

    public static function for(Request $request): array
    {
        $name = $request->route()?->getName();
        $url = $request->url();

        [$title, $desc] = static::copyFor($request, $name);

        $image = asset('img/why-ocean.jpg');

        return [
            'title' => $title,
            'description' => Str::limit($desc, 300, ''),
            'canonical' => $url,
            'image' => $image,
            'brand' => self::BRAND,
            'jsonld' => static::jsonLd($request, $name, $title, $desc, $url, $image),
        ];
    }

    private static function copyFor(Request $request, ?string $name): array
    {
        if (isset(self::PAGES[$name])) {
            $p = self::PAGES[$name];

            return [$p['title'] . ' | ' . self::BRAND, $p['desc']];
        }

        // Detail pages carry the record's own title.
        $product = $request->route('product');
        if ($product instanceof Product) {
            return [
                $product->title_en . ' | ' . self::BRAND,
                $product->meta_en ?: 'Available from Ocean Drilling & Trading — sourced and delivered worldwide.',
            ];
        }

        $job = $request->route('job');
        if ($job instanceof JobOpening) {
            return [$job->title_en . ' — Careers | ' . self::BRAND, Str::limit(strip_tags($job->description_en), 200)];
        }

        $listing = $request->route('listing');
        if ($listing instanceof Listing) {
            return [$listing->title . ' | ' . self::BRAND, Str::limit($listing->description, 200)];
        }

        return [self::BRAND . ' — Drilling Equipment & Industrial Solutions', self::PAGES['home']['desc']];
    }

    private static function jsonLd(Request $request, ?string $name, string $title, string $desc, string $url, string $image): string
    {
        $settings = Setting::allAsArray();
        $home = $request->getSchemeAndHttpHost();

        $org = [
            '@context' => 'https://schema.org',
            '@type' => 'Organization',
            'name' => self::BRAND,
            'url' => $home,
            'logo' => asset('img/logo.png'),
            'image' => $image,
            'email' => $settings['contact_email'] ?? 'info@oceandrilling.co.uk',
            'telephone' => $settings['contact_phone'] ?? '+357 977 53 878',
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $settings['contact_address_en'] ?? 'Faneromenis 148, 3rd Floor, Office 301',
                'addressLocality' => 'Larnaca',
                'addressCountry' => 'CY',
            ],
            'areaServed' => ['Middle East', 'Africa', 'Europe'],
            'sameAs' => array_values(array_filter([
                $settings['social_facebook'] ?? null,
                $settings['social_x'] ?? null,
                $settings['social_instagram'] ?? null,
                $settings['social_linkedin'] ?? null,
                $settings['social_youtube'] ?? null,
            ])),
        ];

        $graph = [$org];

        $product = $request->route('product');
        if ($product instanceof Product) {
            $graph[] = [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $product->title_en,
                'description' => $desc,
                'image' => $product->image_url ?: $image,
                'brand' => ['@type' => 'Brand', 'name' => $product->brand ?: self::BRAND],
                'url' => $url,
            ];
        }

        return json_encode(count($graph) === 1 ? $graph[0] : $graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
