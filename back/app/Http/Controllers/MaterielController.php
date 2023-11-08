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
        $materiels = Materiel::all();

        return response()->json([
            'materiels' => $materiels,
            'status' => 200
        ], 200);
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
            'id_demandeur' => $request->input('id_demnadeur'),
        ]);

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
