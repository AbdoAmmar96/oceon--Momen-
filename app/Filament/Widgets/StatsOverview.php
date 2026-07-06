<?php

namespace App\Filament\Widgets;

use App\Models\Category;
use App\Models\ContactMessage;
use App\Models\Product;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $unread = ContactMessage::where('is_read', false)->count();

        return [
            Stat::make('Products', Product::count())
                ->description('In the catalogue')
                ->descriptionIcon('heroicon-m-wrench-screwdriver')
                ->color('info'),
            Stat::make('Featured on homepage', Product::where('is_featured', true)->count())
                ->description('Shown in the featured strip')
                ->descriptionIcon('heroicon-m-star')
                ->color('warning'),
            Stat::make('Categories', Category::count())
                ->description('Product sections')
                ->descriptionIcon('heroicon-m-squares-2x2')
                ->color('success'),
            Stat::make('Unread messages', $unread)
                ->description(ContactMessage::count().' total received')
                ->descriptionIcon('heroicon-m-envelope')
                ->color($unread > 0 ? 'danger' : 'gray'),
        ];
    }
}
