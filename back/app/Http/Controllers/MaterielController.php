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
         try {
             // Rechercher le matériel
             $materiel = Materiel::find($id);
     
             if (!$materiel) {
                 return response()->json([
                     'message' => "Le matériel n'existe pas",
                 ], 404);
             }
             else{
                 // Valider les données du formulaire
             $validator = Validator::make($request->all(), [
                'type_materiel' => 'required|string',
                'etat_materiel' => 'required|string',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            }
            else{
                
                // Mettre à jour les informations du matériel
                $materiel->type_materiel = $request->type_materiel;
                $materiel->etat_materiel = $request->etat_materiel;
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
        //Detail
        $Materiel = Materiel::find($id);
        if(!$Materiel){
            return response()->json([
                'message'=>'Le materiel n\'existe pas',
                "status" =>404
            ],404);
        }
        //suppression du materiel 
        $Materiel->delete();

        //message de suppression reussit

        return response()->json([
            'message' =>"Materiel supprimé avec succès",
            "status" =>200
        ],200);
    }
}
