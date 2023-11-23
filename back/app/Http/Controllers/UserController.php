<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\DemandeMateriel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Demandeur;


class UserController extends Controller
{
    /**
     * Affiche la liste des utilisateurs.
     */
    public function index()
    {
        $formattedUsers = DB::table('users')
    ->select('users.id', 'users.username', 'users.email', 'users.logo', 'users.sexe', 'users.photo_profil_user', 'users.nom_entreprise', DB::raw("CASE WHEN users.role_user = 1 THEN 'Admin' ELSE 'Utilisateur simple' END AS role_user"), 'demandeurs.id_demandeur')
    ->join('demandeurs', 'users.id', '=', 'demandeurs.id_user')
    ->get();


        return response()->json([
            'users' => $formattedUsers,
            'status' => 200
        ], 200);
    } 
   
    public function imageFetch($filename){
        $path = storage_path('app/uploads/materiels/' . $filename);

        if (!file_exists($path)) {
            abort(404);
        }

        $file = file_get_contents($path);

        return response($file, 200)->header('Content-Type', 'image/jpg');
    }
    public function dashboard(){
        
        DB::statement("SET lc_time_names = 'fr_FR'");
        $result = DB::table('demande_materiel')
        ->select(
            DB::raw("MONTHNAME(demande_materiel.created_at) as mois"),
            DB::raw("users.nom_entreprise as entreprise"),
            DB::raw("COUNT(*) as nombre_demandes")
        )
        ->join('demandeurs', 'demande_materiel.id_demandeur', '=', 'demandeurs.id_demandeur')
        ->join('users', 'demandeurs.id_user', '=', 'users.id')
        ->where('users.nom_entreprise', '!=', '') // Vous pouvez ajouter d'autres conditions ici si nécessaire
        ->groupBy(DB::raw("MONTHNAME(demande_materiel.created_at)"), 'entreprise')
        ->get();

    

    return response()->json([
        'data' => $result,
        'status' => 200
    ], 200);

    }
    public function newUserSpecialisation()
    {
        $users = DB::table('users')
    ->leftJoin('techniciens', 'users.id', '=', 'techniciens.id_user')
    ->leftJoin('demandeurs', 'users.id', '=', 'demandeurs.id_user')
    ->whereNull('techniciens.id_user')
    ->whereNull('demandeurs.id_user')
    ->select('users.*')
    ->get();

    return response()->json([
        'users' => $users,
        'status' => 200
    ], 200);
    }

    public function getTechnicienAdmin(){
        $technicienId = DB::table('techniciens')
    ->join('users', 'techniciens.id_user', '=', 'users.id')
    ->where('users.role_user', 1)
    ->whereIn('users.id', function ($query) {
        $query->select('id_user')
            ->from('techniciens');
    })
    ->value('techniciens.id_technicien as id');  
        return response()->json([
            'admin' => $technicienId,  
            'status' => 200
        ], 200);
    }
    
    
    public function userInTechniciens()
    {
        $users = DB::table('users')
        ->select('techniciens.id_technicien as id_technicien')
        ->join('techniciens', 'users.id', '=', 'techniciens.id_user')
        ->get();
        return response()->json([
            'users' => $users,
            'status' => 200
        ], 200);

       
    }
    public function showIdDemandeur()
    {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json([
                'message' => "Utilisateur non authentifié",
                'status' => 401,
            ]);
        }
    
        $idUser = $user->id;
        $demandeur = Demandeur::where('id_user', $idUser)->first();
    
