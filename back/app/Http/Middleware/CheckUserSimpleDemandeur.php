<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CheckUserSimpleDemandeur
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = auth()->user();

            // Si l'utilisateur a le rôle "admin" ou "user simple, vérifiez également s'il est demandeur
            $isAdmin = $user->tokenCan('server:userSimple');

            if ($isAdmin) {
                $isDemandeur = DB::table('demandeurs')
                    ->join('users', 'demandeurs.id_user', '=', 'users.id')
                    ->where('users.id', $user->id)
                    ->count();

                if ($isDemandeur > 0) {
                    return $next($request);
                }
            }
        }

        return response()->json([
            'status' => 403,
            'message' => 'Accès refusé. Vous devez être un demandeur.'
        ], 403);
    }
}
