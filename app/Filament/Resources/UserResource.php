<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $navigationLabel = 'Members';

    protected static ?int $navigationSort = 4;

    private const ROLES = [
        User::ROLE_USER => 'User (browse + submit)',
        User::ROLE_SELLER => 'Seller (has approved listings)',
        User::ROLE_SUB_ADMIN => 'Sub-admin (manages content, can only view users)',
        User::ROLE_ADMIN => 'Admin (full panel access)',
    ];

    /** Short labels for the table badge; the form uses the fuller ROLES text. */
    private const ROLE_BADGES = [
        User::ROLE_USER => 'User',
        User::ROLE_SELLER => 'Seller',
        User::ROLE_SUB_ADMIN => 'Sub-admin',
        User::ROLE_ADMIN => 'Admin',
    ];

    /** Only a full admin may add accounts; the policy enforces the same rule. */
    public static function canCreate(): bool
    {
        return Auth::user()?->isAdmin() ?? false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('name')->required(),
            Forms\Components\TextInput::make('email')->email()->required()->unique(ignoreRecord: true),
            Forms\Components\Select::make('role')->options(self::ROLES)->required()
                ->helperText('Admin has full access. Sub-admin manages content but cannot edit users.'),
            Forms\Components\TextInput::make('phone'),
            Forms\Components\TextInput::make('country'),
            Forms\Components\TextInput::make('password')
                ->password()->revealable()
                ->dehydrated(fn ($state) => filled($state))
                ->required(fn (string $operation) => $operation === 'create')
                ->helperText('Leave blank to keep the current password.'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('email')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('role')->badge()
                    ->formatStateUsing(fn (string $state) => self::ROLE_BADGES[$state] ?? $state)
                    ->colors([
                        'gray' => User::ROLE_USER,
                        'success' => User::ROLE_SELLER,
                        'warning' => User::ROLE_SUB_ADMIN,
                        'danger' => User::ROLE_ADMIN,
                    ]),
                Tables\Columns\TextColumn::make('listings_count')->counts('listings')->label('Listings'),
                Tables\Columns\TextColumn::make('country')->toggleable(),
                Tables\Columns\TextColumn::make('created_at')->dateTime('d M Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('role')->options(self::ROLES),
            ])
            // Edit and Delete resolve against UserPolicy, so a sub-admin sees
            // neither — leaving them with read-only access to members.
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
