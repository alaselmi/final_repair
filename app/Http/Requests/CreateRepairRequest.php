<?php

namespace App\Http\Requests;

use Core\FormRequest;

class CreateRepairRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'device_type' => 'required',
            'brand' => 'required',
            'problem_description' => 'required',
            'estimated_price' => 'numeric',
        ];
    }
}
