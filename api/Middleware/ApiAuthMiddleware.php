<?php

namespace Api\Middleware;

require_once __DIR__ . '/../../app/Services/AuthService.php';
require_once __DIR__ . '/../../core/ApiResponse.php';
require_once __DIR__ . '/../../core/MiddlewareInterface.php';

use App\Services\AuthService;
use Core\ApiResponse;
use Core\MiddlewareInterface;

class ApiAuthMiddleware implements MiddlewareInterface
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function handle(): bool
    {
        $user = $this->authService->getUser();
        if ($user === null) {
            ApiResponse::error('Unauthorized', 401);
            return false;
        }

        return true;
    }
}
