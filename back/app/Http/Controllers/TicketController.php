<?php

namespace App\Http\Controllers;

use App\Http\Requests\TicketStoreRequest;
use App\Models\Demandeur;
use App\Models\Materiel;
use App\Models\TicketReparation;
use App\Models\User;
class TicketController extends Controller
{
    /**
     * Affiche la liste des tickets de réparation.
    */  
    public function index()
    {
        $tickets = TicketReparation::with(['materiels', 'demandeurs', 'techniciens'])
            ->select(
                'id_ticket',
                'date_creation',
                'urgence',
                'priorite',
                'description_probleme',
                'statut_actuel',
                'date_resolution',
                'cout_reparation',
                'intervention_faite',
                'suite_a_donnee',
                'materiel.type_materiel',
                'demandeur.nom_entreprise as nom_demandeur',
                'technicien.user.name as nom_technicien'
            )
            ->get();

        return response()->json(['tickets' => $tickets], 200);
    }

    public function store(TicketStoreRequest $request)
    {
        try {
            $id_demandeur = User::where('nom_entreprise', $request->nom_entreprise)->value('id');
        $id_materiel = Materiel::where('type_materiel', $request->type_materiel)->value('num_serie');
        $id_technicien = User::where('username', $request->nom_utilisateur)->value('id');

        // Vérifiez si l'une des valeurs d'ID est null, ce qui signifie que l'utilisateur ou le demandeur n'a pas été trouvé
        if ($id_demandeur === null || $id_materiel === null || $id_technicien === null) {
            return response()->json([
                'message' => 'L\'utilisateur, le demandeur ou le technicien n\'a pas été trouvé.'
            ], 400); // Utilisez un code de réponse HTTP approprié, par exemple 400 pour Bad Request
        }

            $ticket = TicketReparation::create([
                'urgence' => $request->urgence,
                'priorite' => $request->priorite,
                'description_probleme' => $request->description_probleme,
                'statut_actuel' => $request->statut_actuel,
                'date_resolution' => $request->date_resolution,
                'cout_reparation' => $request->cout_reparation,
                'num_serie' => $id_materiel,
                'id_demandeur' => $id_technicien,
                'id_technicien' => $id_technicien,
                'intervention_faite' => $request->intervention_faite,
                'suite_a_donnee' => $request->suite_a_donnee,
            ]);

            return response()->json([
                'message' => 'Le ticket de réparation a été créé avec succès',
                'ticket' => $ticket,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Il y a une erreur dans l\'insertion : ' . $e->getMessage(),
            ], 500);
        }
    }    
        
    public function show($id)
    {
        // Convertir l'argument en type int
        $id = (int)$id;
    
        // Détails du ticket de réparation avec le nom du technicien
        $ticket = TicketReparation::join('materiels', 'ticketReparation.num_serie', '=', 'materiels.num_serie')
            ->join('demandeurs', 'ticketReparation.id_demandeur', '=', 'demandeurs.id_demandeur')
            ->join('techniciens', 'ticketReparation.id_technicien', '=', 'techniciens.id_technicien')
            ->join('users', 'techniciens.id_user', '=', 'users.id')
            ->select(
                'ticketReparation.id_ticket',
                'ticketReparation.date_creation',
                'ticketReparation.urgence',
                'ticketReparation.priorite',
                'ticketReparation.description_probleme',
                'ticketReparation.statut_actuel',
                'ticketReparation.date_resolution',
                'ticketReparation.cout_reparation',
                'materiels.type_materiel',
                'demandeurs.nom_entreprise as nom_demandeur',
                'users.name as nom_technicien'
            )
            ->where('ticketReparation.id_ticket', $id)
            ->first();
    
        if (!$ticket) {
            return response()->json([
                'message' => 'Ce ticket de réparation n\'a pas été trouvé'
            ], 404);
        }
    
        // Retourne la réponse en JSON
        return response()->json([
            'ticket' => $ticket
        ], 200);
    }
    
    
    
    public function update(TicketStoreRequest $request, int $id)
    {
        try {
            $ticket = TicketReparation::find($id);

            if (!$ticket) {
                return response()->json([
                    'message' => 'Ce ticket de réparation n\'a pas été trouvé',
                ], 404);
            }

            $id_demandeur = User::where('nom_entreprise', $request->nom_entreprise)->value('id');
            $id_materiel = Materiel::where('type_materiel', $request->type_materiel)->value('num_serie');
            $id_technicien = User::where('username', $request->nom_utilisateur)->value('id');
    
            // Vérifiez si l'une des valeurs d'ID est null, ce qui signifie que l'utilisateur ou le demandeur n'a pas été trouvé
            if ($id_demandeur === null || $id_materiel === null || $id_technicien === null) {
                return response()->json([
                    'message' => 'L\'utilisateur, le demandeur ou le technicien n\'a pas été trouvé.'
                ], 400); // Utilisez un code de réponse HTTP approprié, par exemple 400 pour Bad Request
            }

            $ticket->update([
                'urgence' => $request->urgence,
                'priorite' => $request->priorite,
                'description_probleme' => $request->description_probleme,
                'statut_actuel' => $request->statut_actuel,
                'date_resolution' => $request->date_resolution,
                'cout_reparation' => $request->cout_reparation,
                'num_serie' => $id_materiel,
                'id_demandeur' => $id_technicien,
                'id_technicien' => $id_technicien,
                'intervention_faite' => $request->intervention_faite,
                'suite_a_donnee' => $request->suite_a_donnee,
            ]);

            return response()->json([
                'message' => 'Les informations du ticket de réparation ont été mises à jour avec succès',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur s\'est produite lors de la mise à jour du ticket de réparation : ' . $e->getMessage(),
            ], 500);
        }
    }
   
public function destroy(int $id)
{
    try {
        // Recherche du ticket de réparation par son ID
        $ticket = TicketReparation::find($id);

        if (!$ticket) {
            return response()->json([
                'message' => 'Ce ticket de réparation n\'a pas été trouvé'
            ], 404);
        }

        // Suppression du ticket de réparation en utilisant le modèle Eloquent
        $ticket->delete();

        return response()->json([
            'message' => 'Le ticket de réparation a été supprimé avec succès'
        ], 200);
    } catch (\Exception $e) {
        // Message d'erreur en cas de problème
        return response()->json([
            'message' => 'Une erreur s\'est produite lors de la suppression du ticket de réparation'
        ], 500);
    }
}

}