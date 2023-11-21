<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $primaryKey = 'id_notif';

    protected $fillable = [
        'date_creation',
        'type_notif',
        'id_ticket',
        'id_demande',
        'phrase', 
    ];

    // Ajoutez d'autres relations ou méthodes au besoin
}
