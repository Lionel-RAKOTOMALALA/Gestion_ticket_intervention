<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemandeurStoreRequest;
use App\Models\Demandeur;

class DemandeurController extends Controller
{
    /**
     * Affiche la liste des demandeurs.
     */
    public function index()
    {
        // Utilisez le modèle Eloquent pour récupérer les demandeurs avec leurs utilisateurs associés
        $demandeurs = Demandeur::join('users', 'demandeurs.id_user', '=', 'users.id')
            ->select('demandeurs.id_demandeur', 'users.nom_entreprise', 'users.username as nom_utilisateur')
            ->get();

        return response()->json([
            'demandeurs' => $demandeurs
        ], 200);
    }

    /**
     * Crée un nouveau demandeur.
     */
    public function store(DemandeurStoreRequest $request)
    {
        try {
            // Créez un nouveau demandeur en utilisant le modèle Eloquent

            Demandeur::create([
                'id_user' => $request->id_user
            ]);

            return response()->json([
                'message' => "Le demandeur a été créé avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Retourne une erreur en JSON en cas d'erreur d'insertion
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion"
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un demandeur spécifique.
     */
    public function show($id)
    {
        // Convertir l'argument en type int
        $id = (int)$id;

        // Détails du demandeur avec les informations de l'utilisateur associé
        $demandeur = Demandeur::join('users', 'demandeurs.id_user', '=', 'users.id')
            ->select('demandeurs.id_demandeur', 'demandeurs.nom_entreprise', 'users.name as nom_utilisateur')
            ->where('demandeurs.id_demandeur', $id)
            ->first();

        if (!$demandeur) {
            return response()->json([
                'message' => 'Ce demandeur n\'a pas été trouvé'
            ], 404);
        }

        // Retourne la réponse en JSON
        return response()->json([
            'demandeur' => $demandeur
        ], 200);
    }

    /**
     * Met à jour les informations d'un demandeur.
     */
    public function update(DemandeurStoreRequest $request, int $id)
    {
        try {
            // Mise à jour des informations du demandeur en utilisant le modèle Eloquent
            $demandeur = Demandeur::find($id);

            if (!$demandeur) {
                return response()->json([
                    'message' => 'Ce demandeur n\'a pas été trouvé'
                ], 404);
            }

            $demandeur->id_user = $request->id_user;
            $demandeur->save();

            return response()->json([
                'message' => "Les informations du demandeur ont été mises à jour avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Message d'erreur en cas de problème
            return response()->json([
                'message' => "Une erreur s'est produite lors de la mise à jour du demandeur"
            ], 500);
        }
    }

    /**
     * Supprime un demandeur.
     */
    public function destroy(int $id)
    {
        // Suppression du demandeur en utilisant le modèle Eloquent
        $demandeur = Demandeur::find($id);
        if (!$demandeur) {
            return response()->json([
                'message' => 'Ce demandeur n\'a pas été trouvé'
            ], 404);
        }

        $demandeur->delete();

        // Message de suppression réussie
        return response()->json([
            'message' => "Demandeur supprimé avec succès"
        ], 200);
    }
}
