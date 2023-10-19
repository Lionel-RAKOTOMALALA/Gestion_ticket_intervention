<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    use HasFactory;

    protected $primaryKey = 'num_serie';

    protected $fillable = [
        'type_materiel',
        'etat_materiel',
    ];
}
