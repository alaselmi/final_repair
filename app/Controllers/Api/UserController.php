<?php

namespace App\Controllers\Api;

use App\Services\AuthService;
use App\Services\UserService;

class UserController extends BaseController
{
    private UserService $userService;

    public function __construct(UserService $userService, AuthService $authService)
    {
        parent::__construct($authService);
        $this->userService = $userService;
    }

    public function index(): void
    {
        $this->authorize(['admin']);

        $users = $this->userService->listUsers();
        $this->success(['users' => $users], 'Users retrieved successfully.');
    }
}
