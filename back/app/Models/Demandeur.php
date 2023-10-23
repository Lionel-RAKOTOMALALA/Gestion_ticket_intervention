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
        // Ajoutez d'autres colonnes si nécessaire
    ];



}
