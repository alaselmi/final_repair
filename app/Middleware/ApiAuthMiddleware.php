<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\ApiResponse;
use Core\MiddlewareInterface;
use Core\Request;

class ApiAuthMiddleware implements MiddlewareInterface
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, callable $next): bool
    {
        if ($this->authService->getUser() === null) {
            ApiResponse::error('Authentication required.', 401);
            return false;
        }

        return $next($request);
    }
}
