<?php

namespace App\Controllers;

use App\Services\AuthService;
use Core\Controller;
use Core\Response;
use Core\Validator;

class AuthController extends Controller
{
    private AuthService $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
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

    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            Response::redirect('/auth/login');
        }

        $validator = new Validator($_POST);
        $csrfToken = $_POST['csrf_token'] ?? null;
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

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

        if (!$validator->required(['email', 'password']) || !$validator->email('email')) {
            $this->view(
                'auth/login',
                [
                    'error' => $validator->getFirstError(),
                    'email' => $validator->sanitize('email'),
                ],
                'layouts/main'
            );
            return;
        }

        if ($this->authService->login($email, $password)) {
            Response::redirect('/admin/dashboard');
        }

        $this->view(
            'auth/login',
            [
                'error' => 'Invalid credentials. Please try again.',
                'email' => $validator->sanitize('email'),
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
