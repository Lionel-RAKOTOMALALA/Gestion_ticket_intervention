<?php
namespace App\Http\Controllers;

use App\Models\Materiel;
use App\Http\Requests\MaterielStoreRequest;
use Illuminate\Support\Facades\Validator;

class MaterielController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $materiels = Materiel::join('demandeurs', 'materiels.id_demandeur', '=', 'demandeurs.id_demandeur')
    ->join('users', 'demandeurs.id_user', '=', 'users.id')
    ->select('materiels.*', 'users.nom_entreprise as nom_entreprise', 'users.username as nom_demandeur') 
    ->get();

        return response()->json([
            'materiels' => $materiels
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(MaterielStoreRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'type_materiel' => 'required|string',
            'etat_materiel' => 'required|string',
            'id_demandeur' => 'exists:demandeurs,id_demandeur',
            'description_probleme' => 'string', // Ajout de la validation pour la description du problème
            'image_materiel_url' => 'string|nullable' // Ajout de la validation pour l'URL de l'image
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }
    
        try {
            Materiel::create([
                'type_materiel' => $request->type_materiel,
                'etat_materiel' => $request->etat_materiel,
                'id_demandeur' => $request->id_demandeur,
                'description_probleme' => $request->description_probleme,
                'image_materiel_url' => $request->image_materiel_url
            ]);
    
            return response()->json([
                'message' => "Le matériel a été ajouté avec succès",
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $materiel = Materiel::join('demandeurs', 'materiels.id_demandeur', '=', 'demandeurs.id_demandeur')
            ->join('users', 'demandeurs.id_user', '=', 'users.id')
            ->where('materiels.num_serie', $id) // Utilisez num_serie au lieu d'id_demandeur
            ->select('materiels.*', 'users.nom_entreprise as nom_entreprise', 'users.username as nom_demandeur')
            ->first();
    
        if (!$materiel) {
            return response()->json([
                'message' => 'Ce matériel n\'a pas été trouvé',
                'status' => 404,
            ]);
        }
    
        // Retourne la réponse en JSON
        return response()->json([
            'materiel' => $materiel,
            'status' => 200,
        ]);
    }
    

    /**
     * Update the specified resource in storage.
     */
    public function update(MaterielStoreRequest $request, string $id)
{
    try {
        // Rechercher le matériel
        $materiel = Materiel::find($id);

        if (!$materiel) {
            return response()->json([
                'message' => "Le matériel n'existe pas",
            ], 404);
        } else {
            // Valider les données du formulaire
            $validator = Validator::make($request->all(), [
                'type_materiel' => 'required|string',
                'etat_materiel' => 'required|string',
                'id_demandeur' => 'exists:demandeurs,id_demandeur',
                'description_problème' => 'string', // Ajout de la validation pour la description du problème
                'image_materiel_url' => 'string|nullable' // Ajout de la validation pour l'URL de l'image
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            } else {
                // Mettre à jour les informations du matériel
                $materiel->type_materiel = $request->type_materiel;
                $materiel->etat_materiel = $request->etat_materiel;
                $materiel->id_demandeur = $request->id_demandeur;
                $materiel->description_probleme = $request->description_probleme;
                $materiel->image_materiel_url = $request->image_materiel_url;
                $materiel->save();

                return response()->json([
                    'message' => "Le matériel a été modifié avec succès",
                    'status' => 200,
                ], 200);
            }
        }
    } catch (\Exception $e) {
        // Message d'erreur en cas d'exception
        return response()->json([
            'message' => "Une erreur est survenue lors de la modification du matériel",
            'status' => 500,
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Détails sur le matériel
        $materiel = Materiel::find($id);
        if (!$materiel) {
            return response()->json([
                'message' => 'Le matériel n\'existe pas',
                'status' => 404,
            ]);
        }

        // Suppression du matériel
        $materiel->delete();

        // Message de suppression réussie
        return response()->json([
            'message' => "Le matériel a été supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}