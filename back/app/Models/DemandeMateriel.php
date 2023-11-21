<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeMateriel extends Model
{
    protected $table = 'demande_materiel';
    protected $primaryKey = 'id_demande';

    protected $fillable = [
        'etat_materiel',
        'status',
        'description_probleme',
        'num_serie',
        'id_demandeur',
    ];
    public function demandeur()
    {
        return $this->belongsTo(Demandeur::class, 'id_demandeur');
    }

}
