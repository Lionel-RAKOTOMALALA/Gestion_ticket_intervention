<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Demandeur extends Model
{
    use HasFactory;

    protected $table = 'demandeurs'; // Nom de la table
    protected $primaryKey = 'id_demandeur'; // Clé primaire

    protected $fillable = [
        'id_user',
        'id_poste', 
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function demandesMateriel()
    {
        return $this->hasMany(DemandeMateriel::class, 'id_demandeur');
    }
   
}
