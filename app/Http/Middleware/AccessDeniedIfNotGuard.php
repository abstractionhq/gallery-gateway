<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AccessDeniedIfNotGuard
{
	/**
	 * Handle an incoming request.
	 *
	 * @param  \Illuminate\Http\Request  $request
	 * @param  \Closure  $next
	 * @param  string|null  $guard
	 * @return mixed
	 */
	public function handle($request, Closure $next, $guard)
	{	
	    if (!Auth::guard($guard)->check()) {
	        return response()->json(['message' => 'Access Denied'], 403);
	    }
	    return $next($request);
	}
}