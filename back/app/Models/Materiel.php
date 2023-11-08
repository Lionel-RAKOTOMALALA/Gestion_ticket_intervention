<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    protected $table = 'materiels';
    protected $primaryKey = 'num_serie';

    protected $fillable = [
        'type_materiel',
        'description_materiel',
        'image_materiel_url',
        'id_demanedeur',
    ];
}

