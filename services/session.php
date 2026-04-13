<?php

function ensureSessionStarted(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function secureSessionStart(): void
{
    if (session_status() !== PHP_SESSION_NONE) {
        return;
    }

    $secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['SERVER_PORT'] ?? '') === '443';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'secure' => $secure,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

function regenerateSession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_regenerate_id(true);
    }
}
