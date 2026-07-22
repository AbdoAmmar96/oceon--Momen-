<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TeamMemberResource\Pages;
use App\Models\TeamMember;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TeamMemberResource extends Resource
{
    protected static ?string $model = TeamMember::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    protected static ?string $navigationLabel = 'Team';

    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Person')->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Name (Latin)')
                    ->helperText('Shown on the English and French pages.')
                    ->required(),
                Forms\Components\TextInput::make('name_ar')
                    ->label('الاسم بالعربية')
                    ->helperText('Optional — falls back to the Latin name when empty.')
                    ->extraInputAttributes(['dir' => 'rtl']),
                Forms\Components\FileUpload::make('photo')
                    ->image()->avatar()->disk('public')->directory('team')->imageEditor(),
                Forms\Components\TextInput::make('email')->email(),
                Forms\Components\TextInput::make('linkedin')->url()->label('LinkedIn URL'),
                Forms\Components\Toggle::make('is_active')->label('Show on site')->default(true),
                Forms\Components\TextInput::make('sort')->numeric()->default(0),
            ])->columns(2),
            Forms\Components\Tabs::make('Content')->tabs([
                Forms\Components\Tabs\Tab::make('English')->schema([
                    Forms\Components\TextInput::make('role_en')->label('Role / title')->required(),
                    Forms\Components\Textarea::make('bio_en')->label('Short bio')->rows(3),
                ]),
                Forms\Components\Tabs\Tab::make('العربية')->schema([
                    Forms\Components\TextInput::make('role_ar')->label('المسمى الوظيفي')->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\Textarea::make('bio_ar')->label('نبذة')->rows(3)->extraInputAttributes(['dir' => 'rtl']),
                ]),
                Forms\Components\Tabs\Tab::make('Français')->schema([
                    Forms\Components\TextInput::make('role_fr')->label('Rôle / titre'),
                    Forms\Components\Textarea::make('bio_fr')->label('Courte bio')->rows(3),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('photo_url')->label('Photo')->circular(),
                Tables\Columns\TextColumn::make('name')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('role_en')->label('Role')->toggleable(),
                Tables\Columns\ToggleColumn::make('is_active')->label('Active'),
                Tables\Columns\TextColumn::make('sort')->sortable(),
            ])
            ->defaultSort('sort')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTeamMembers::route('/'),
            'create' => Pages\CreateTeamMember::route('/create'),
            'edit' => Pages\EditTeamMember::route('/{record}/edit'),
        ];
    }
}
