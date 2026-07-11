<?php

namespace App\Http\Middleware;

use App\Support\Seo;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;

class ShareSeo
{
    /**
     * Runs after route-model binding so detail pages can use the bound record.
     * Shares `$seo` with the Inertia root view for server-rendered metadata.
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->isMethod('GET') && ! $request->expectsJson()) {
            View::share('seo', Seo::for($request));
        }

        return $next($request);
    }
}
