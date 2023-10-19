<?php

namespace App\Http\Controllers;

use App\Http\Requests\TechnicienStoreRequest;
use App\Models\Technicien;
use App\Models\User;


class TechnicienController extends Controller
{
    /**
     * Affiche la liste des techniciens.
     */
    public function index()
    {
        
        // Utilisez le modèle Eloquent pour récupérer les techniciens avec leurs utilisateurs associés
        $techniciens = Technicien::join('users', 'techniciens.id_user', '=', 'users.id')
            ->select('techniciens.id_technicien', 'techniciens.competence', 'users.username as nom_utilisateur')
            ->get();

        return response()->json([
            'techniciens' => $techniciens
        ], 200);
    }

    /**
     * Crée un nouveau technicien.
     */
    public function store(TechnicienStoreRequest $request)
    {
        try {
            // Créez un nouveau technicien en utilisant le modèle Eloquent
            
            Technicien::create([
                'competence' => $request->competence,
                'id_user' => $request->id_user
            ]);

            return response()->json([
                'message' => "Le technicien a été créé avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Retourne une erreur en JSON en cas d'erreur d'insertion
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion"
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un technicien spécifique.
     */
    public function show($id)
    {
        // Convertir l'argument en type int
        $id = (int)$id;
    
        // Détails du technicien avec les informations de l'utilisateur associé
        $techniciens = Technicien::join('users', 'techniciens.id_user', '=', 'users.id')
        ->select('techniciens.id_technicien', 'techniciens.competence', 'users.name as nom_utilisateur')            
        ->where('techniciens.id_technicien', $id)
            ->first();
    
        if (!$techniciens) {
            return response()->json([
                'message' => 'Ce technicien n\'a pas été trouvé'
            ], 404);
        }
    
        // Retourne la réponse en JSON
        return response()->json([
            'technicien' => $techniciens
        ], 200);
    }
    

    /**
     * Met à jour les informations d'un technicien.
     */
    public function update(TechnicienStoreRequest $request, int $id)
    {
        try {
            // Mise à jour des informations du technicien en utilisant le modèle Eloquent
            $technicien = Technicien::find($id);
            if (!$technicien) {
                return response()->json([
                    'message' => 'Ce technicien n\'a pas été trouvé'
                ], 404);
            }

            $technicien->competence = $request->competence;
            $technicien->id_user = $request->id_user;
            $technicien->save();

            return response()->json([
                'message' => "Les informations du technicien ont été mises à jour avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Message d'erreur en cas de problème
            return response()->json([
                'message' => "Une erreur s'est produite lors de la mise à jour du technicien"
            ], 500);
        }
    }

    /**
     * Supprime un technicien.
     */
    public function destroy(int $id)
    {
        // Suppression du technicien en utilisant le modèle Eloquent
        $technicien = Technicien::find($id);
        if (!$technicien) {
            return response()->json([
                'message' => 'Ce technicien n\'a pas été trouvé'
            ], 404);
        }

        $technicien->delete();

        // Message de suppression réussie
        return response()->json([
            'message' => "Technicien supprimé avec succès"
        ], 200);
    }
}
