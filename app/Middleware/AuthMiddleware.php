<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\MiddlewareInterface;
use Core\Response;

class AuthMiddleware implements MiddlewareInterface
{
    public function handle(): bool
    {
        $authService = new AuthService();

        if ($authService->getUser() === null) {
            Response::redirect('/auth/login');
        }

        return true;
    }
}
