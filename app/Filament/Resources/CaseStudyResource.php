<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CaseStudyResource\Pages;
use App\Models\CaseStudy;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CaseStudyResource extends Resource
{
    protected static ?string $model = CaseStudy::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Case Studies';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Project facts')->schema([
                Forms\Components\TextInput::make('client_name')->label('Client Name'),
                Forms\Components\TextInput::make('client_industry')->label('Client Industry'),
                Forms\Components\TextInput::make('country')->label('Country'),
                Forms\Components\TextInput::make('equipment_supplied')->label('Equipment Supplied'),
                Forms\Components\DatePicker::make('supplied_date')->label('Supplied Date')->native(false),
                Forms\Components\Toggle::make('is_active')
                    ->label('Active (visible on the site)')->default(true)->inline(false),
                Forms\Components\TextInput::make('sort')->numeric()->default(0),
            ])->columns(3),
            Forms\Components\Tabs::make('Content')->tabs([
                Forms\Components\Tabs\Tab::make('English')->schema([
                    Forms\Components\TextInput::make('title_en')->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, Forms\Set $set, ?CaseStudy $record) => $record ? null : $set('slug', Str::slug($state))),
                    Forms\Components\TextInput::make('summary_en')->label('Short summary'),
                    Forms\Components\Textarea::make('challenge_en')->label('Challenge')->rows(3),
                    Forms\Components\Textarea::make('solution_en')->label('Solution')->rows(3),
                    Forms\Components\Textarea::make('result_en')->label('Result')->rows(3),
                ]),
                Forms\Components\Tabs\Tab::make('العربية')->schema([
                    Forms\Components\TextInput::make('title_ar')->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\TextInput::make('summary_ar')->label('ملخص')->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\Textarea::make('challenge_ar')->label('التحدي')->rows(3)->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\Textarea::make('solution_ar')->label('الحل')->rows(3)->extraInputAttributes(['dir' => 'rtl']),
                    Forms\Components\Textarea::make('result_ar')->label('النتيجة')->rows(3)->extraInputAttributes(['dir' => 'rtl']),
                ]),
                Forms\Components\Tabs\Tab::make('Français')->schema([
                    Forms\Components\TextInput::make('title_fr'),
                    Forms\Components\TextInput::make('summary_fr')->label('Résumé'),
                    Forms\Components\Textarea::make('challenge_fr')->label('Défi')->rows(3),
                    Forms\Components\Textarea::make('solution_fr')->label('Solution')->rows(3),
                    Forms\Components\Textarea::make('result_fr')->label('Résultat')->rows(3),
                ]),
            ])->columnSpanFull(),
            Forms\Components\Section::make('Media & slug')->schema([
                Forms\Components\FileUpload::make('image')
                    ->image()->disk('public')->directory('case-studies')->imageEditor()
                    ->label('Cover image'),
                Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image_url')->label('Image')->square(),
                Tables\Columns\TextColumn::make('title_en')->label('Title')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('client_name')->label('Client')->toggleable(),
                Tables\Columns\TextColumn::make('country')->toggleable(),
                Tables\Columns\ToggleColumn::make('is_active')->label('Active'),
                Tables\Columns\TextColumn::make('sort')->sortable(),
            ])
            ->defaultSort('sort')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_active')->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCaseStudies::route('/'),
            'create' => Pages\CreateCaseStudy::route('/create'),
            'edit' => Pages\EditCaseStudy::route('/{record}/edit'),
        ];
    }
}
