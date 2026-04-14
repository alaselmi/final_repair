<?php

return [
    'web' => [
        [
            'method' => 'GET',
            'path' => '/auth/login',
            'handler' => [App\Controllers\AuthController::class, 'showLogin'],
        ],
        [
            'method' => 'POST',
            'path' => '/auth/login',
            'handler' => [App\Controllers\AuthController::class, 'login'],
        ],
        [
            'method' => 'GET',
            'path' => '/auth/logout',
            'handler' => [App\Controllers\AuthController::class, 'logout'],
        ],
        [
            'method' => 'GET',
            'path' => '/admin/dashboard',
            'handler' => [App\Controllers\AdminController::class, 'dashboard'],
            'middleware' => [
                App\Middleware\AuthMiddleware::class,
                [App\Middleware\RoleMiddleware::class, ['admin']],
            ],
        ],
    ],
    'api' => [
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
            'middleware' => [
                Api\Middleware\ApiAuthMiddleware::class,
            ],
        ],
        [
            'method' => 'GET',
            'path' => '/api/repairs/{id}',
            'handler' => [Api\RepairController::class, 'show'],
            'middleware' => [
                Api\Middleware\ApiAuthMiddleware::class,
            ],
        ],
        [
            'method' => 'POST',
            'path' => '/api/repairs',
            'handler' => [Api\RepairController::class, 'create'],
            'middleware' => [
                Api\Middleware\ApiAuthMiddleware::class,
            ],
        ],
        [
            'method' => 'PATCH',
            'path' => '/api/repairs/{id}/status',
            'handler' => [Api\RepairController::class, 'updateStatus'],
            'middleware' => [
                Api\Middleware\ApiAuthMiddleware::class,
                [Api\Middleware\ApiRoleMiddleware::class, [['admin']]],
            ],
        ],
    ],
];
