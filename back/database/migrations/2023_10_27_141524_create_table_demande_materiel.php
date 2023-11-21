<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('demande_materiel', function (Blueprint $table) {
            $table->increments('id_demande');
            $table->string('etat_materiel');
            $table->string('status');
            $table->text('description_probleme');
            $table->unsignedBigInteger('num_serie');
            $table->unsignedBigInteger('id_demandeur')->nullable();
            $table->foreign('id_demandeur')->references('id_demandeur')->on('demandeurs')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('num_serie')->references('num_serie')->on('materiels')->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('demande_materiel');
    }
};
