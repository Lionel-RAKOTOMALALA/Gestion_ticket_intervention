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
        'id_demandeur',
        'id_technicien',
        'intervention_faite', // Nouvelle colonne
        'suite_a_donnee', // Nouvelle colonne
    ];

    // Définissez la clé primaire
    protected $primaryKey = 'id_ticket';

    // Relation avec la table "materiel"
    public function materiel()
    {
        return $this->belongsTo(Materiel::class, 'num_serie', 'num_serie');
    }

    // Relation avec la table "demandeur"
    public function demandeur()
    {
        return $this->belongsTo(Demandeur::class, 'id_demandeur', 'id_demandeur');
    }

    // Relation avec la table "technicien"
    public function technicien()
    {
        return $this->belongsTo(Technicien::class, 'id_technicien', 'id_technicien');
    }
}