        if ($demandeur) {
            $idDemandeur = $demandeur->id_demandeur;
    
            return response()->json([
                'id_demandeur' => $idDemandeur,
                'status' => 200,
            ]);
        } else {
            return response()->json([
                'message' => "Demandeur non trouvé pour cet utilisateur",
                'status' => 404,
            ]);
        }
    }
    
    public function getUserData()
    {
        $user = Auth::user();

        if ($user) {

        $results = DB::table('notifications')
            ->select('notifications.*', 'users.*')
            ->join('demande_materiel', 'notifications.id_demande', '=', 'demande_materiel.id_demande')
            ->join('demandeurs', 'demandeurs.id_demandeur', '=', 'demande_materiel.id_demandeur')
            ->join('users', 'demandeurs.id_user', '=', 'users.id')
            ->where('users.id', $user->id)
            ->get();

            return response()->json([
                'user' => $user,
                'notification' => $results,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Aucun utilisateur connecté',
            ], 401);
        }
    }
    public function getDemandesUtilisateur(Request $request)
    {
        $user = auth()->user(); // Assurez-vous que l'utilisateur est connecté

        $demandes = DB::table('demandeurs')
            ->select('demande_materiel.*', 'users.username as demandeur_username', 'users.nom_entreprise as demandeur_entreprise', 'materiels.type_materiel')
            ->join('demande_materiel', 'demandeurs.id_demandeur', '=', 'demande_materiel.id_demandeur')
            ->join('users', 'demandeurs.id_user', '=', 'users.id')
            ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
            ->where('demandeurs.id_user', $user->id)
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
     * Crée un nouvel utilisateur.
     */
    public function showNewUserSpecialisation( $id)
    {

        $users = DB::table('users')
            ->where('id', $id)
            ->orWhere(function ($query) use ($id) {
                $query->where('id', '!=', $id)
                    ->whereNotIn('id', function ($subquery) {
                        $subquery->select('id_user')->from('demandeurs');
                    })
                    ->whereNotIn('id', function ($subquery) {
                        $subquery->select('id_user')->from('techniciens');
                    });
            })
            ->get();
        
      
        

    return response()->json([
        'users' => $users,
        'status' => 200
    ], 200);
    }
    public function store(UserStoreRequest $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string',
            'role_user' => 'string',
            'logo' => 'nullable|string', // Nouveau champ logo
            'sexe' => 'nullable|string', // Nouveau champ sexe
            'photo_profil_user' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Nouveau champ photo_profil_user
            'nom_entreprise' => 'nullable|string', // Nouveau champ nom_entreprise
            // Ajoutez d'autres règles de validation si nécessaire
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }

        try {
                $user = new User;

                $user->username = $request->username;
                $user->email = $request->email;
                $user->password = bcrypt($request->password);
                $user->role_user =  $request->role_user;
                $user->logo = $request->logo;
                $user->sexe = $request->sexe;

                if($request->hasFile('photo_profil_user'))
                {
                    $file = $request->file('photo_profil_user');
                    $extension = $file->getClientOriginalExtension();
                    $filename = time().'.'.$extension;
                    $file->move('uploads/users', $filename);
                    $user->photo_profil_user = 'uploads/users'.$filename;

                }

                $user->nom_entreprise = $request->nom_entreprise; 
                $user->save();
            

            return response()->json([
                'user'=> $user,
                'message' => "L'utilisateur a été créé avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }

    /**
     * Affiche les détails d'un utilisateur spécifique.
     */
    public function show(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'user' => $user,
            'status' => 200,
        ]);
    }

    public function update(UserStoreRequest $request, int $id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => "L'utilisateur n'existe pas",
                    'status' => 404,
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                //     'username' => 'required|string',
                //     'email' => 'required|email|unique:users,email',
                //     'password' => 'string',
                //     'role_user' => 'string',
                //     'logo' => 'nullable|string', // Nouveau champ logo
                //     'sexe' => 'nullable|string', // Nouveau champ sexe
                //     'photo_profil_user' => 'nullable|string', // Nouveau champ photo_profil_user
                //     'nom_entreprise' => 'nullable|string', // Nouveau champ nom_entreprise
                //     // Ajoutez d'autres règles de validation si nécessaire
                ]);

                if ($validator->fails()) {
                    return response()->json([
                        'status' => 400,
                        'error_list' => $validator->messages(),
                    ], 400);
                } else {
                    $user->username = $request->username;
                    $user->email = $request->email;
                    if ($request->password) {
                        $user->password = bcrypt($request->password);
                    }
                    $user->role_user = $request->role_user;
                    $user->logo = $request->logo; // Nouveau champ logo
                    $user->sexe = $request->sexe; // Nouveau champ sexe
                    $user->photo_profil_user = $request->photo_profil_user; // Nouveau champ photo_profil_user
                    $user->nom_entreprise = $request->nom_entreprise; // Nouveau champ nom_entreprise
                    $user->save();

                    return response()->json([
                        'message' => "Les informations de l'utilisateur ont été mises à jour avec succès",
                        'status' => 200,
                    ], 200);
                }
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification de l'utilisateur",
                'status' => 500,
            ], 500);
        }
    }

    /**
     * Supprime un utilisateur.
     */
    public function destroy(int $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'message' => 'Cet utilisateur n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        $user->delete();

        return response()->json([
            'message' => "Utilisateur supprimé avec succès",
            'status' => 200,
        ], 200);
    }

    public function countDemandeurForAuthenticatedUser(Request $request)
    {
        // L'utilisateur authentifié est automatiquement disponible dans la requête
        $user = $request->user();

        // Vérifiez si l'utilisateur est authentifié
        if ($user) {
            // Comptez le nombre de lignes dans la table "demandeur" pour l'utilisateur authentifié
            $demandeurCount = DB::table('demandeurs')
            ->join('users', 'demandeurs.id_user', '=', 'users.id')
            ->where('users.id', $user->id)
            ->count();

            return response()->json(['demandeur_count' => $demandeurCount]);
        }

        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }
    public function countTechnicienForAuthenticatedUser(Request $request)
    {
        // L'utilisateur authentifié est automatiquement disponible dans la requête
        $user = $request->user();

        // Vérifiez si l'utilisateur est authentifié
        if ($user) {
            // Comptez le nombre de lignes dans la table "demandeur" pour l'utilisateur authentifié
            $TechnicienCount = DB::table('techniciens')
            ->join('users', 'techniciens.id_user', '=', 'users.id')
            ->where('users.id', $user->id)
            ->count();

            return response()->json(['technicien_count' => $TechnicienCount]);
        }

        return response()->json(['message' => 'Utilisateur non authentifié'], 401);
    }
}
