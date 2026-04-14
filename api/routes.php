<?php

// API route definitions.
// This file returns a map of API endpoints, handlers, and optional middleware.
// The API router layer dispatches these routes as JSON-only responses.

return [
    [
        'method' => 'POST',
        'path' => '/api/login',
        'handler' => [Api\AuthController::class, 'login'],
    ],
    [
        'method' => 'POST',
        'path' => '/api/logout',
        'handler' => [Api\AuthController::class, 'logout'],
    ],
    [
        'method' => 'GET',
        'path' => '/api/me',
        'handler' => [Api\AuthController::class, 'me'],
    ],
    [
        'method' => 'GET',
        'path' => '/api/repairs',
        'handler' => [Api\RepairController::class, 'index'],
    ],
    [
        'method' => 'GET',
        'path' => '/api/repairs/{id}',
        'handler' => [Api\RepairController::class, 'show'],
    ],
    [
        'method' => 'POST',
        'path' => '/api/repairs',
        'handler' => [Api\RepairController::class, 'create'],
    ],
    [
        'method' => 'PATCH',
        'path' => '/api/repairs/{id}/status',
        'handler' => [Api\RepairController::class, 'updateStatus'],
    ],
];
