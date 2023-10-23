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
            $table->unsignedBigInteger('id_ticket');
            $table->foreign('id_ticket')->references('id_ticket')->on('ticketReparation')->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notifications');
    }
};
