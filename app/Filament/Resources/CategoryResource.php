<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use App\Rules\LanguageScript;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static ?string $navigationIcon = 'heroicon-o-squares-2x2';

    protected static ?string $navigationLabel = 'Categories';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Identity')->schema([
                Forms\Components\TextInput::make('cid')
                    ->label('Legacy ID')->numeric()->required()->unique(ignoreRecord: true),
                Forms\Components\TextInput::make('slug')
                    ->required()->unique(ignoreRecord: true)->maxLength(190),
                Forms\Components\TextInput::make('sort')->numeric()->default(0),
            ])->columns(3),
            Forms\Components\Tabs::make('Names')->tabs([
                Forms\Components\Tabs\Tab::make('English')->schema([
                    Forms\Components\TextInput::make('name_en')->label('Name (EN)')->required()
                        ->rule(new LanguageScript('latin')),
                ]),
                Forms\Components\Tabs\Tab::make('العربية')->schema([
                    Forms\Components\TextInput::make('name_ar')->label('الاسم (AR)')
                        ->required()->extraInputAttributes(['dir' => 'rtl'])
                        ->rule(new LanguageScript('arabic')),
                ]),
                Forms\Components\Tabs\Tab::make('Français')->schema([
                    Forms\Components\TextInput::make('name_fr')->label('Nom (FR)')->required()
                        ->rule(new LanguageScript('latin')),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('cid')->label('ID')->sortable(),
                Tables\Columns\TextColumn::make('name_en')->label('Name (EN)')->searchable(),
                Tables\Columns\TextColumn::make('name_ar')->label('الاسم')->searchable(),
                Tables\Columns\TextColumn::make('products_count')->counts('products')->label('Products'),
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
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
