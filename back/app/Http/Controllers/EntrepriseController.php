<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;

class EntrepriseController extends Controller
{
    public function index()
    {
        $entreprises = Entreprise::all();

        return response()->json([
            'success' => 200,
            'data' => $entreprises,
        ]);
    }
}
