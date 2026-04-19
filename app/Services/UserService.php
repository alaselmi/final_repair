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

    public function getPaginatedUsers(int $offset, int $limit): array
    {
        return $this->userModel->getUsersPaginated($offset, $limit);
    }

    public function getTotalUsers(): int
    {
        return $this->userModel->getTotalUsersCount();
    }
}
