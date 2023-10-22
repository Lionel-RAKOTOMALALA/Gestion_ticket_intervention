<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

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
        ]);

        if ($validator->fails()) {
            return response()->json([
                'validation_errors' => $validator->messages(),
            ]);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nom_entreprise' => $request->nom_entreprise,
            'role_user' => $request->role_user,
        ]);

        $token = $user->createToken($user->email . '_Token')->plainTextToken;

        return response()->json([
            'status' => 200,
            'username' => $user->username,
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
