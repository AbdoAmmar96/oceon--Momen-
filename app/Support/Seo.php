<?php

namespace App\Support;

use App\Models\CaseStudy;
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

    /** Q&A pairs mirrored into FAQPage structured data (matches the home FAQ). */
    private const FAQ = [
        ['Do you ship worldwide?', 'Yes. We export across the Middle East, Africa and Europe, handling documentation, freight and customs end-to-end.'],
        ['Do you supply new and used equipment?', 'Both — new equipment and inspected used equipment, plus genuine spare parts sourced from trusted international brands.'],
        ['How do I request a quote?', 'Use the Request a Quote button on any product, or add several products to your RFQ list and send one request for all of them.'],
        ['Are the products genuine and inspected?', 'Yes. Our technical team verifies the condition and specification of every item before it ships.'],
        ['Can I sell my own equipment on the site?', 'Yes — create a free account and post through Advertise Here. Our team reviews every listing before it goes live.'],
        ['Which brands do you carry?', 'We hold factory-authorized distribution and hard-to-find sourcing for leading international drilling and industrial brands.'],
    ];

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
        'team' => [
            'title' => 'Our Team',
            'desc' => 'Meet the Ocean Drilling & Trading team — sales, technical and logistics working as one crew on every order.',
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
        'case-studies' => [
            'title' => 'Case Studies — Drilling Supply Projects Delivered',
            'desc' => 'Real drilling supply projects delivered by Ocean Drilling & Trading — from inquiry and sourcing to the rig running on site.',
        ],
        'rfq' => [
            'title' => 'My RFQ List — Request a Quote for Multiple Products',
            'desc' => 'Build a request for quote across several products and send it in one go. Ocean Drilling & Trading replies with clear prices and lead times.',
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

        $caseStudy = $request->route('caseStudy');
        if ($caseStudy instanceof CaseStudy) {
            return [
                $caseStudy->title_en . ' — Case Study | ' . self::BRAND,
                $caseStudy->summary_en ?: Str::limit(strip_tags((string) $caseStudy->challenge_en), 200),
            ];
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
                'streetAddress' => $settings['contact_address_en'] ?? 'Evangelou Papanoutsou 5',
                'addressLocality' => 'Larnaca',
                'postalCode' => '6027',
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
            $node = [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => $product->title_en,
                'description' => $desc,
                'image' => $product->image_url ?: $image,
                'brand' => ['@type' => 'Brand', 'name' => $product->brand ?: self::BRAND],
                'url' => $url,
            ];
            if ($product->model_number) {
                $node['mpn'] = $product->model_number;
                $node['sku'] = $product->model_number;
            }
            if ($product->country_of_origin) {
                $node['countryOfOrigin'] = $product->country_of_origin;
            }
            // Technical specifications as additionalProperty entries.
            if (is_array($product->specs)) {
                $props = [];
                foreach ($product->specs as $spec) {
                    if (! empty($spec['label']) && ! empty($spec['value'])) {
                        $props[] = ['@type' => 'PropertyValue', 'name' => $spec['label'], 'value' => $spec['value']];
                    }
                }
                if ($props) {
                    $node['additionalProperty'] = $props;
                }
            }
            $graph[] = $node;
        }

        $caseStudy = $request->route('caseStudy');
        if ($caseStudy instanceof CaseStudy) {
            $graph[] = [
                '@context' => 'https://schema.org',
                '@type' => 'Article',
                'headline' => $caseStudy->title_en,
                'description' => $desc,
                'image' => $caseStudy->image_url ?: $image,
                'datePublished' => optional($caseStudy->supplied_date)->toDateString(),
                'author' => ['@type' => 'Organization', 'name' => self::BRAND],
                'url' => $url,
            ];
        }

        // FAQ rich-results on the home page, mirroring the on-page FAQ section.
        if ($name === 'home') {
            $graph[] = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => array_map(fn ($f) => [
                    '@type' => 'Question',
                    'name' => $f[0],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $f[1]],
                ], self::FAQ),
            ];
        }

        return json_encode(count($graph) === 1 ? $graph[0] : $graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
