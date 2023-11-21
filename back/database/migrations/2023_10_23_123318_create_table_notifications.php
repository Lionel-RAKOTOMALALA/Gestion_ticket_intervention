<?php 

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('id_notif');
            $table->timestamp('date_creation')->useCurrent();
            $table->string('type_notif');
            $table->unsignedBigInteger('id_ticket')->nullable();
            $table->unsignedBigInteger('id_demande')->nullable(); // Allow null for 'id_demande'
            $table->string('phrase')->nullable(); // Add the new 'phrase' column
            
            $table->foreign('id_ticket')->references('id_ticket')->on('ticketReparation')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('id_demande')->references('id_demande')->on('demande_materiel')->onDelete('cascade')->onUpdate('cascade');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
