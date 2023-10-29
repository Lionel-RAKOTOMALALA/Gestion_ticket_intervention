<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use Illuminate\Database\Eloquent\Model;

class Poste extends Model
{
    protected $table = 'postes';
    protected $primaryKey = 'id_poste';
    public $timestamps = true;

    protected $fillable = [
        'nom_poste',
    ];
}

class PosteController extends Controller
{
    /**
     * Affiche la liste des postes.
     */
    public function index()
    {
        $postes = Poste::all();

        return response()->json([
            'postes' => $postes,
            'status' => 200
        ], 200);
    }

    /**
     * Crée un nouveau poste.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom_poste' => 'required|string',
            // Ajoutez d'autres règles de validation si nécessaire
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

        try {
            Poste::create([
                'nom_poste' => $request->nom_poste,
                // Ajoutez d'autres champs si nécessaire
            ]);

            return response()->json([
                'message' => "Le poste a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un poste spécifique.
     */
    public function show(int $id)
    {
        $poste = Poste::find($id);

        if (!$poste) {
            return response()->json([
                'message' => 'Ce poste n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'poste' => $poste,
            'status' => 200,
        ]);
    }

    /**
     * Met à jour un poste.
     */
    public function update(Request $request, int $id)
    {
        try {
            $poste = Poste::find($id);

            if (!$poste) {
                return response()->json([
                    'message' => "Le poste n'existe pas",
                    'status' => 404,
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'nom_poste' => 'required|string',
                    // Ajoutez d'autres règles de validation si nécessaire
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $poste->nom_poste = $request->nom_poste;
                    $poste->save();

                    return response()->json([
                        'message' => "Les informations du poste ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification du poste",
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Supprime un poste.
     */
    public function destroy(int $id)
    {
        $poste = Poste::find($id);

        if (!$poste) {
            return response()->json([
                'message' => 'Ce poste n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        $poste->delete();

        return response()->json([
            'message' => "Poste supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}
