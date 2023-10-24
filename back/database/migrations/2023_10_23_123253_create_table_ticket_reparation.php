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
            $table->text('description_probleme');
            $table->string('statut_actuel');
            $table->timestamp('date_resolution');
            $table->decimal('cout_reparation', 10, 2)->nullable();
            $table->unsignedBigInteger('num_serie');
            $table->unsignedBigInteger('id_technicien');
            $table->text('intervention_faite')->nullable();
            $table->text('suite_a_donnee')->nullable();
            $table->timestamps(); // Ajoute les colonnes created_at et updated_at
    
            // Clés étrangères correctement spécifiées
            $table->foreign('num_serie')->references('num_serie')->on('materiels')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_technicien')->references('id_technicien')->on('techniciens')->onDelete('cascade')->onUpdate('cascade');
        });
    }
    

    public function down()
    {
        Schema::dropIfExists('ticketReparation');
    }
};
