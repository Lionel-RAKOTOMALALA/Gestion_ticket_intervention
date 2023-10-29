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
            $table->string('description_materiel');
            $table->string('image_materiel_url')->nullable();

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
