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

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = min(100, max(1, (int) ($_GET['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $users = $this->userService->getPaginatedUsers($offset, $limit);
        $total = $this->userService->getTotalUsers();

        $this->success([
            'users' => $users,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'totalPages' => (int) ceil($total / $limit)
        ], 'Users retrieved successfully.');
    }
}
