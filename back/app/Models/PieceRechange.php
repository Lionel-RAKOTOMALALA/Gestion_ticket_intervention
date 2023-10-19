<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PieceRechange extends Model
{
    use HasFactory;

    protected $table = 'piece_rechanges'; // Nom de la table
    protected $primaryKey = 'id_piece'; // Clé primaire

    protected $fillable = [
        'nom_piece',
        'description_piece',
        'stock_dispo',
        'cout_unitaire',
        'disponibilite',
    ];
}
