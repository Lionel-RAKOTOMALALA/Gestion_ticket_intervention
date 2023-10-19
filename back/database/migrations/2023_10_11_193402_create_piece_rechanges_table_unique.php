<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePieceRechangesTableUnique extends Migration
{
    public function up()
    {
        Schema::create('piece_rechanges', function (Blueprint $table) {
            $table->id('id_piece');
            $table->string('nom_piece', 255);
            $table->string('description_piece')->nullable();
            $table->double('stock_dispo');
            $table->double('cout_unitaire');
            $table->string('disponibilite', 255);
            $table->timestamps(); // Ajoute automatiquement les colonnes created_at et updated_at

            // Vous pouvez également ajouter d'autres index ou contraintes au besoin
        });
    }

    public function down()
    {
        Schema::dropIfExists('piece_rechanges');
    }
}
