<?php

namespace App\Services;

use App\Models\UserModel;

class UserService
{
    private UserModel $userModel;

    public function __construct(UserModel $userModel)
    {
        $this->userModel = $userModel;
    }

    public function listUsers(): array
    {
        return $this->userModel->getAllUsers();
    }
}
