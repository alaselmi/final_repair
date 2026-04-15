<?php

require_once __DIR__ . '/TestCase.php';
require_once __DIR__ . '/../core/Config.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/FormRequest.php';
require_once __DIR__ . '/../app/Services/JwtService.php';
require_once __DIR__ . '/../app/Services/AuthService.php';

use Core\Config;
use App\Services\AuthService;
use App\Services\JwtService;

class DummyUserModel
{
    public function findByEmail(string $email): ?array
    {
        if ($email !== 'test@example.com') {
            return null;
        }

        return [
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'admin',
            'password' => password_hash('secret123', PASSWORD_DEFAULT),
        ];
    }
}

class AuthServiceTest extends TestCase
{
    public function testLoginApiReturnsToken(): void
    {
        $config = new Config(['jwt' => ['secret' => 'test-secret', 'ttl' => 3600], 'permissions' => ['roles' => ['admin' => ['view-dashboard']]]]);
        $jwtService = new JwtService($config);
        $authService = new AuthService(new DummyUserModel(), $jwtService, $config);

        $token = $authService->loginApi('test@example.com', 'secret123');
        $this->assertTrue(is_string($token) && strlen($token) > 0, 'JWT token should be returned.');
    }

    public function testCanReturnsTrueForConfiguredPermission(): void
    {
        $config = new Config(['jwt' => ['secret' => 'test-secret', 'ttl' => 3600], 'permissions' => ['roles' => ['admin' => ['view-dashboard']]]]);
        $jwtService = new JwtService($config);
        $authService = new AuthService(new DummyUserModel(), $jwtService, $config);

        $_SESSION['user_id'] = 1;
        $_SESSION['user_role'] = 'admin';

        $this->assertTrue($authService->can('view-dashboard'), 'Admin should be allowed to view dashboard.');
    }
}
