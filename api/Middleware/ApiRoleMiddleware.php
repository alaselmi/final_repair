<?php

namespace Api\Middleware;

require_once __DIR__ . '/../../app/Services/AuthService.php';
require_once __DIR__ . '/../../core/ApiResponse.php';
require_once __DIR__ . '/../../core/MiddlewareInterface.php';

use App\Services\AuthService;
use Core\ApiResponse;
use Core\MiddlewareInterface;

class ApiRoleMiddleware implements MiddlewareInterface
{
    private AuthService $authService;
    private array $roles;

    public function __construct(array $roles = [])
    {
        $this->authService = new AuthService();
        $this->roles = $roles;
    }

    public function handle(): bool
    {
        $user = $this->authService->getUser();
        if ($user === null) {
            ApiResponse::error('Unauthorized', 401);
            return false;
        }

        if (!empty($this->roles) && !$this->authService->checkRole($this->roles)) {
            ApiResponse::error('Forbidden', 403);
            return false;
        }

        return true;
    }
}
