<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;

class SiteSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Site Settings';

    protected static ?string $title = 'Site Settings';

    protected static ?int $navigationSort = 5;

    protected static string $view = 'filament.pages.site-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(Setting::allAsArray());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Contact details')
                    ->description('Shown on the Contact page and in the footer across the whole site.')
                    ->schema([
                        Forms\Components\TextInput::make('contact_phone')->label('Phone (primary)')->tel(),
                        Forms\Components\TextInput::make('contact_email')->label('Email')->email(),
                        Forms\Components\TextInput::make('contact_phone2')->label('Phone 2 (optional)')->tel(),
                        Forms\Components\TextInput::make('contact_phone3')->label('Phone 3 (optional)')->tel(),
                        Forms\Components\TextInput::make('contact_map_query')
                            ->label('Google Maps location')
                            ->helperText('A place or address to show on the map, e.g. "Faneromenis 148, Larnaca, Cyprus".')
                            ->columnSpanFull(),
                    ])->columns(2),

                Forms\Components\Section::make('Address')
                    ->description('The postal address, per language.')
                    ->schema([
                        Forms\Components\TextInput::make('contact_address_en')->label('English'),
                        Forms\Components\TextInput::make('contact_address_ar')->label('العربية')->extraInputAttributes(['dir' => 'rtl']),
                        Forms\Components\TextInput::make('contact_address_fr')->label('Français'),
                    ])->columns(1),

                Forms\Components\Section::make('Social links')
                    ->description('Leave a field empty to hide that icon.')
                    ->schema([
                        Forms\Components\TextInput::make('social_facebook')->label('Facebook')->url(),
                        Forms\Components\TextInput::make('social_x')->label('X / Twitter')->url(),
                        Forms\Components\TextInput::make('social_instagram')->label('Instagram')->url(),
                        Forms\Components\TextInput::make('social_linkedin')->label('LinkedIn')->url(),
                        Forms\Components\TextInput::make('social_youtube')->label('YouTube')->url(),
                        Forms\Components\TextInput::make('social_whatsapp')->label('WhatsApp (link)')->url(),
                    ])->columns(2),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        foreach ($this->form->getState() as $key => $value) {
            Setting::set($key, $value ?? '');
        }

        Notification::make()->title('Settings saved')->success()->send();
    }
}
