<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\MiddlewareInterface;
use Core\Response;

class RoleMiddleware implements MiddlewareInterface
{
    private array $allowedRoles;

    public function __construct(array $allowedRoles)
    {
        $this->allowedRoles = $allowedRoles;
    }

    public function handle(): bool
    {
        $authService = new AuthService();
        $user = $authService->getUser();

        if ($user === null) {
            Response::redirect('/auth/login');
        }

        if (!$authService->checkRole($this->allowedRoles)) {
            Response::error('Forbidden: insufficient privileges.', 403);
        }

        return true;
    }
}
