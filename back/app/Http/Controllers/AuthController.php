<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{

   
    
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|max:191',
            'email' => 'required|email',
            'password' => 'required|min:8',
            'nom_entreprise' => 'required',
            'role_user' => 'required',
            'photo_profil_user' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:552929',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        if ($request->hasFile('photo_profil_user')) {
            $file = $request->file('photo_profil_user');
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(32) . '.' . $extension;
            $file->move('uploads/users', $filename);
        } else {
            $filename = null;
        }

        $user = User::create([
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
            'role_user' => $request->input('role_user'),
            'logo' => $request->input('logo'), // Assurez-vous que vous avez un champ 'logo' dans votre modèle User
            'sexe' => $request->input('sexe'), // Assurez-vous que vous avez un champ 'sexe' dans votre modèle User
            'photo_profil_user' => $filename,
            'nom_entreprise' => $request->input('nom_entreprise'),
        ]);

        $token = $user->createToken($user->email . '_Token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'filename' => $filename,
            'token' => $token,
            'message' => 'L\'utilisateur a été ajouté avec succès',
        ]);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|max:191',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $user = User::where('username', $request->username)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => "Authentification invalide",
            ]);
        }

        $token = $user->createToken($user->email . '_Token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'username' => $user->username,
            'token' => $token,
            'message' => 'L\'utilisateur a été authentifié avec succès',
        ]);
    }

    public function user(Request $request)
    {
        return response()->json([
            'message' => 'Données de l\'utilisateur récupérées',
            'data' => $request->user(),
        ]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response([
            'message' => 'Déconnexion réussie',
            'status' => 200,
        ], 200);
    }
}
