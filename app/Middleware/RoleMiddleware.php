<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\MiddlewareInterface;
use Core\Request;
use Core\Response;

class RoleMiddleware implements MiddlewareInterface
{
    private AuthService $authService;
    private array $allowedRoles;

    public function __construct(AuthService $authService, array $allowedRoles)
    {
        $this->authService = $authService;
        $this->allowedRoles = $allowedRoles;
    }

    public function handle(Request $request, callable $next): bool
    {
        $user = $this->authService->getUser();

        if ($user === null) {
            Response::redirect('/auth/login');
            return false;
        }

        if (!$this->authService->checkRole($this->allowedRoles)) {
            Response::error('Forbidden: insufficient privileges.', 403);
            return false;
        }

        return $next($request);
    }
}
