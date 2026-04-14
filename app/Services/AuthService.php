<?php

namespace App\Services;

use App\Models\UserModel;

class AuthService
{
    private UserModel $userModel;

    public function __construct(?UserModel $userModel = null)
    {
        $this->userModel = $userModel ?? new UserModel();
    }

    public function login(string $email, string $password): bool
    {
        $this->ensureSessionStarted();

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            return false;
        }

        if (!password_verify($password, $user['password'])) {
            return false;
        }

        if (session_status() === PHP_SESSION_ACTIVE) {
            session_regenerate_id(true);
        }

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['user_name'] = $user['name'];

        return true;
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

        if (empty($_SESSION['user_id'])) {
            return null;
        }

        return [
            'id' => $_SESSION['user_id'],
            'name' => $_SESSION['user_name'] ?? null,
            'role' => $_SESSION['user_role'] ?? null,
        ];
    }

    public function checkRole(array $roles): bool
    {
        $this->ensureSessionStarted();

        $userRole = $_SESSION['user_role'] ?? null;
        if (empty($userRole)) {
            return false;
        }

        return in_array($userRole, $roles, true);
    }

    private function ensureSessionStarted(): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }
}
