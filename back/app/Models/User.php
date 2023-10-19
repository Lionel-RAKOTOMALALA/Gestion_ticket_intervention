<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authentificatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Technicien;
use App\Models\Demandeur;
use Laravel\Sanctum\HasApiTokens;

class User extends Authentificatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'email',
        'email_verified_at',
        'password',
        'role_user',
        'logo',
        'nom_entreprise' 
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function techniciens()
    {
        return $this->hasMany(Technicien::class, 'id_user');
    }

    public function demandeurs()
    {
        return $this->hasMany(Demandeur::class, 'id_user');
    }
}
