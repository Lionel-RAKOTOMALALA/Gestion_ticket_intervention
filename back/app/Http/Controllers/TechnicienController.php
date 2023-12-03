<?php

namespace App\Http\Controllers;

use App\Http\Requests\TechnicienStoreRequest;
use App\Models\Technicien;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class TechnicienController extends Controller
{
    /**
     * Affiche la liste des techniciens.
     */
    public function index()
    {
        
        // Utilisez le modèle Eloquent pour récupérer les techniciens avec leurs utilisateurs associés
        $techniciens = DB::table('users')
    ->select('techniciens.id_technicien', 'users.username', 'users.email', 'users.logo', 'users.sexe', 'users.photo_profil_user', 'entreprises.nom_entreprise', DB::raw("CASE WHEN users.role_user = 1 THEN 'Admin' ELSE 'Utilisateur simple' END AS role_user"), 'techniciens.id_technicien','techniciens.competence')
    ->join('techniciens', 'users.id', '=', 'techniciens.id_user')
    ->join('entreprises','users.id_entreprise','=','entreprises.id_entreprise')
    ->get();
        
        return response()->json([
            'techniciens' => $techniciens,
            'status' => 200
        ], 200);
    }
   

    /**
     * Crée un nouveau technicien.
     */
    public function store(TechnicienStoreRequest $request)
{
    $validator = Validator::make($request->all(), [
        'competence' => 'required|string',
        'id_user' => 'required|integer',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 400,
            'error_list' => $validator->messages(),
        ]);
    }

    try {
        // Créez un nouveau technicien en utilisant le modèle Eloquent
        Technicien::create([
            'competence' => $request->competence,
            'id_user' => $request->id_user
        ]);

        return response()->json([
            'message' => "Le technicien a été créé avec succès",
            'status' => 200
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
    public function show(int $id)
{
    // Recherche du technicien
    $technicien = Technicien::join('users', 'techniciens.id_user', '=', 'users.id')
    ->where('techniciens.id_technicien', $id)
    ->select('techniciens.id_user as id', 'users.username as username', 'techniciens.competence as competence')
    ->first();



    if (!$technicien) {
        return response()->json([
            'message' => 'Ce technicien n\'a pas été trouvé',
            'status' => 404,
        ]);
    }

    // Retourne la réponse en JSON
    return response()->json([
        'technicien' => $technicien,
        'status' => 200,
    ]);
}

    

    /**
     * Met à jour les informations d'un technicien.
     */

     public function update(TechnicienStoreRequest $request, int $id)
     {
         try {
             // Rechercher le technicien
             $technicien = Technicien::find($id);
     
             if (!$technicien) {
                 return response()->json([
                     'message' => "Le technicien n'existe pas",
                 ], 404);
             } else {
                 // Valider les données du formulaire
                 $validator = Validator::make($request->all(), [
                     'competence' => 'required|string',
                     'id_user' => 'required',
                 ]);
     
                 if ($validator->fails()) {
                     return response()->json([
                         'status' => 400,
                         'error_list' => $validator->messages(),
                     ], 400);
                 } else {
                     // Mettre à jour les informations du technicien
                     $technicien->competence = $request->competence;
                     $technicien->id_user = $request->id_user;
                     $technicien->save();
     
                     return response()->json([
                         'message' => "Les informations du technicien ont été mises à jour avec succès",
                         'status' => 200,
                     ], 200);
                 }
             }
         } catch (\Exception $e) {
             // Message d'erreur en cas d'exception
             return response()->json([
                 'message' => "Une erreur est survenue lors de la modification du technicien",
                 'status' => 500,
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

    // Suppression de l'utilisateur associé au technicien
    $user = User::find($technicien->id_user);
    if ($user) {
        $user->delete();
    }

    // Suppression du technicien
    $technicien->delete();

    // Message de suppression réussie
    return response()->json([
        'message' => "Technicien et utilisateur associé supprimés avec succès",
        'status' => 200
    ], 200);
}
}
