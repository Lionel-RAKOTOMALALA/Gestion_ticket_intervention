<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ticketReparation', function (Blueprint $table) {
            $table->id('id_ticket');
            $table->timestamp('date_creation')->useCurrent();
            $table->string('urgence');
            $table->string('priorite');
            $table->string('statut_actuel');
            $table->timestamp('date_resolution')->nullable();
            $table->tinyInteger('favori')->default(0);
            $table->unsignedBigInteger('id_demande');
            $table->unsignedBigInteger('id_technicien');;
            $table->unsignedBigInteger('id_piece')->nullable();
            $table->text('intervention_faite')->nullable();
            $table->text('suite_a_donnee')->nullable();
            $table->timestamps(); // Ajoute les colonnes created_at et updated_at
    
            // Clés étrangères correctement spécifiées
            $table->foreign('id_demande')->references('id_demande')->on('demande_materiel')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_piece')->references('id_piece')->on('piece_rechanges')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_technicien')->references('id_technicien')->on('techniciens')->onDelete('cascade')->onUpdate('cascade');
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('ticketReparation');
    }
};
