<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Demandeur extends Model
{
    use HasFactory;

    protected $table = 'demandeurs'; // Nom de la table
    protected $primaryKey = 'id_demandeur'; // Clé primaire

    protected $fillable = [
        'id_user',
        // Ajoutez d'autres colonnes si nécessaire
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }
    public function ticketsReparation()
{
    return $this->hasMany(TicketReparation::class, 'id_demandeur');
}

}
