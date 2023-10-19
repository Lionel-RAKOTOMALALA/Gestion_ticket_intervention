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
        $materiels = Materiel::all();

        return response()->json([
            'materiels'=>$materiels
        ],200);
    }

    /**
     * Show the form for creating a new resource.
     */
  
    public function store(MaterielStoreRequest $request)
    {
     try{
        //Ajout du materiel
        $validator = Validator::make($request->all(),[
            'type_materiel'=>'required|string',
            'etat_materiel'=>'required|string'
        ]);
        if($validator->fails()){
            return response()->json([
                'status'=>400,
                'error_list' => $validator->messages(),
            ]);
        }
        Materiel::create([
            'type_materiel' => $request->type_materiel,
            'etat_materiel' => $request->etat_materiel,
        ]);
        return response()->json([
            'message' => "Le materiel a été ajouté avec succès",
            'status' => 200,
        ],200);
     }catch(\Exception $e){
        //retourne le query en json
        return response()->json([
            'message' =>"il y a un erreur dans l'insertion"
        ],500);
     }
  
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    { 
        //detail sur le materiel
        $Materiel = Materiel::find($id);
        if(!$Materiel){
            return response()->json([
                'message' => 'Ce matériel n\'a pas été trouvé',
                'status' =>404,
            ]);
        }
        //retourne la reponse fetch en json
        return response()->json([
            'materiels'=>$Materiel,
            'status' => 200,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
   
    public function update(MaterielStoreRequest $request, string $id)
    {
        try{
            //rechercher le matériel
            $Materiel = Materiel::find($id);
            if(!$Materiel){
                return response()->json([
                    'message' => "le materiel n'existe pas"
                ],404);

            }
        $Materiel->type_materiel = $request->type_materiel;
        $Materiel->etat_materiel = $request->etat_materiel;
        $Materiel->save();
        return response()->json([
            'message' => "Le matériel a été modifié avec succès",
            'status' => 200,
        ],200);
        

        }catch(\Exception $e){
            //message d'erreur
            return response()->json([
                'message' => "Le matériel a été modifié avec succès"
            ],200); 
            
        }
    }

    /**
     * Remove the specified resource from storage.
     */  
    public function destroy(string $id)
    {
        //Detail
        $Materiel = Materiel::find($id);
        if(!$Materiel){
            return response()->json([
                'message'=>'Le materiel n\'existe pas'
            ],404);
        }
        //suppression du materiel 
        $Materiel->delete();

        //message de suppression reussit

        return response()->json([
            'message' =>"Materiel supprimé avec succès"
        ],200);
    }
}
