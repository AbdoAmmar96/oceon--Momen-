<?php

namespace App\Filament\Resources;

use App\Filament\Resources\JobApplicationResource\Pages;
use App\Models\JobApplication;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class JobApplicationResource extends Resource
{
    protected static ?string $model = JobApplication::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationLabel = 'Job applications';

    protected static ?int $navigationSort = 6;

    private const STATUS_LABELS = [
        'new' => 'New',
        'reviewed' => 'Reviewed',
        'shortlisted' => 'Shortlisted',
        'rejected' => 'Rejected',
    ];

    /** Surface how many applications nobody has looked at yet. */
    public static function getNavigationBadge(): ?string
    {
        $fresh = static::getModel()::where('status', 'new')->count();

        return $fresh > 0 ? (string) $fresh : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }

    /** Applications arrive from the site; admins review but never author them. */
    public static function canCreate(): bool
    {
        return false;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Applicant')->schema([
                Forms\Components\TextInput::make('full_name')->disabled(),
                Forms\Components\TextInput::make('email')->disabled(),
                Forms\Components\TextInput::make('phone')->disabled(),
                Forms\Components\TextInput::make('country')->disabled(),
                Forms\Components\TextInput::make('current_title')->label('Current / recent role')->disabled(),
                Forms\Components\TextInput::make('years_experience')->label('Years of experience')->disabled(),
                Forms\Components\TextInput::make('linkedin_url')->label('LinkedIn')->disabled()->url(),
                Forms\Components\TextInput::make('cv_name')->label('CV file')->disabled(),
                Forms\Components\Textarea::make('qualifications')->rows(4)->label('Qualifications & skills')->disabled()->columnSpanFull(),
                Forms\Components\Textarea::make('cover_letter')->rows(6)->disabled()->columnSpanFull(),
            ])->columns(3),

            Forms\Components\Section::make('Review')->schema([
                Forms\Components\Select::make('status')->options(self::STATUS_LABELS)->required(),
                Forms\Components\Textarea::make('admin_note')->rows(2)->label('Note to applicant')
                    ->helperText('Shown to the applicant on their dashboard.'),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('full_name')->label('Applicant')->searchable(),
                Tables\Columns\TextColumn::make('jobOpening.title_en')->label('Position')->searchable()->wrap(),
                Tables\Columns\TextColumn::make('email')->searchable()->copyable()->toggleable(),
                Tables\Columns\TextColumn::make('phone')->copyable()->toggleable(),
                Tables\Columns\TextColumn::make('status')->badge()->colors([
                    'warning' => 'new',
                    'info' => 'reviewed',
                    'success' => 'shortlisted',
                    'danger' => 'rejected',
                ]),
                Tables\Columns\TextColumn::make('created_at')->label('Applied')->dateTime('d M Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options(self::STATUS_LABELS),
                Tables\Filters\SelectFilter::make('job_opening_id')
                    ->relationship('jobOpening', 'title_en')->label('Position')->searchable()->preload(),
            ])
            ->actions([
                Tables\Actions\Action::make('downloadCv')
                    ->label('CV')->icon('heroicon-o-arrow-down-tray')->color('primary')
                    // The CV lives on the private disk, so it is streamed through
                    // the panel rather than exposed at a public URL.
                    ->action(fn (JobApplication $record) => Storage::disk(JobApplication::CV_DISK)
                        ->download($record->cv_path, $record->cv_name))
                    ->visible(fn (JobApplication $record) => Storage::disk(JobApplication::CV_DISK)->exists($record->cv_path)),

                Tables\Actions\Action::make('shortlist')
                    ->icon('heroicon-o-star')->color('success')
                    ->visible(fn (JobApplication $record) => $record->status !== 'shortlisted')
                    ->requiresConfirmation()
                    ->action(fn (JobApplication $record) => $record->update([
                        'status' => 'shortlisted',
                        'reviewed_at' => now(),
                        'reviewed_by' => Auth::id(),
                    ])),

                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListJobApplications::route('/'),
            'edit' => Pages\EditJobApplication::route('/{record}/edit'),
        ];
    }
}
