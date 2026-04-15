<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\ApiResponse;
use Core\MiddlewareInterface;
use Core\Request;

class PermissionMiddleware implements MiddlewareInterface
{
    private AuthService $authService;
    private string $permission;

    public function __construct(AuthService $authService, string $permission)
    {
        $this->authService = $authService;
        $this->permission = $permission;
    }

    public function handle(Request $request, callable $next): bool
    {
        $user = $this->authService->getUser();
        if ($user === null || !$this->authService->can($this->permission)) {
            if (str_starts_with($request->getPath(), '/api/')) {
                ApiResponse::error('Forbidden: insufficient permissions.', 403);
                return false;
            }

            http_response_code(403);
            echo 'Forbidden: insufficient permissions.';
            return false;
        }

        return $next($request);
    }
}
