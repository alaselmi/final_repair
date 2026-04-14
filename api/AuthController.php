<?php

namespace Api;

require_once __DIR__ . '/BaseController.php';

class AuthController extends BaseController
{
    public function __construct()
    {
        parent::__construct();
    }

    public function login(): void
    {
        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $email = trim((string) ($payload['email'] ?? ''));
        $password = $payload['password'] ?? '';

        if ($email === '' || $password === '') {
            $this->error('Email and password are required.', 422);
        }

        if (!$this->authService->login($email, $password)) {
            $this->error('Invalid credentials.', 401);
        }

        $this->success([
            'token' => session_id(),
            'session_name' => session_name(),
            'user' => $this->getUser(),
        ], 'Login successful.');
    }

    public function logout(): void
    {
        $this->authorize();
        $this->authService->logout();
        $this->success(['message' => 'Logged out successfully.']);
    }

    public function me(): void
    {
        $user = $this->getUser();
        if ($user === null) {
            $this->error('Unauthorized.', 401);
        }

        $this->success(['user' => $user]);
    }
}
