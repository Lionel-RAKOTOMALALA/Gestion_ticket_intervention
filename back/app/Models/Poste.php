<?php

use Illuminate\Database\Eloquent\Model;

class poste extends Model
{
    protected $table = 'postes';
    protected $primaryKey = 'id_poste';
    public $timestamps = true;

    protected $fillable = [
        'nom_poste',
    ];
}
