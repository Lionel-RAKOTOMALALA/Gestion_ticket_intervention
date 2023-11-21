<?php

namespace App\Http\Controllers;

use App\Models\UserActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserActivityController extends Controller
{
    /**
     * Affiche la liste des activités d'utilisateur.
     */
    public function index()
    {
        $userActivities = UserActivity::with('user')->get();

        return response()->json([
            'user_activities' => $userActivities,
            'status' => 200,
        ], 200);
    }

    /**
     * Affiche les détails d'une activité d'utilisateur spécifique.
     */
    public function show($id)
    {
        $userActivity = UserActivity::with('user')->find($id);

        if (!$userActivity) {
            return response()->json([
                'message' => 'Cette activité d\'utilisateur n\'a pas été trouvée',
                'status' => 404,
            ]);
        }

        return response()->json([
            'user_activity' => $userActivity,
            'status' => 200,
        ]);
    }

    /**
     * Crée une nouvelle activité d'utilisateur.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'activity_type' => 'required|string',
            'description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

         UserActivity::create($request->all());

        return response()->json([
            'message' => 'L\'activité d\'utilisateur a été créée avec succès',
            'status' => 201,
        ], 201);
    }

    /**
     * Met à jour une activité d'utilisateur.
     */
    public function update(Request $request, $id)
    {
        $userActivity = UserActivity::find($id);

        if (!$userActivity) {
            return response()->json([
                'message' => 'Cette activité d\'utilisateur n\'existe pas',
                'status' => 404,
            ]);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'exists:users,id',
            'activity_type' => 'string',
            'description' => 'string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ], 400);
        }

        $userActivity->update($request->all());

        return response()->json([
            'message' => 'L\'activité d\'utilisateur a été mise à jour avec succès',
            'user_activity' => $userActivity,
            'status' => 200,
        ], 200);
    }

    /**
     * Supprime une activité d'utilisateur.
     */
    public function destroy($id)
    {
        $userActivity = UserActivity::find($id);

        if (!$userActivity) {
            return response()->json([
                'message' => 'Cette activité d\'utilisateur n\'existe pas',
                'status' => 404,
            ]);
        }

        $userActivity->delete();

        return response()->json([
            'message' => 'L\'activité d\'utilisateur a été supprimée avec succès',
            'status' => 200,
        ], 200);
    }
};
