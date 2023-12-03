<?php

namespace App\Http\Controllers;

use App\Models\Materiel;
use App\Http\Requests\MaterielStoreRequest;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MaterielController extends Controller
{
    public function index()
    {
        $user = Auth::user();
    
        if ($user) {
            // Utiliser l'id de l'utilisateur dans la requête
            $id_demandeur = DB::table('demandeurs')
                ->join('users', 'demandeurs.id_user', '=', 'users.id')
                ->select('demandeurs.id_demandeur')
                ->where('demandeurs.id_user', $user->id)
                ->first();
    
            if ($id_demandeur) {
                // L'utilisateur est authentifié, et $id_demandeur contient l'id_demandeur correspondant
                $materiels = Materiel::where('id_demandeur', $id_demandeur->id_demandeur)->get();
    
                return response()->json([
                    'materiels' => $materiels,
                    'status' => 200
                ], 200);
            }
        }
    
        // L'utilisateur n'est pas authentifié ou $id_demandeur est null, gérer en conséquence
        return response()->json([
            'materiels' => [],
            'status' => 404 // Vous pouvez ajuster le statut en fonction de votre logique
        ], 404);
    }
    public function MaterielInDemande()
    {

$materiels = DB::table('materiels')
    ->whereIn('num_serie', function ($query) {
        $query->select('num_serie')
            ->from('demande_materiel');
    })
    ->get();
    return response()->json([
        'materiels' => $materiels,
        'status' => 200
    ], 200);
    }

public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'type_materiel' => 'required|string',
        'description_materiel' => 'required|string',
        'image_materiel_url' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'id_demandeur'=> 'required|exists:demandeurs,id_demandeur',
    ]);

    if ($validator->fails()) {
        return response()->json([
            'validation_errors' => $validator->messages(),
        ]);
    }

    $user = Auth::user();

    // Vérifier si l'utilisateur est authentifié
    if ($user) {
        // Utiliser l'id de l'utilisateur dans la requête
        $id_demandeur = DB::table('demandeurs')
            ->join('users', 'demandeurs.id_user', '=', 'users.id')
            ->select('demandeurs.id_demandeur')
            ->where('demandeurs.id_user', $user->id)
            ->first();  // Utilisez first() au lieu de get()

        if ($request->hasFile('image_materiel_url')) {
            $file = $request->file('image_materiel_url');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(32) . '.' . $extension;
            $file->move('uploads/materiels', $filename);
        } else {
            $filename = null;
        }

        $materiel = Materiel::create([
            'type_materiel' => $request->input('type_materiel'),
            'description_materiel' => $request->input('description_materiel'),
            'image_materiel_url' => $filename,
            'id_demandeur' => $id_demandeur->id_demandeur,  // Accédez à la propriété id_demandeur
        ]);

    } else {
        // L'utilisateur n'est pas authentifié, gérer en conséquence
        $id_demandeur = null;  // Définissez la variable à une valeur par défaut
    }

    return response()->json([
        'status' => 200,
        'filename' => $filename,
        'message' => 'Le matériel a été ajouté avec succès',
    ]);
}



    
    public function show(string $id)
    {
        $materiel = Materiel::find($id);

        if (!$materiel) {
            return response()->json([
                'message' => 'Ce matériel n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'materiel' => $materiel,
            'status' => 200,
        ]);
    }

    public function update(Request $request, string $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'type_materiel' => 'required|string',
                'description_materiel' => 'required|string',
                'image_materiel_url' => 'string|nullable',
                'id_demandeur' => 'required|exists:demandeurs,id_demandeur', 
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            }
    
            $materiel = Materiel::find($id);
    
            if (!$materiel) {
                return response()->json([
                    'message' => "Le matériel n'existe pas",
                    'status' => 404,
                ]);
            }
    
            $materiel->type_materiel = $request->type_materiel;
            $materiel->description_materiel = $request->description_materiel;
            $materiel->image_materiel_url = $request->image_materiel_url;
            $materiel->id_demandeur = $request->id_demandeur; 
            $materiel->save();
    
            return response()->json([
                'message' => "Le matériel a été modifié avec succès",
                'status' => 200,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la modification du matériel",
                'status' => 500,
            ], 500);
        }
    }
    

    public function destroy(string $id)
    {
        $materiel = Materiel::find($id);

        if (!$materiel) {
            return response()->json([
                'message' => 'Ce matériel n\'existe pas',
                'status' => 404,
            ]);
        }

        $materiel->delete();

        return response()->json([
            'message' => "Le matériel a été supprimé avec succès",
            'status' => 200,
        ], 200);
    }
}
