<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\MiddlewareInterface;
use Core\Request;
use Core\Response;

class AuthMiddleware implements MiddlewareInterface
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(Request $request, callable $next): bool
    {
        if ($this->authService->getUser() === null) {
            Response::redirect('/auth/login');
            return false;
        }

        return $next($request);
    }
}
