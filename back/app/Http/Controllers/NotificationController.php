<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::all();
        return response()->json(['notifications' => $notifications], 200);
    }

    public function store(Request $request)
    {
        $notification = Notification::create($request->all());
        return response()->json(['notification' => $notification], 201);
    }

    public function show($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }
        return response()->json(['notification' => $notification], 200);
    }

    public function update(Request $request, $id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }
        $notification->update($request->all());
        return response()->json(['notification' => $notification], 200);
    }

    public function destroy($id)
    {
        $notification = Notification::find($id);
        if (!$notification) {
            return response()->json(['message' => 'Notification non trouvée.'], 404);
        }
        $notification->delete();
        return response()->json(['message' => 'Notification supprimée.'], 200);
    }
}
