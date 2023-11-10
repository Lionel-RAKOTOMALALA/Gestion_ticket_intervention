<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DemandeMateriel;
use Illuminate\Support\Facades\Validator;

class DemandeMaterielController extends Controller
{
    /**
     * Affiche la liste des demandes de matériel.
     */
  public function index()
{
    $demandes = DemandeMateriel::select(
        'demande_materiel.*',
        'users.username as demandeur_username',
        'users.nom_entreprise as demandeur_entreprise',
        'materiels.type_materiel'
    )
    ->join('users', 'demande_materiel.id_demandeur', '=', 'users.id')
    ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
    ->get();

    if ($demandes) {
        return response()->json([
            'demandes' => $demandes,
            'status' => 200
        ], 200);
    } else {
        return response()->json([
            'message' => 'Aucune demande de matériel trouvée',
            'status' => 404
        ], 404);
    }
}


    /**
     * Crée une nouvelle demande de matériel.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'etat_materiel' => 'required|string',
            'status' => 'required',
            'description_probleme' => 'required|string',
            'num_serie' => 'required|integer',
            'id_demandeur' => 'integer|nullable',
            // Ajoutez d'autres règles de validation si nécessaire
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

        try {
            DemandeMateriel::create([
                'etat_materiel' => $request->etat_materiel,
                'status' => $request->status,
                'description_probleme' => $request->description_probleme,
                'num_serie' => $request->num_serie,
                'id_demandeur' => $request->id_demandeur,
                // Ajoutez d'autres champs si nécessaire
            ]);

            return response()->json([
                'message' => "La demande de matériel a été créée avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'une demande de matériel spécifique.
     */
    public function show($id)
{
    $demande = DemandeMateriel::select(
        'demande_materiel.*',
        'users.username as demandeur_username',
        'materiels.type_materiel'
    )
    ->join('users', 'demande_materiel.id_demandeur', '=', 'users.id')
    ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
    ->find($id);

    if (!$demande) {
        return response()->json([
            'message' => 'Cette demande de matériel n\'a pas été trouvée',
            'status' => 404,
        ]);
    }

    return response()->json([
        'demande' => $demande,
        'status' => 200,
    ]);
}


    /**
     * Met à jour une demande de matériel.
     */
    public function update(Request $request, $id)
    {
        try {
            $demande = DemandeMateriel::find($id);

            if (!$demande) {
                return response()->json([
                    'message' => "La demande de matériel n'existe pas",
                    'status' => 404,
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'etat_materiel' => 'required|string',
                    'description_probleme' => 'required|string',
                    'num_serie' => 'required|integer',
                    'id_demandeur' => 'integer|nullable',
                    // Ajoutez d'autres règles de validation si nécessaire
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $demande->etat_materiel = $request->etat_materiel;
                    $demande->description_probleme = $request->description_probleme;
                    $demande->num_serie = $request->num_serie;
                    $demande->id_demandeur = $request->id_demandeur;
                    // Mettez à jour d'autres champs si nécessaire
                    $demande->save();

                    return response()->json([
                        'message' => "Les informations de la demande de matériel ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification de la demande de matériel",
                'status' => 500,
            ], 500);
        }
    }
    public function validationDemande(Request $request, $id)
{
    try {
        $demande = DemandeMateriel::find($id);

        if (!$demande) {
            return response()->json([
                'message' => "La demande de matériel n'existe pas",
                'status' => 404,
            ]);
        } else {
            
                $demande->status = 'Validé';
                $demande->save();

                return response()->json([
                    'message' => "Les informations de la demande de matériel ont été mises à jour avec succès",
                    'status' => 200,
                ], 200);
            
        }
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Une erreur est survenue lors de la modification de la demande de matériel",
            'status' => 500,
        ], 500);
    }
}
public function rejectDemande(Request $request, $id)
{
    try {
        $demande = DemandeMateriel::find($id);

        if (!$demande) {
            return response()->json([
                'message' => "La demande de matériel n'existe pas",
                'status' => 404,
            ]);
        } else {
            
                $demande->status = 'rejeté';
                $demande->save();

                return response()->json([
                    'message' => "Les informations de la demande de matériel ont été mises à jour avec succès",
                    'status' => 200,
                ], 200);
            
        }
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Une erreur est survenue lors de la modification de la demande de matériel",
            'status' => 500,
        ], 500);
    }
}

    /**
     * Supprime une demande de matériel.
     */
    public function destroy($id)
    {
        $demande = DemandeMateriel::find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Cette demande de matériel n\'a pas été trouvée',
                'status' => 404,
            ]);
        }

        $demande->delete();

        return response()->json([
            'message' => "Demande de matériel supprimée avec succès",
            'status' => 200,
        ], 200);
    }
}
