<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Technicien extends Model
{
    use HasFactory;

    protected $table = 'techniciens'; // Nom de la table

    protected $primaryKey = 'id_technicien'; // Clé primaire

    protected $fillable = [
        'competence',
        'id_user'
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
