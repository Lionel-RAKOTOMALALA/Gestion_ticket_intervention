<?php 

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MaterielStoreRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à effectuer cette demande.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Récupère les règles de validation qui s'appliquent à la demande.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        'type_materiel' => 'required|string',
        'description_materiel' => 'nullable|string', // Validation pour la description du problème (peut être nulle)
        'image_materiel_url' => 'nullable|string',       // Validation pour l'URL de l'image (peut être nulle)
    ];
}

public function messages(): array
{
    return [
        'type_materiel.required' => 'Veuillez entrer le type de votre matériel',
        'description_materiel.string' => 'La description du problème doit être une chaîne de caractères',
        'image_materiel_url.url' => 'L\'URL de l\'image n\'est pas valide',
    ];
}
}
