<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DemandeMateriel;
use Illuminate\Support\Facades\Validator;
use App\Models\UserActivity;
use App\Models\TicketReparation;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DemandeMaterielController extends Controller
{
    public function index()
    {
        $demandes = DB::table('demandeurs')
        ->select('demande_materiel.*', 'users.username as demandeur_username', 'entreprises.nom_entreprise as demandeur_entreprise', 'materiels.type_materiel')
        ->join('demande_materiel', 'demandeurs.id_demandeur', '=', 'demande_materiel.id_demandeur')
        ->join('users', 'demandeurs.id_user', '=', 'users.id')
        ->join('entreprises', 'users.id_entreprise', '=', 'entreprises.id_entreprise')
        ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
        ->get();
    
    

        if ($demandes) {
            return response()->json([
                'demandes' => $demandes,
                'status' => 200
            ], 200);
        } else {
            return response()->json([
                'message' => 'Aucune demande de matériel trouvée',
                'status' => 404
            ], 404);
        }
    }

  
    public function store(Request $request)
    {
        try {
            // Utilisez une jointure pour récupérer l'id_demandeur
            $demandeurId = DB::table('demandeurs')
                ->join('users', 'demandeurs.id_user', '=', 'users.id')
                ->where('demandeurs.id_user', Auth::id())
                ->value('demandeurs.id_demandeur');
    
            $validator = Validator::make($request->all(), [
                'etat_materiel' => 'required|string',
                'status' => 'required',
                'description_probleme' => 'required|string',
                'num_serie' => 'required|integer',
                // Vous pouvez ajouter d'autres règles de validation si nécessaire
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            }
    
            $demande = DemandeMateriel::create([
                'etat_materiel' => $request->etat_materiel,
                'status' => $request->status,
                'description_probleme' => $request->description_probleme,
                'num_serie' => $request->num_serie,
                'id_demandeur' => $demandeurId,
            ]);
    
            $id_demande = $demande->id_demande;
    
            UserActivity::create([
                'user_id' => Auth::id(),
                'activity_type' => 'creation_demande_materiel',
                'description' => 'Creation d\'une nouvelle demande',
            ]);
    
            Notification::create([
                'type_notif' => 'Nouvelle demande',
                'id_demande' => $id_demande,
                'date_creation' => now(),
                'phrase' => 'L\'utilisateur ' . Auth::user()->username .' vient de faire une demande de réparation',
            ]);
    
            return response()->json([
                'message' => "La demande de matériel a été créée avec succès",
                'status' => 200
            ], 200);
        } catch (\Exception $e) {
    
            return response()->json([
                'message' => "Il y a une erreur dans l'insertion",
            ], 500);
        }
    }
    
    public function show($id)
    {
        $demande = DemandeMateriel::select(
            'demande_materiel.*',
            'users.username as demandeur_username',
            'materiels.type_materiel'
        )
            ->join('users', 'demande_materiel.id_demandeur', '=', 'users.id')
            ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
            ->find($id);

        if (!$demande) {
            return response()->json([
                'message' => 'Cette demande de matériel n\'a pas été trouvée',
                'status' => 404,
            ]);
        }

        return response()->json([
            'demande' => $demande,
            'status' => 200,
        ]);
    }

    public function validationDemande(Request $request, $id)
    {
        try {
            // Récupération de la demande de matériel
            $demande = DemandeMateriel::select('demande_materiel.*', 'users.username as demandeur_username', 'entreprises.nom_entreprise as demandeur_entreprise', 'materiels.type_materiel')
                ->join('demandeurs', 'demandeurs.id_demandeur', '=', 'demande_materiel.id_demandeur')
                ->join('users', 'demandeurs.id_user', '=', 'users.id')
                ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
                ->join('entreprises','users.id_entreprise','=','entreprises.id_entreprise')
                ->where('demande_materiel.id_demande', '=', $id)
                ->first();
    
            if (!$demande) {
                return response()->json([
                    'message' => "La demande de matériel n'existe pas",
                    'status' => 404,
                ]);
            }
    
            // Mise à jour du statut de la demande de matériel
            $demande->status = 'Validé';
            $demande->save();
    
            // Validation des données du formulaire
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
    
            // Création du ticket
            $ticket = TicketReparation::create($request->all());
    
            // Accès à l'id du ticket après avoir sauvegardé le ticket
            $idTicket = $ticket->id_ticket;
    
            // Création de l'activité de validation de demande de matériel
            UserActivity::create([
                'user_id' => Auth::id(),
                'activity_type' => 'validation_demande_materiel',
                'description' => 'Validation de la demande de ' . $demande->demandeur_username,
            ]);
    
            // Création de la notification
            Notification::create([
                'type_notif' => 'validation_demande',
                'id_demande' => $demande->id_demande,
                'id_ticket' => $idTicket,
                'date_creation' => now(),
                'phrase' => ' ' . Auth::user()->username .' vient de valider votre demande de réparation',
            ]);
    
            return response()->json([
                'message' => "Les informations de la demande de matériel ont été validées avec succès, un ticket a été créé",
                'status' => 200,
                'id_ticket' => $idTicket,
                'ticket' => $ticket,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => "Une erreur est survenue lors de la validation de la demande de matériel",
                'status' => 500,
            ], 500);
        }
    }
    
    
    

public function update(Request $request, $id)
{
    try {
        $demande = DemandeMateriel::find($id);
        $demandeurId = DB::table('demandeurs')
        ->join('users', 'demandeurs.id_user', '=', 'users.id')
        ->where('demandeurs.id_user', Auth::id())
        ->value('demandeurs.id_demandeur');
        if (!$demande) {
            return response()->json([
                'message' => "La demande de matériel n'existe pas",
                'status' => 404,
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'etat_materiel' => 'required|string',
                'description_probleme' => 'required|string',
                'num_serie' => 'required|integer',
                'id_demandeur' => 'integer|nullable',
                // Add other validation rules if necessary
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 400,
                    'error_list' => $validator->messages(),
                ], 400);
            } else {
                // Save the updated information to the demande
                $demande->etat_materiel = $request->etat_materiel;
                $demande->description_probleme = $request->description_probleme;
                $demande->num_serie = $request->num_serie;
                $demande->id_demandeur = $demandeurId;
                // Update other fields if necessary
                $demande->save();

                // Log the activity of updating a material request
                UserActivity::create([
                    'user_id' => Auth::id(),
                    'activity_type' => 'mise_a_jour_demande_materiel',
                    'description' => 'Demande de matériel mise à jour par l\'utilisateur avec l\'ID ' . $demande->demandeur_username . '.',
                ]);

                // Log the notification
                $notificationPhrase = $this->getNotificationPhrase('mise_a_jour_demande');
                

                return response()->json([
                    'message' => "Les informations de la demande de matériel ont été mises à jour avec succès",
                    'status' => 200,
                ], 200);
            }
        }
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Une erreur est survenue lors de la modification de la demande de matériel",
            'status' => 500,
        ], 500);
    }
}

    

