<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketReparation extends Model
{
    use HasFactory;

    protected $table = 'ticketReparation'; // Nom de la table

    protected $fillable = [
        'id_ticket', // Clé primaire, excluant "puck"
        'date_creation',
        'urgence',
        'priorite',
        'description_probleme',
        'statut_actuel',
        'date_resolution',
        'cout_reparation',
        'num_serie', // Nom de la clé étrangère correspondant à 'id_materiel'
        'id_technicien',
        'intervention_faite', // Nouvelle colonne
        'suite_a_donnee', // Nouvelle colonne
    ];

    // Définissez la clé primaire
    protected $primaryKey = 'id_ticket';
}
