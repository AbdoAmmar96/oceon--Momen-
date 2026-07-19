<?php

namespace Database\Seeders;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * A sample verified seller with a few approved listings, so the "Advertise
 * Here" marketplace and the seller storefront (req #12) are demonstrable out of
 * the box — including the site commission that lifts the buyer-facing price.
 */
class MarketplaceDemoSeeder extends Seeder
{
    public function run(): void
    {
        $seller = User::firstOrCreate(
            ['email' => 'seller@example.com'],
            [
                'name' => 'Gulf Drilling Traders',
                'password' => Hash::make('Seller@2026'),
                'role' => User::ROLE_SELLER,
                'phone' => '+971 50 123 4567',
                'country' => 'United Arab Emirates',
            ],
        );

        $listings = [
            [
                'type' => 'sale',
                'title' => 'Used Atlas Copco Air Compressor — XAS 750',
                'model' => 'Atlas Copco XAS 750 · 750 CFM · 10.3 bar',
                'description' => 'Well-maintained portable diesel air compressor, 750 CFM. Recently serviced, ready for immediate dispatch. Ideal for DTH drilling support.',
                'price' => 12500,
                'commission_pct' => 5,
                'price_note' => 'negotiable',
                'location' => 'Dubai, UAE',
            ],
            [
                'type' => 'rent',
                'title' => 'Water Well Drilling Rig — Rental (per month)',
                'description' => 'Truck-mounted water well drilling rig available for monthly rental across the Gulf. Operator can be arranged. Depth capacity up to 300 m.',
                'price' => 8000,
                'commission_pct' => 10,
                'price_note' => 'per month',
                'location' => 'Abu Dhabi, UAE',
            ],
            [
                'type' => 'service',
                'title' => 'On-site Rig Inspection & Maintenance',
                'description' => 'Certified technicians for on-site inspection, servicing and troubleshooting of drilling rigs and mud pumps. Fast turnaround across the region.',
                'price' => null,
                'commission_pct' => 0,
                'price_note' => null,
                'location' => 'Regional',
            ],
        ];

        foreach ($listings as $l) {
            Listing::firstOrCreate(
                ['slug' => Listing::uniqueSlug($l['title'])],
                array_merge($l, [
                    'user_id' => $seller->id,
                    'currency' => 'EUR',
                    'contact_phone' => $seller->phone,
                    'contact_email' => $seller->email,
                    'status' => Listing::STATUS_APPROVED,
                    'reviewed_at' => now(),
                ]),
            );
        }
    }
}
