<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationLabel = 'Products';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Listing')->schema([
                Forms\Components\Select::make('category_id')
                    ->relationship('category', 'name_en')
                    ->searchable()->preload()->label('Category'),
                Forms\Components\Select::make('group')
                    ->options([
                        'rigs' => 'Drill rigs',
                        'bits' => 'Hammers & bits',
                        'pipes' => 'Pipes & parts',
                    ])->required()->label('Public filter group'),
                Forms\Components\Select::make('brand')
                    ->options(array_combine(Product::BRANDS, Product::BRANDS))
                    ->searchable()->label('Brand')
                    ->helperText('Powers the Brands filter on the products page.'),
                Forms\Components\TextInput::make('hp')->numeric()->label('Horsepower (badge)'),
                Forms\Components\TextInput::make('price_note')
                    ->label('Price note')->placeholder('Empty = price on request'),
                Forms\Components\Toggle::make('is_featured')->label('Show on homepage'),
                Forms\Components\TextInput::make('sort')->numeric()->default(0),
            ])->columns(3),
            Forms\Components\Tabs::make('Content')->tabs([
                Forms\Components\Tabs\Tab::make('English')->schema([
                    Forms\Components\TextInput::make('title_en')->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, Forms\Set $set, ?Product $record) => $record ? null : $set('slug', Str::slug($state))),
                    Forms\Components\Textarea::make('meta_en')->rows(3),
                ]),
                Forms\Components\Tabs\Tab::make('العربية')->schema([
                    Forms\Components\TextInput::make('title_ar')->required()->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\Textarea::make('meta_ar')->rows(3)->extraInputAttributes(['dir' => 'rtl']),
                ]),
                Forms\Components\Tabs\Tab::make('Français')->schema([
                    Forms\Components\TextInput::make('title_fr')->required(),
                    Forms\Components\Textarea::make('meta_fr')->rows(3),
                ]),
            ])->columnSpanFull(),
            Forms\Components\Section::make('Media & slug')->schema([
                Forms\Components\FileUpload::make('image')
                    ->image()->disk('public')->directory('products')
                    ->imageEditor()
                    ->label('Cover image')
                    ->helperText('Main photo shown in listings & as the gallery cover.'),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
                Forms\Components\FileUpload::make('images')
                    ->image()->multiple()->reorderable()->appendFiles()
                    ->disk('public')->directory('products')
                    ->imageEditor()
                    ->label('Gallery images')
                    ->helperText('Extra photos shown on the product page. Drag to reorder.')
                    ->columnSpanFull(),
                Forms\Components\FileUpload::make('catalog_pdf')
                    ->acceptedFileTypes(['application/pdf'])
                    ->disk('public')->directory('catalogs')
                    ->label('Catalogue (PDF)')
                    ->helperText('Per-product spec sheet. Until set, a placeholder is offered.')
                    ->columnSpanFull(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')->label('Image')->square(),
                Tables\Columns\TextColumn::make('title_en')->label('Title')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('group')->badge()
                    ->colors(['primary' => 'rigs', 'warning' => 'bits', 'info' => 'pipes']),
                Tables\Columns\TextColumn::make('brand')->badge()->color('gray')->placeholder('—')->toggleable(),
                Tables\Columns\IconColumn::make('catalog_pdf')->label('PDF')->boolean()->toggleable(),
                Tables\Columns\TextColumn::make('hp')->label('HP')->sortable(),
                Tables\Columns\ToggleColumn::make('is_featured')->label('Featured'),
                Tables\Columns\TextColumn::make('sort')->sortable(),
            ])
            ->defaultSort('sort')
            ->filters([
                Tables\Filters\SelectFilter::make('group')->options([
                    'rigs' => 'Drill rigs', 'bits' => 'Hammers & bits', 'pipes' => 'Pipes & parts',
                ]),
                Tables\Filters\SelectFilter::make('brand')->options(array_combine(Product::BRANDS, Product::BRANDS)),
                Tables\Filters\TernaryFilter::make('is_featured'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
