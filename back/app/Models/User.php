<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Model
{
    use HasApiTokens, HasFactory, Notifiable;


    protected $table = 'users'; // Nom de la table

    protected $primaryKey = 'id'; // Clé primaire

    protected $fillable = [
        'username',
        'email',
        'logo',
        'email_verified_at',
        'password',
        'role_user',
        'nom_entreprise',
        'remember_token',
        // Ajoutez d'autres colonnes si nécessaire
    ];

    // Vous pouvez également définir des relations ici si vous en avez
}
