<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('materiels', function (Blueprint $table) {
            $table->increments('num_serie'); // Clé primaire auto-incrémentée
            $table->string('type_materiel');
            $table->string('etat_materiel');
            $table->text('description_probleme');
            $table->string('image_materiel_url')->nullable();
            $table->unsignedBigInteger('id_demandeur')->nullable(); // Clé étrangère vers la table 'demandeurs', autorisant la valeur nulle

            // Ajoutez d'autres colonnes si nécessaire

            $table->foreign('id_demandeur')->references('id_demandeur')->on('demandeurs')->onDelete('set null')->onUpdate('cascade'); // Clé étrangère vers demandeurs

            $table->timestamps();    
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('materiels');
    }
};
