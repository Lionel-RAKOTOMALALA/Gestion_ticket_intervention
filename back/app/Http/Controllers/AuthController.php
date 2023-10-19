<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserStoreRequest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(),[
            'username' =>'required',
            'email'=>'required',
            'password' => 'required|min:8',
            'nom_entreprise'=>'required',
            'role_user'=>'required', 
        ]);

        if($validator->fails()){
            return response()->json([
                'validation_errors'=>$validator->messages(),
            ]
            );
        }else{
            $user = User::create([
                'username'=>$request->username,
                'email'=>$request->email,
                'password'=>Hash::make($request->password),
                'nom_entreprise'=>$request->nom_entreprise,
                'role_user'=>$request->role_user,
            ]);
            
        $token = $user->createToken($user->email.'_Token')->plainTextToken;

        return response()->json([
            'status' =>200,
            'username' => $user->username,
            'token' =>$token,
            'message' =>'L\'utilisateur a été ajouté avec succes',
        ]);
        }
    }
}