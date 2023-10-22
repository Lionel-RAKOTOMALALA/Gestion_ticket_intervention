<?php
namespace App\Http\Controllers;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TechnicienController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MaterielController;
use App\Http\Controllers\DemandeurController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::middleware('auth:sanctum')->group( function () {
    Route::post('logout', [AuthController::class, 'logout']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::prefix('tickets')->group(function () {
    Route::get('{id}', [TicketController::class, 'show']);
    Route::post('/', [TicketController::class, 'store']);
    Route::get('/', [TicketController::class, 'index']);
    Route::put('{id}', [TicketController::class, 'update']);
    Route::delete('{id}', [TicketController::class, 'destroy']);
});

Route::prefix('demandeurs')->group(function () {
    Route::get('/', [DemandeurController::class, 'index']);
    Route::get('{id}', [DemandeurController::class, 'show']);
    Route::post('/', [DemandeurController::class, 'store']);
    Route::put('{id}', [DemandeurController::class, 'update']);
    Route::delete('{id}', [DemandeurController::class, 'destroy']);
});

Route::prefix('techniciens')->group(function () {
    Route::get('/', [TechnicienController::class, 'index']);
    Route::get('{id}', [TechnicienController::class, 'show']);
    Route::post('/', [TechnicienController::class, 'store']);
    Route::put('{id}', [TechnicienController::class, 'update']);
    Route::delete('{id}', [TechnicienController::class, 'destroy']);
});

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::get('{id}', [UserController::class, 'show']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'destroy']);
});

Route::prefix('materiels')->group(function () {
    Route::get('/', [MaterielController::class, 'index']);
    Route::get('{id}', [MaterielController::class, 'show']);
    Route::post('/', [MaterielController::class, 'store']);
    Route::put('{id}', [MaterielController::class, 'update']);
    Route::delete('{id}', [MaterielController::class, 'destroy']);
});
Route::prefix('piece_rechanges')->group(function () {
    Route::get('/', [PieceRechangeController::class, 'index']);
    Route::get('{id}', [PieceRechangeController::class, 'show']);
    Route::post('/', [PieceRechangeController::class, 'store']);
    Route::put('{id}', [PieceRechangeController::class, 'update']);
    Route::delete('{id}', [PieceRechangeController::class, 'destroy']);
});
