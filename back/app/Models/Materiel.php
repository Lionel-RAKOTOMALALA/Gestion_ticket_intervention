<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materiel extends Model
{
    use HasFactory;

    protected $table = 'materiels'; // Nom de la table
    protected $primaryKey = 'num_serie'; // Clé primaire

    protected $fillable = [
        'type_materiel',
        'etat_materiel',
        'id_demandeur', 
        'description_probleme',
        'image_materiel_url'
    ];

 

	/**
	 * @return mixed
	 */
	public function getFillable() {
		return $this->fillable;
	}
	
	/**
	 * @param mixed $fillable 
	 * @return self
	 */
	public function setFillable($fillable): self {
		$this->fillable = $fillable;
		return $this;
	}
}
