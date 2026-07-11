<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Storage;

class ContactController extends Controller
{
    /** Stream a quote attachment from the private disk — staff only. */
    public function attachment(Request $request, ContactMessage $message, int $index): StreamedResponse
    {
        abort_unless($request->user()?->isStaff(), 403);

        $files = $message->attachments ?? [];
        abort_unless(isset($files[$index]), 404);

        return Storage::disk(ContactMessage::ATTACH_DISK)
            ->download($files[$index]['path'], $files[$index]['name']);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:40'],
            'subject' => ['nullable', 'string', 'max:190'],
            'body' => ['required', 'string', 'max:5000'],
            'locale' => ['nullable', 'in:en,ar,fr'],
            // Specs / drawings clients send with a quote request.
            'files' => ['nullable', 'array', 'max:3'],
            'files.*' => ['file', 'max:10240', 'extensions:pdf,jpg,jpeg,png,dwg,dxf,doc,docx,xls,xlsx'],
        ]);

        $attachments = [];
        foreach ($request->file('files', []) as $file) {
            $attachments[] = [
                'path' => $file->store('quotes', ContactMessage::ATTACH_DISK),
                'name' => $file->getClientOriginalName(),
            ];
        }

        ContactMessage::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'subject' => $data['subject'] ?? null,
            'body' => $data['body'],
            'attachments' => $attachments ?: null,
            'locale' => $data['locale'] ?? 'en',
        ]);

        return back()->with('ok', true);
    }
}
