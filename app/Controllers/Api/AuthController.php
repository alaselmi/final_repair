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

        $this->success([
            'token' => $token,
            'type' => 'Bearer',
            'user' => $this->authService->getUser(),
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
