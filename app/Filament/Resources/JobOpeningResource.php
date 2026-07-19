<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobOpeningResource\Pages;
use App\Models\JobOpening;
use App\Rules\LanguageScript;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class JobOpeningResource extends Resource
{
    protected static ?string $model = JobOpening::class;

    protected static ?string $navigationIcon = 'heroicon-o-briefcase';

    protected static ?string $navigationLabel = 'Job openings';

    protected static ?string $modelLabel = 'job opening';

    protected static ?int $navigationSort = 5;

    public const TYPE_LABELS = [
        'full_time' => 'Full time',
        'part_time' => 'Part time',
        'contract' => 'Contract',
        'internship' => 'Internship',
    ];

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Position')->schema([
                Forms\Components\TextInput::make('department')
                    ->placeholder('e.g. Operations')
                    // Suggest the site's standard sections, but allow a new one.
                    ->datalist(JobOpening::DEPARTMENTS)
                    ->helperText('Pick a standard department or type a new one.'),
                Forms\Components\TextInput::make('location')->placeholder('e.g. Larnaca, Cyprus'),
                Forms\Components\Select::make('employment_type')
                    ->options(self::TYPE_LABELS)->required()->default('full_time'),
                Forms\Components\Toggle::make('is_open')->label('Accepting applications')->default(true),
                Forms\Components\DatePicker::make('closes_at')
                    ->label('Closing date')->helperText('Leave empty to keep it open indefinitely.'),
                Forms\Components\TextInput::make('sort')->numeric()->default(0),
            ])->columns(3),

            Forms\Components\Tabs::make('Content')->tabs([
                Forms\Components\Tabs\Tab::make('English')->schema([
                    Forms\Components\TextInput::make('title_en')->required()
                        ->rule(new LanguageScript('latin'))
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($state, Forms\Set $set, ?JobOpening $record) => $record ? null : $set('slug', Str::slug($state))),
                    Forms\Components\Textarea::make('description_en')->rows(8)->required()->rule(new LanguageScript('latin')),
                ]),
                Forms\Components\Tabs\Tab::make('العربية')->schema([
                    Forms\Components\TextInput::make('title_ar')->required()->extraInputAttributes(['dir' => 'rtl'])
                        ->rule(new LanguageScript('arabic')),
                    Forms\Components\Textarea::make('description_ar')->rows(8)->required()->extraInputAttributes(['dir' => 'rtl'])
                        ->rule(new LanguageScript('arabic')),
                ]),
                Forms\Components\Tabs\Tab::make('Français')->schema([
                    Forms\Components\TextInput::make('title_fr')->required()->rule(new LanguageScript('latin')),
                    Forms\Components\Textarea::make('description_fr')->rows(8)->required()->rule(new LanguageScript('latin')),
                ]),
            ])->columnSpanFull(),

            Forms\Components\TextInput::make('slug')->required()->unique(ignoreRecord: true),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title_en')->label('Title')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('department')->searchable()->toggleable(),
                Tables\Columns\TextColumn::make('location')->toggleable(),
                Tables\Columns\TextColumn::make('employment_type')->badge()
                    ->formatStateUsing(fn ($state) => self::TYPE_LABELS[$state] ?? $state),
                Tables\Columns\ToggleColumn::make('is_open')->label('Open'),
                Tables\Columns\TextColumn::make('applications_count')->counts('applications')->label('Applicants'),
                Tables\Columns\TextColumn::make('closes_at')->date('d M Y')->placeholder('—')->sortable(),
            ])
            ->defaultSort('sort')
            ->filters([
                Tables\Filters\TernaryFilter::make('is_open')->label('Accepting applications'),
                Tables\Filters\SelectFilter::make('employment_type')->options(self::TYPE_LABELS),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobOpenings::route('/'),
            'create' => Pages\CreateJobOpening::route('/create'),
            'edit' => Pages\EditJobOpening::route('/{record}/edit'),
        ];
    }
}
