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
use App\Http\Controllers\DemandeMaterielController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\UserActivityController;
use App\Http\Controllers\EntrepriseController;

Route::get('/entreprises', [EntrepriseController::class, 'index']);

Route::middleware('auth:sanctum','isAPIAdmin')->group(function () {
    Route::get('dashboard', [UserController::class, 'dashboard']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/checkingAuthenticated', function(){
        return response()->json([
            'message' => 'Bienvenue',
            'status' => 200
        ], 200);
    });
    
Route::get('countDemandeurForAuthenticatedUser', [UserController::class, 'countDemandeurForAuthenticatedUser']);
Route::get('countTechnicienForAuthenticatedUser', [UserController::class, 'countTechnicienForAuthenticatedUser']); 
Route::get('/showIdDemandeur', [UserController::class, 'showIdDemandeur']);
Route::prefix('demande_materiel')->group(function () {
    Route::get('/', [DemandeMaterielController::class, 'index']);
    Route::get('/{id}', [DemandeMaterielController::class, 'show']);
    Route::put('validate/{id}', [DemandeMaterielController::class, 'validationDemande']);
    Route::put('reject/{id}', [DemandeMaterielController::class, 'rejectDemande']);
});

Route::get('/user', [UserController::class, 'getUserData']); 



});
Route::post('register', [UserController::class, 'registerDemandeur']);
Route::put('editDemandeur/{id}', [UserController::class, 'editDemandeur']);
Route::post('registerTechnicien', [UserController::class, 'registerTechnicien']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/listeMateriel', [MaterielController::class, 'listeMateriel']);
    Route::get('/materiel_endomage', [MaterielController::class, 'materiel_endomage']);
    Route::get('/materiel_repare', [MaterielController::class, 'materiel_repare']);
    Route::get('/tickets', [TicketController::class, 'index']);
    Route::get('dashboard', [UserController::class, 'dashboard']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('/checkingAuthenticatedUserSimple', function(){
        return response()->json([
            'message' => 'Bienvenue',
            'status' => 200
        ], 200);
    });
     
Route::prefix('materiels')->group(function () {
    Route::get('/', [MaterielController::class, 'index']);
   
    Route::get('{id}', [MaterielController::class, 'show']);
    Route::post('/', [MaterielController::class, 'store']);
    Route::put('{id}', [MaterielController::class, 'update']);
    Route::delete('{id}', [MaterielController::class, 'destroy']);
});
    Route::get('/user', [UserController::class, 'getUserData']); 
    
    Route::get('countDemandeurForAuthenticatedUser', [UserController::class, 'countDemandeurForAuthenticatedUser']);
    Route::get('countTechnicienForAuthenticatedUser', [UserController::class, 'countTechnicienForAuthenticatedUser']);
    Route::get('/demandes-utilisateur', [UserController::class, 'getDemandesUtilisateur']);  
    Route::get('/showIdDemandeur', [UserController::class, 'showIdDemandeur']);  
    Route::prefix('demande_materiel')->group(function () {
        Route::get('/', [DemandeMaterielController::class, 'index']);
        Route::get('/{id}', [DemandeMaterielController::class, 'show']);
        Route::post('/', [DemandeMaterielController::class, 'store']);
        Route::put('validate/{id}', [DemandeMaterielController::class, 'validationDemande']);
        Route::put('reject/{id}', [DemandeMaterielController::class, 'rejectDemande']);
        Route::put('/{id}', [DemandeMaterielController::class, 'update']);
        Route::delete('/{id}', [DemandeMaterielController::class, 'destroy']);
    });
 

}); 


Route::post('login', [AuthController::class, 'login']);


Route::prefix('tickets')->group(function () {
    Route::get('{id}', [TicketController::class, 'show']);
    Route::post('/', [TicketController::class, 'store']);
    Route::put('{id}', [TicketController::class, 'update']);
    Route::put('reparationFait/{id}',[TicketController::class, 'reparationFait']);
    Route::put('reparation_com/{id}',[TicketController::class, 'reparation_com']);
    Route::put('updateFavori/{id}',[TicketController::class, 'updateFavori']);
    Route::delete('{id}', [TicketController::class, 'destroy']);
});

Route::prefix('demandeurs')->group(function () {
    Route::get('/', [DemandeurController::class, 'index']);
    Route::get('{id}', [DemandeurController::class, 'show']);
    Route::post('/', [DemandeurController::class, 'store']);
    Route::put('{id}', [DemandeurController::class, 'update']);
    Route::delete('{id}', [DemandeurController::class, 'destroy']);
});
Route::prefix('postes')->group(function () {
    Route::get('/', [PosteController::class, 'index']);
    Route::get('{id}', [PosteController::class, 'show']);
    Route::post('/', [PosteController::class, 'store']);
    Route::put('{id}', [PosteController::class, 'update']);
    Route::delete('{id}', [PosteController::class, 'destroy']);
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
    Route::post('/demandeur', [UserController::class, 'store']);
    Route::put('{id}', [UserController::class, 'update']);
    Route::delete('{id}', [UserController::class, 'destroy']);
});
Route::get('/getUserTechnicien',[UserController::class,'userTechnicien']);
Route::put('/update-notif/{id}', [UserController::class, 'updateNotification']);


Route::prefix('piece_rechanges')->group(function () {
    Route::get('/', [PieceRechangeController::class, 'index']);
    Route::get('{id}', [PieceRechangeController::class, 'show']);
    Route::post('/', [PieceRechangeController::class, 'store']);
    Route::put('{id}', [PieceRechangeController::class, 'update']);
    Route::delete('{id}', [PieceRechangeController::class, 'destroy']);
});
Route::get('materielInDemande', [MaterielController::class, 'MaterielInDemande']);
Route::get('userInTechniciens', [UserController::class, 'userInTechniciens']);
Route::get('newUserSpecialisation', [UserController::class, 'newUserSpecialisation']);
Route::get('newUserSpecialisation/{id}', [UserController::class, 'showNewUserSpecialisation']);
Route::get('getTechnicienAdmin', [UserController::class, 'getTechnicienAdmin']);

Route::get('/uploads/materiels/{filename}', [UserController::class, 'imageFetch']);
Route::prefix('notifications')->group(function () {
    Route::get('/', [NotificationController::class, 'index']);
    Route::post('/', [NotificationController::class, 'store']);
    Route::get('/{id}', [NotificationController::class, 'show']);
    Route::put('/{id}', [NotificationController::class, 'update']);
    Route::delete('/{id}', [NotificationController::class, 'destroy']);
});
Route::prefix('user-activities')->group(function () {
    Route::get('/', [UserActivityController::class, 'index']);
    Route::post('/', [UserActivityController::class, 'store']);
    Route::get('/{id}', [UserActivityController::class, 'show']);
    Route::put('/{id}', [UserActivityController::class, 'update']);
    Route::delete('/{id}', [UserActivityController::class, 'destroy']);
});

