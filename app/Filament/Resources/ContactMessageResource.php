<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    protected static ?string $navigationIcon = 'heroicon-o-envelope';

    protected static ?string $navigationLabel = 'Messages';

    protected static ?int $navigationSort = 3;

    public static function getNavigationBadge(): ?string
    {
        $unread = static::getModel()::where('is_read', false)->count();

        return $unread > 0 ? (string) $unread : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Message')->schema([
                Forms\Components\TextInput::make('name')->disabled(),
                Forms\Components\TextInput::make('email')->disabled(),
                Forms\Components\TextInput::make('phone')->disabled(),
                Forms\Components\TextInput::make('subject')->disabled(),
                Forms\Components\Textarea::make('body')->rows(6)->disabled()->columnSpanFull(),
                Forms\Components\Placeholder::make('attachments')
                    ->label('Attachments (specs / drawings)')
                    ->columnSpanFull()
                    ->content(fn (ContactMessage $record) => new HtmlString(
                        collect($record->attachments ?? [])
                            ->map(fn ($f, $i) => '<a href="' . route('quote.attachment', [$record, $i]) . '" target="_blank" '
                                . 'style="color:#0b6398;text-decoration:underline;display:inline-block;margin:2px 8px 2px 0">⬇ '
                                . e($f['name']) . '</a>')
                            ->implode(' ') ?: '—'
                    )),
                Forms\Components\Toggle::make('is_read')->label('Mark as read'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\IconColumn::make('is_read')->boolean()->label('Read'),
                Tables\Columns\TextColumn::make('name')->searchable()
                    ->weight(fn ($record) => $record->is_read ? null : 'bold'),
                Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('subject')->limit(34)->searchable(),
                Tables\Columns\TextColumn::make('attachments')->label('Files')->badge()->color('info')
                    ->getStateUsing(fn (ContactMessage $r) => ($n = count($r->attachments ?? [])) ? $n : null)
                    ->placeholder('—'),
                Tables\Columns\TextColumn::make('locale')->badge(),
                Tables\Columns\TextColumn::make('created_at')->dateTime('d M Y · H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_read')->label('Read'),
            ])
            ->actions([
                Tables\Actions\Action::make('toggleRead')
                    ->label(fn ($record) => $record->is_read ? 'Mark unread' : 'Mark read')
                    ->icon(fn ($record) => $record->is_read ? 'heroicon-m-envelope' : 'heroicon-m-envelope-open')
                    ->action(fn ($record) => $record->update(['is_read' => ! $record->is_read])),
                Tables\Actions\EditAction::make()->label('Open'),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\BulkAction::make('markRead')
                        ->label('Mark as read')->icon('heroicon-m-envelope-open')
                        ->action(fn ($records) => $records->each->update(['is_read' => true]))
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'edit' => Pages\EditContactMessage::route('/{record}/edit'),
        ];
    }
}
