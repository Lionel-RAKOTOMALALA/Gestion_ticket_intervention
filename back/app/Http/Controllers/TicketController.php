<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TicketReparation;
use Illuminate\Support\Facades\Validator;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = TicketReparation::join('demande_materiel', 'ticketReparation.id_demande', '=', 'demande_materiel.id_demande')
            ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
            ->join('techniciens', 'ticketReparation.id_technicien', '=', 'techniciens.id_technicien')
            ->join('users as technicien_user', 'techniciens.id_user', '=', 'technicien_user.id')
            ->select('ticketReparation.*', 'materiels.type_materiel','materiels.image_materiel_url', 'technicien_user.username as nom_technicien')
            ->get();

        return response()->json([
            'tickets' => $tickets,
            'status' => 200
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'urgence' => 'required|string|max:255',
            'priorite' => 'required|string|max:255',
            'statut_actuel' => 'nullable|string',
            'date_resolution' => 'nullable|date',
            'intervention_faite' => 'nullable|string',
            'suite_a_donnee' => 'nullable|string',
            'id_technicien' => 'required|exists:techniciens,id_technicien',
            'id_demande' => 'required|exists:demande_materiel,id_demande',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }
    
        $ticket = TicketReparation::create($request->all());
        return response()->json(['ticket' => $ticket, 'message' => 'Le ticket a été enregistré avec succès', 'status' => 200], 200);
    }

    public function show($id)
    {
        $ticket = TicketReparation::join('demande_materiel', 'ticketReparation.id_demande', '=', 'demande_materiel.id_demande')
            ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
            ->join('techniciens', 'ticketReparation.id_technicien', '=', 'techniciens.id_technicien')
            ->join('users as technicien_user', 'techniciens.id_user', '=', 'technicien_user.id')
            ->where('ticketReparation.id_ticket', $id)
            ->select('ticketReparation.*', 'materiels.type_materiel', 'technicien_user.username as nom_technicien')
            ->first();

        if (!$ticket) {
            return response()->json([
                'message' => 'Ce ticket de réparation n\'a pas été trouvé',
                'status' => 404,
            ]);
        }

        return response()->json([
            'ticket' => $ticket,
            'status' => 200,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'urgence' => 'required|string|max:255',
            'priorite' => 'required|string|max:255',
            'statut_actuel' => 'nullable|string',
            'date_resolution' => 'nullable|date',
            'intervention_faite' => 'nullable|string',
            'suite_a_donnee' => 'nullable|string',
            'id_technicien' => 'required|exists:techniciens,id_technicien',
            'id_demande' => 'required|exists:demande_materiel,id_demande', 
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'error_list' => $validator->messages(),
            ]);
        }
    
        $ticket = TicketReparation::find($id);
        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket de réparation non trouvé',
                'status' => 404,
            ]);
        }
    
        $ticket->update($request->all());
        return response()->json(['ticket' => $ticket, 'status' => 200, 'message' => 'Modification du ticket réussie'], 200);
    }

    public function destroy($id)
    {
        $ticket = TicketReparation::find($id);
        if (!$ticket) {
            return response()->json([
                'message' => 'Ticket de réparation non trouvé',
                'status' => 404,
            ]);
        }
        $ticket->delete();
        return response()->json(['message' => 'Ticket de réparation supprimé', 'status' => 200], 200);
    }
}
