<?php 

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DemandeurStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true; // Vous pouvez définir des autorisations personnalisées ici si nécessaire.
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id_user' => 'required|exists:users,id',
            'id_poste' => 'required|exists:postes,id_poste',
            // Ajoutez d'autres règles de validation si nécessaire
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'id_user.required' => 'Veuillez sélectionner un utilisateur.',
            'id_user.exists' => "L'utilisateur sélectionné n'existe pas.",
            'id_poste.required' => 'Veuillez sélectionner un poste.',
            'id_poste.exists' => 'Le poste sélectionné n\'existe pas.',
            // Ajoutez d'autres messages d'erreur au besoin
        ];
    }
}
