<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('job_statuses', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable();
            $table->boolean('dismissed')->default(false);
        });
    }

    public function down()
    {
        Schema::table('job_statuses', function (Blueprint $table) {
            $table->dropColumn('user_id');
            $table->dropColumn('dismissed');
        });
    }
};
