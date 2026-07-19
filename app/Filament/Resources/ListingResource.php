<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ListingResource\Pages;
use App\Models\Listing;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;

    protected static ?string $navigationIcon = 'heroicon-o-megaphone';

    protected static ?string $navigationLabel = 'Member listings';

    protected static ?int $navigationSort = 3;

    /** Show how many submissions are waiting, right in the sidebar. */
    public static function getNavigationBadge(): ?string
    {
        $pending = static::getModel()::where('status', Listing::STATUS_PENDING)->count();

        return $pending > 0 ? (string) $pending : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Submission')->schema([
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')->searchable()->preload()
                    ->disabled()->label('Submitted by'),
                Forms\Components\Select::make('type')->options([
                    'sale' => 'For sale',
                    'rent' => 'For rent',
                    'service' => 'Service',
                ])->required(),
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name_en')->searchable()->preload()->label('Category'),
                Forms\Components\TextInput::make('title')->required()->columnSpanFull(),
                Forms\Components\TextInput::make('model')->label('Model / specifications')->columnSpanFull(),
                Forms\Components\Textarea::make('description')->rows(5)->required()->columnSpanFull(),
                Forms\Components\TextInput::make('price')->numeric()->prefix('€')
                    ->helperText("The seller's own price."),
                Forms\Components\TextInput::make('commission_pct')->numeric()->suffix('%')
                    ->default(0)->minValue(0)->maxValue(100)
                    ->label('Site commission')
                    ->helperText('Added on top of the price shown to buyers. 0% = no markup.'),
                Forms\Components\TextInput::make('price_note')->placeholder('e.g. per day, negotiable'),
                Forms\Components\TextInput::make('location'),
                Forms\Components\TextInput::make('contact_phone'),
                Forms\Components\TextInput::make('contact_email')->email(),
            ])->columns(3),

            Forms\Components\Section::make('Media')->schema([
                Forms\Components\FileUpload::make('image')
                    ->image()->disk('public')->directory('listings')->label('Cover image'),
                Forms\Components\FileUpload::make('images')
                    ->image()->multiple()->reorderable()->appendFiles()
                    ->disk('public')->directory('listings')->label('Gallery'),
                Forms\Components\FileUpload::make('catalog_pdf')
                    ->acceptedFileTypes(['application/pdf'])->disk('public')->directory('listing-catalogs')
                    ->label('Product catalogue (PDF)')->columnSpanFull(),
            ])->columns(2),

            Forms\Components\Section::make('Review')->schema([
                Forms\Components\Select::make('status')->options([
                    Listing::STATUS_PENDING => 'Pending review',
                    Listing::STATUS_APPROVED => 'Approved (public)',
                    Listing::STATUS_REJECTED => 'Rejected (hidden)',
                ])->required(),
                Forms\Components\Textarea::make('admin_note')
                    ->rows(2)->label('Note to member')
                    ->helperText('Shown to the member on their dashboard, e.g. why it was rejected.'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')->label('Image')->square(),
                Tables\Columns\TextColumn::make('title')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('type')->badge()->colors([
                    'success' => 'sale', 'warning' => 'rent', 'info' => 'service',
                ]),
                Tables\Columns\TextColumn::make('user.name')->label('Member')->searchable(),
                Tables\Columns\TextColumn::make('price')->money('EUR')->sortable(),
                Tables\Columns\TextColumn::make('status')->badge()->colors([
                    'warning' => Listing::STATUS_PENDING,
                    'success' => Listing::STATUS_APPROVED,
                    'danger' => Listing::STATUS_REJECTED,
                ]),
                Tables\Columns\TextColumn::make('created_at')->dateTime('d M Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options([
                    Listing::STATUS_PENDING => 'Pending review',
                    Listing::STATUS_APPROVED => 'Approved',
                    Listing::STATUS_REJECTED => 'Rejected',
                ])->default(Listing::STATUS_PENDING),
                Tables\Filters\SelectFilter::make('type')->options([
                    'sale' => 'For sale', 'rent' => 'For rent', 'service' => 'Service',
                ]),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check-circle')->color('success')
                    ->visible(fn (Listing $record) => $record->status !== Listing::STATUS_APPROVED)
                    ->requiresConfirmation()
                    ->action(fn (Listing $record) => $record->approve(Auth::user())),

                Tables\Actions\Action::make('reject')
                    ->icon('heroicon-o-x-circle')->color('danger')
                    ->visible(fn (Listing $record) => $record->status !== Listing::STATUS_REJECTED)
                    ->form([
                        Forms\Components\Textarea::make('admin_note')
                            ->label('Reason (shown to the member)')->rows(2),
                    ])
                    ->action(fn (Listing $record, array $data) => $record->reject(Auth::user(), $data['admin_note'] ?? null)),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkAction::make('approveSelected')
                    ->icon('heroicon-o-check-circle')->color('success')
                    ->requiresConfirmation()
                    ->action(function (Collection $records) {
                        $records->each(fn (Listing $r) => $r->approve(Auth::user()));

                        Notification::make()->title('Listings approved')->success()->send();
                    })
                    ->deselectRecordsAfterCompletion(),

                Tables\Actions\DeleteBulkAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListListings::route('/'),
            'edit' => Pages\EditListing::route('/{record}/edit'),
        ];
    }
}
