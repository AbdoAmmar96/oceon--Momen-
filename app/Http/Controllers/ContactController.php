<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['nullable', 'string', 'max:190'],
            'body' => ['required', 'string', 'max:5000'],
            'locale' => ['nullable', 'in:en,ar,fr'],
        ]);

        ContactMessage::create($data + ['locale' => $data['locale'] ?? 'en']);

        return back()->with('ok', true);
    }
}
