<?php

require_once __DIR__ . '/session.php';

function getJsonPayload(): array
{
    static $payload;
    if ($payload === null) {
        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
    }
    return $payload;
}

function getRequestCsrfToken(): ?string
{
    $payload = getJsonPayload();
    return $_SERVER['HTTP_X_CSRF_TOKEN'] ?? $payload['csrf_token'] ?? null;
}

function getCsrfToken(): string
{
    ensureSessionStarted();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCsrfToken(?string $token): bool
{
    ensureSessionStarted();
    return is_string($token)
        && !empty($_SESSION['csrf_token'])
        && hash_equals($_SESSION['csrf_token'], $token);
}

function requireCsrfToken(?string $token): void
{
    if (!verifyCsrfToken($token)) {
        jsonResponse(['message' => 'Invalid CSRF token.'], 403);
    }
}
