<?php

namespace App\Controllers\Api;

use App\Http\Requests\LoginRequest;

class AuthController extends BaseController
{
    public function login(LoginRequest $request): void
    {
        $token = $this->authService->loginApi($request->get('email'), $request->get('password'));
        if ($token === null) {
            $this->error('Invalid credentials.', 401);
        }

        // Set httpOnly cookie for JWT
        setcookie('auth_token', $token, [
            'expires' => time() + 900, // 15 minutes
            'path' => '/',
            'secure' => true, // HTTPS only
            'httponly' => true, // Inaccessible to JavaScript
            'samesite' => 'Strict', // CSRF protection
        ]);

        $this->success([
            'user' => $this->authService->getUser(),
        ], 'Login successful.');
    }

    public function logout(): void
    {
        $this->authorize();
        $this->authService->logout();
        
        // Clear the auth cookie
        setcookie('auth_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'secure' => true,
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        
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
