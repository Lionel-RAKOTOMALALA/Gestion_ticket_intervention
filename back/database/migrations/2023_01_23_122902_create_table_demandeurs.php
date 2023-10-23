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
        Schema::create('demandeurs', function (Blueprint $table) {
            $table->increments('id_demandeur'); // Clé primaire auto-incrémentée
            $table->unsignedBigInteger('id_user'); // Clé étrangère vers la table 'users'
            // Ajoutez d'autres colonnes si nécessaire

            $table->foreign('id_user')->references('id')->on('users')->onDelete('cascade')->onUpdate('cascade'); // Clé étrangère vers users

            $table->timestamps(); // Ajoute automatiquement les colonnes created_at et updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('demandeurs');
    }
};
