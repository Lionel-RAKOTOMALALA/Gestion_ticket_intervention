<?php 

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
        //     'username' => 'required|string',
        //     'email' => 'required|email|unique:users',
        //     'password' => 'required|string|min:8',
        //     'role_user' => 'required|string',
        //     'logo' => 'nullable|string',
        //     'sexe' => 'nullable|string', // Nouveau champ 'sexe'
        //     'photo_profil_user' => 'nullable|string', // Nouveau champ 'photo_profil_user'
        ];

        // if ($this->isMethod('post')) {
        //     $rules['id_entreprise'] = 'required|integer';
        //     $rules['nom_entreprise'] = 'nullable|string'; // Nouveau champ 'nom_entreprise'
        // }

        // if ($this->isMethod('put')) {
        //     $rules['id_entreprise'] = 'required|integer';
        //     $rules['nom_entreprise'] = 'nullable|string';
        // }

        return $rules;
    }

    public function messages(): array
    {
        $messages = [
            'username.required' => 'Veuillez entrer le nom d\'utilisateur.',
            'email.required' => 'Veuillez entrer l\'adresse e-mail.',
            'email.email' => 'L\'adresse e-mail doit être une adresse e-mail valide.',
            'email.unique' => 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.',
            'password.required' => 'Veuillez entrer un mot de passe.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'role_user.required' => 'Veuillez entrer le rôle de l\'utilisateur.',
            'logo.string' => 'Le logo doit être une chaîne de caractères.',
            'sexe.string' => 'Le champ "sexe" doit être une chaîne de caractères.', // Message pour le nouveau champ 'sexe'
            'photo_profil_user.string' => 'Le champ "photo_profil_user" doit être une chaîne de caractères.', // Message pour le nouveau champ 'photo_profil_user'
        ];

        if ($this->isMethod('post')) {
            $messages['id_entreprise.required'] = 'Veuillez sélectionner une entreprise.';
            $messages['nom_entreprise.string'] = 'Le champ "nom_entreprise" doit être une chaîne de caractères.'; // Message pour le nouveau champ 'nom_entreprise'
        }

        if ($this->isMethod('put')) {
            $messages['id_entreprise.required'] = 'Veuillez sélectionner une entreprise.';
            $messages['nom_entreprise.string'] = 'Le champ "nom_entreprise" doit être une chaîne de caractères.';
        }

        return $messages;
    }
}