public function rejectDemande(Request $request, $id)
{
     // Assurez-vous que l'utilisateur est authentifié
     if (!Auth::check()) {
        return response()->json([
            'message' => "L'utilisateur n'est pas authentifié",
            'status' => 401,
        ], 401);
    }
        try {
            // Récupération de la demande de matériel
            $demande = DemandeMateriel::select('demande_materiel.*', 'users.username as demandeur_username', 'entreprises.nom_entreprise as demandeur_entreprise', 'materiels.type_materiel')
                ->join('demandeurs', 'demandeurs.id_demandeur', '=', 'demande_materiel.id_demandeur')
                ->join('users', 'demandeurs.id_user', '=', 'users.id')
                ->join('entreprises','users.id_entreprise','=','entreprises.id_entreprise')
                ->join('materiels', 'demande_materiel.num_serie', '=', 'materiels.num_serie')
                ->where('demande_materiel.id_demande', '=', $id)
                ->first();

        if (!$demande) {
            return response()->json([
                'message' => "La demande de matériel n'existe pas",
                'status' => 404,
            ]);
        } else {
            // Mise à jour du statut de la demande de matériel
            $demande->status = 'rejeté';
            $demande->save();

            // Enregistrez l'activité de rejet de demande de matériel
            UserActivity::create([
                'user_id' => Auth::id(),
                'activity_type' => 'rejet_demande_materiel',
                'description' => 'Demande de matériel rejetée par l\'utilisateur avec l\'ID ' . Auth::id(). '.',
            ]);

            // Enregistrez la notification
            $notificationPhrase = $this->getNotificationPhrase('rejet_demande');
            Notification::create([
                'type_notif' => 'rejet_demande',
                'id_demande' => $demande->id_demande,
                'date_creation' => now(),
                'phrase' => 'Demande rejetée',
            ]);

            return response()->json([
                'message' => "Les informations de la demande de matériel ont été rejetées avec succès",
                'status' => 200,
            ], 200);
        }
    } catch (\Exception $e) {
        return response()->json([
            'message' => "Une erreur est survenue lors du rejet de la demande de matériel",
            'status' => 500,
        ], 500);
    }
    }


    // Les autres méthodes restent inchangées

    private function getNotificationPhrase($type_notif)
    {
        $phrases = [
            'Nouvelle demande' => 'Nouvelle demande de matériel créée.',
            'mise_a_jour_demande' => 'Demande de matériel mise à jour.',
            'suppression_demande' => 'Demande de matériel supprimée.',
            // Ajoutez d'autres types de notification si nécessaire
        ];

        return $phrases[$type_notif] ?? '';
    }
    public function destroy($id)
    {
        $ticket = DemandeMateriel::find($id);
        if (!$ticket) {
            return response()->json([
                'message' => 'Demande non trouvé',
                'status' => 404,
            ]);
        }
        $ticket->delete();
        return response()->json(['message' => 'la demande a été supprimé', 'status' => 200], 200);
    }
}
