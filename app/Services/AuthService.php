<?php

namespace App\Services;

use App\Models\UserModel;
use Core\Config;

class AuthService
{
    private UserModel $userModel;
    private JwtService $jwtService;
    private Config $config;

    public function __construct(UserModel $userModel, JwtService $jwtService, Config $config)
    {
        $this->userModel = $userModel;
        $this->jwtService = $jwtService;
        $this->config = $config;
    }

    public function login(string $email, string $password): bool
    {
        $user = $this->authenticate($email, $password);
        if ($user === null) {
            return false;
        }

        $this->ensureSessionStarted();
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        return true;
    }

    public function loginApi(string $email, string $password): ?string
    {
        $user = $this->authenticate($email, $password);
        if ($user === null) {
            return null;
        }

        return $this->jwtService->issue([
            'sub' => $user['id'],
            'name' => $user['name'],
            'role' => $user['role'],
            'email' => $email,
        ]);
    }

    public function logout(): void
    {
        $this->ensureSessionStarted();

        $_SESSION = [];

        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(
                session_name(),
                '',
                time() - 42000,
                $params['path'],
                $params['domain'],
                $params['secure'],
                $params['httponly']
            );
        }

        session_destroy();
    }

    public function getUser(): ?array
    {
        $this->ensureSessionStarted();

        if (!empty($_SESSION['user_id'])) {
            return [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'] ?? null,
                'role' => $_SESSION['user_role'] ?? null,
            ];
        }

        $token = $this->resolveBearerToken();
        if ($token === null) {
            return null;
        }

        return $this->getUserFromToken($token);
    }

    public function checkRole(array $roles): bool
    {
        $user = $this->getUser();
        if ($user === null || empty($user['role'])) {
            return false;
        }

        return in_array($user['role'], $roles, true);
    }

    public function can(string $permission): bool
    {
        $user = $this->getUser();
        if ($user === null || empty($user['role'])) {
            return false;
        }

        $permissions = $this->getPermissionsForRole($user['role']);
        return in_array($permission, $permissions, true);
    }

    private function getPermissionsForRole(string $role): array
    {
        return $this->config->get("permissions.roles.{$role}", []);
    }

    public function getUserFromToken(string $token): ?array
    {
        $payload = $this->jwtService->verify($token);
        if ($payload === null) {
            return null;
        }

        return [
            'id' => $payload['sub'] ?? null,
            'name' => $payload['name'] ?? null,
            'role' => $payload['role'] ?? null,
            'email' => $payload['email'] ?? null,
        ];
    }

    private function authenticate(string $email, string $password): ?array
    {
        $user = $this->userModel->findByEmail($email);
        if ($user === null) {
            return null;
        }

        if (!password_verify($password, $user['password'])) {
            return null;
        }

        return $user;
    }

    private function resolveBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? null;
        if ($header === null) {
            return null;
        }

        if (str_starts_with($header, 'Bearer ')) {
            return trim(substr($header, 7));
        }

        return null;
    }

    private function ensureSessionStarted(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
}
