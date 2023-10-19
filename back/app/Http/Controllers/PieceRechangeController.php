<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PieceRechange;

class PieceRechangeController extends Controller
{
    public function index()
    {
        $pieces = PieceRechange::all();
        return response()->json(['pieces' => $pieces], 200);
    }

    public function store(Request $request)
    {
        $piece = PieceRechange::create($request->all());
        return response()->json(['piece' => $piece], 201);
    }

    public function show($id)
    {
        $piece = PieceRechange::find($id);
        if (!$piece) {
            return response()->json(['message' => 'Pièce de rechange non trouvée.'], 404);
        }
        return response()->json(['piece' => $piece], 200);
    }

    public function update(Request $request, $id)
    {
        $piece = PieceRechange::find($id);
        if (!$piece) {
            return response()->json(['message' => 'Pièce de rechange non trouvée.'], 404);
        }
        $piece->update($request->all());
        return response()->json(['piece' => $piece], 200);
    }

    public function destroy($id)
    {
        $piece = PieceRechange::find($id);
        if (!$piece) {
            return response()->json(['message' => 'Pièce de rechange non trouvée.'], 404);
        }
        $piece->delete();
        return response()->json(['message' => 'Pièce de rechange supprimée.'], 200);
    }
}
