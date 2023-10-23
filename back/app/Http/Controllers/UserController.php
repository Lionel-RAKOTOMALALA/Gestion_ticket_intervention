<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\UserStoreRequest;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Affiche la liste des utilisateurs.
     */
    public function index()
    {
        $users = User::all();

        return response()->json([
            'users' => $users,
            'status'=>200
        ], 200);
    }

    /**
     * Crée un nouvel utilisateur.
     */
    public function store(UserStoreRequest $request)
    {
        try {
        
            // Créez un nouvel utilisateur
            User::create([
                'username' => $request->username, // Utilisation de 'username' au lieu de 'name'
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role_user' => $request->role_user,
                'logo' => $request->logo,
                'nom_entreprise' => $request->nom_entreprise, 
            ]);
            return response()->json([
                'message' => "L'utilisateur a été créé avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Retourne une erreur en JSON en cas d'erreur d'insertion
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion : " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un utilisateur spécifique.
     */
    public function show(int $id)
    {
        // Détails de l'utilisateur
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'a pas été trouvé'
            ], 404);
        }
        // Retourne la réponse en JSON
        return response()->json([
            'user' => $user
        ], 200);
    }

    /**
     * Met à jour les informations d'un utilisateur.
     */
    public function update(UserStoreRequest $request, int $id)
    {
        try {
            // Recherche de l'utilisateur
            $user = User::find($id);
            if (!$user) {
                return response()->json([
                    'message' => "L'utilisateur n'existe pas"
                ], 404);
            }

            // Mise à jour des informations de l'utilisateur
            $user->username = $request->username; // Utilisation de 'username' au lieu de 'name'
            $user->email = $request->email;
            $user->password = bcrypt($request->password);
            $user->role_user = $request->role_user;
            $user->logo = $request->logo;
            $user->nom_entreprise = $request->nom_entreprise; // Ajout du champ 'logo'
            $user->save();

            return response()->json([
                'message' => "Les informations de l'utilisateur ont été mises à jour avec succès"
            ], 200);
        } catch (\Exception $e) {
            // Message d'erreur en cas de problème
            return response()->json([
                'message' => "Une erreur s'est produite lors de la mise à jour de l'utilisateur : " . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime un utilisateur.
     */
    public function destroy(int $id)
    {
        // Détails de l'utilisateur
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'existe pas'
            ], 404);
        }

        // Suppression de l'utilisateur
        $user->delete();

        // Message de suppression réussie
        return response()->json([
            'message' => "Utilisateur supprimé avec succès"
        ], 200);
    }
}
