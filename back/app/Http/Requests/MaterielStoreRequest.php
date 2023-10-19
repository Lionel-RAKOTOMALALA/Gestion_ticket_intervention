<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MaterielStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if(request()->isMethod('post')){
            return [
                'type_materiel'=>'required|string',
                'etat_materiel'=>'required|string'
            ];
        }else{
            return [
                'type_materiel'=>'required|string',
                'etat_materiel'=>'required|string'
            ];
        }
    }
    public function messages()
    {
        if(request()->isMethod('post')){
            return [
                'type_materiel'=>'Veuillez entrer le type de votre matériel',
                'etat_materiel'=>'Veuillez entrer l\'etat de votre matériel'
            ];
        }else{
            return [
                'type_materiel'=>'Veuillez entrer le type de votre matériel',
                'etat_materiel'=>'Veuillez entrer l\'etat de votre matériel'
            ];
        }
    }
}
