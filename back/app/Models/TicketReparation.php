<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketReparation extends Model
{
    use HasFactory;

    protected $table = 'ticketReparation'; // Nom de la table

    protected $fillable = [
        'id_ticket',
        'date_creation',
        'urgence',
        'priorite',
        'statut_actuel',
        'date_resolution',
        'id_demande', // Nom de la clé étrangère correspondant à 'id_demande'
        'id_technicien', // Nom de la clé étrangère correspondant à 'id_technicien'
        'id_piece', // Nom de la clé étrangère correspondant à 'id_piece'
        'intervention_faite', // Nouvelle colonne
        'suite_a_donnee', // Nouvelle colonne
    ];

    // Définissez la clé primaire
    protected $primaryKey = 'id_ticket';
}
