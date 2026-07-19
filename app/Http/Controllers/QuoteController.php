<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    /**
     * A product-bound "Request a Quote". The product name, model and id travel
     * with the form so the sales team always knows exactly which item is meant.
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'string', 'max:60'],
            'destination_country' => ['nullable', 'string', 'max:120'],
            'requirements' => ['nullable', 'string', 'max:3000'],
            'name' => ['required', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:60'],
            'locale' => ['nullable', 'in:en,ar,fr'],
        ]);

        $product = Product::findOrFail($data['product_id']);
        $model = $product->model_number;
        $name = $product->title_en;

        $lines = [
            'Quote request for a product.',
            '',
            'Product: '.$name.' (#'.$product->id.')',
            $model ? 'Model / Part No.: '.$model : null,
            $data['quantity'] ? 'Quantity: '.$data['quantity'] : null,
            $data['destination_country'] ? 'Destination country: '.$data['destination_country'] : null,
            $data['company'] ? 'Company: '.$data['company'] : null,
            '',
            $data['requirements'] ? 'Additional requirements:'.PHP_EOL.$data['requirements'] : null,
        ];

        ContactMessage::create([
            'kind' => 'quote',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'subject' => 'Quote: '.$name.($model ? ' ('.$model.')' : ''),
            'body' => implode(PHP_EOL, array_filter($lines, fn ($l) => $l !== null)),
            'payload' => [
                'product_id' => $product->id,
                'product_name' => $name,
                'model' => $model,
                'quantity' => $data['quantity'] ?? null,
                'destination_country' => $data['destination_country'] ?? null,
            ],
            'locale' => $data['locale'] ?? 'en',
        ]);

        return back()->with('ok', true);
    }

    /**
     * A real RFQ: the customer collected several products into their list and
     * sends them all in one request.
     */
    public function storeRfq(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['nullable', 'string', 'max:60'],
            'items.*.note' => ['nullable', 'string', 'max:500'],
            'destination_country' => ['nullable', 'string', 'max:120'],
            'requirements' => ['nullable', 'string', 'max:3000'],
            'name' => ['required', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:160'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:60'],
            'locale' => ['nullable', 'in:en,ar,fr'],
        ]);

        // Resolve products so stored names/models are authoritative, not client text.
        $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))
            ->get()->keyBy('id');

        $itemLines = [];
        $payloadItems = [];
        foreach ($data['items'] as $i => $item) {
            $p = $products->get($item['product_id']);
            if (! $p) {
                continue;
            }
            $label = ($i + 1).'. '.$p->title_en.' (#'.$p->id.')'
                .($p->model_number ? ' — '.$p->model_number : '')
                .(! empty($item['quantity']) ? ' × '.$item['quantity'] : '')
                .(! empty($item['note']) ? ' — '.$item['note'] : '');
            $itemLines[] = $label;
            $payloadItems[] = [
                'product_id' => $p->id,
                'product_name' => $p->title_en,
                'model' => $p->model_number,
                'quantity' => $item['quantity'] ?? null,
                'note' => $item['note'] ?? null,
            ];
        }

        $lines = array_filter([
            'RFQ — '.count($payloadItems).' item(s).',
            '',
            ...$itemLines,
            '',
            $data['destination_country'] ? 'Destination country: '.$data['destination_country'] : null,
            $data['company'] ? 'Company: '.$data['company'] : null,
            $data['requirements'] ? 'Additional requirements:'.PHP_EOL.$data['requirements'] : null,
        ], fn ($l) => $l !== null);

        ContactMessage::create([
            'kind' => 'rfq',
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'company' => $data['company'] ?? null,
            'subject' => 'RFQ list ('.count($payloadItems).' items)',
            'body' => implode(PHP_EOL, $lines),
            'payload' => [
                'items' => $payloadItems,
                'destination_country' => $data['destination_country'] ?? null,
            ],
            'locale' => $data['locale'] ?? 'en',
        ]);

        return back()->with('ok', true);
    }
}
