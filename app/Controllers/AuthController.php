<?php

namespace App\Controllers;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use Core\Controller;
use Core\Response;

class AuthController extends Controller
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function showLogin(): void
    {
        $this->view(
            'auth/login',
            [
                'error' => null,
                'email' => '',
                'csrf_token' => getCsrfToken(),
            ],
            'layouts/main'
        );
    }

    public function login(LoginRequest $request): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::redirect('/auth/login');
        }

        $email = trim((string) $request->get('email'));
        $password = (string) $request->get('password');
        $csrfToken = $request->get('csrf_token');

        if (!verifyCsrfToken($csrfToken)) {
            $this->view(
                'auth/login',
                [
                    'error' => 'Invalid request. Please refresh the page and try again.',
                    'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
                    'csrf_token' => getCsrfToken(),
                ],
                'layouts/main'
            );
            return;
        }

        if ($this->authService->login($email, $password)) {
            Response::redirect('/admin/dashboard');
            return;
        }

        $this->view(
            'auth/login',
            [
                'error' => 'Invalid credentials. Please try again.',
                'email' => htmlspecialchars($email, ENT_QUOTES, 'UTF-8'),
                'csrf_token' => getCsrfToken(),
            ],
            'layouts/main'
        );
    }

    public function logout(): void
    {
        $this->authService->logout();
        Response::redirect('/auth/login');
    }
}
