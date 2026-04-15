<?php

namespace App\Http\Requests;

use Core\FormRequest;

class UpdateRepairStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => 'required|in:Pending,In Progress,Ready,Delivered,Completed',
        ];
    }
}
