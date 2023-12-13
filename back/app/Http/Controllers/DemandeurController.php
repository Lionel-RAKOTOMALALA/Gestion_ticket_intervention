<?php

namespace App\Http\Controllers;

use App\Http\Requests\DemandeurStoreRequest;
use App\Models\Demandeur;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class DemandeurController extends Controller
{
    /**
     * Affiche la liste des demandeurs.
     */
    public function index()
    {
        // Utilisez le modèle Eloquent pour récupérer les demandeurs avec leurs utilisateurs associés
        $demandeurs = DB::table('demandeurs')
        ->select(
            'demandeurs.id_demandeur',
            'users.username',
            'users.email',
            'users.logo',
            'users.sexe',
            'users.photo_profil_user',
            'entreprises.nom_entreprise',
            'entreprises.logo',
            DB::raw("CASE WHEN users.role_user = 1 THEN 'Admin' ELSE 'Utilisateur simple' END AS role_user"),
            'postes.nom_poste',
            'demandeurs.id_demandeur'
        )
        ->join('users', 'users.id', '=', 'demandeurs.id_user')
        ->join('postes', 'demandeurs.id_poste', '=', 'postes.id_poste')
        ->join('entreprises','users.id_entreprise','=','entreprises.id_entreprise')
        ->get();

        return response()->json([
            'demandeurs' => $demandeurs,
            'status' => 200
        ], 200);
    }


    public function store(DemandeurStoreRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'id_user' => 'required|exists:users,id',
            'id_poste' => 'required|exists:postes,id_poste',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }

        try {
            // Créez un nouveau demandeur en utilisant le modèle Eloquent
            Demandeur::create([
                'id_user' => $request->id_user,
                'id_poste' => $request->id_poste,
            ]);

            return response()->json([
                'message' => "Le demandeur a été créé avec succès",
                'status' =>200
            ], 200);
        } catch (\Exception $e) {
            // Retourne une erreur en JSON en cas d'erreur d'insertion
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion"
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un demandeur spécifique avec le nom du poste.
     */
    public function show($id)
    {
        // Convertir l'argument en type int
        $id = (int)$id;

        // Détails du demandeur avec les informations de l'utilisateur associé
        $demandeur = Demandeur::join('users', 'demandeurs.id_user', '=', 'users.id')
            ->join('postes', 'demandeurs.id_poste', '=', 'postes.id_poste')
            ->join('entreprises','users.id_entreprise','=','entreprises.id_entreprise')
            ->select('demandeurs.id_demandeur','users.photo_profil_user','users.role_user','entreprises.*','users.sexe', 'entreprises.nom_entreprise', 'users.username as nom_utilisateur','users.id as id_user','postes.id_poste as id_poste', 'postes.nom_poste')
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
        $validator = Validator::make($request->all(), [
            'id_user' => 'required|exists:users,id',
            'id_poste' => 'required|exists:postes,id_poste',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }

        try {
            // Mise à jour des informations du demandeur en utilisant le modèle Eloquent
            $demandeur = Demandeur::find($id);

            if (!$demandeur) {
                return response()->json([
                    'message' => 'Ce demandeur n\'a pas été trouvé'
                ], 404);
            }

            $demandeur->id_user = $request->id_user;
            $demandeur->id_poste = $request->id_poste;
            $demandeur->save();

            return response()->json([
                'message' => "Les informations du demandeur ont été mises à jour avec succès",
                'status' => 200
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
    
        // Suppression de l'utilisateur associé au demandeur
        $user = User::find($demandeur->id_user);
        if ($user) {
            $user->delete();
        }
    
        // Suppression du demandeur
        $demandeur->delete();
    
        // Message de suppression réussie
        return response()->json([
            'message' => "Demandeur et utilisateur associé supprimés avec succès",
            'status' => 200
        ], 200);
    }
}
