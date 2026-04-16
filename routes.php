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
                App\Middleware\PermissionMiddleware::class . ':view-dashboard',
            ],
        ],
    ],
    'api' => [
        [
            'method' => 'POST',
            'path' => '/api/login',
            'handler' => [App\Controllers\Api\AuthController::class, 'login'],
        ],
        [
            'method' => 'POST',
            'path' => '/api/v1/login',
            'handler' => [App\Controllers\Api\AuthController::class, 'login'],
        ],
        [
            'method' => 'POST',
            'path' => '/api/logout',
            'handler' => [App\Controllers\Api\AuthController::class, 'logout'],
        ],
        [
            'method' => 'POST',
            'path' => '/api/v1/logout',
            'handler' => [App\Controllers\Api\AuthController::class, 'logout'],
        ],
        [
            'method' => 'GET',
            'path' => '/api/me',
            'handler' => [App\Controllers\Api\AuthController::class, 'me'],
        ],
        [
            'method' => 'GET',
            'path' => '/api/v1/me',
            'handler' => [App\Controllers\Api\AuthController::class, 'me'],
        ],
        [
            'method' => 'GET',
            'path' => '/api/users',
            'handler' => [App\Controllers\Api\UserController::class, 'index'],
            'middleware' => [
                App\Middleware\ApiAuthMiddleware::class,
                App\Middleware\ApiRoleMiddleware::class . ':admin',
            ],
        ],
        [
            'method' => 'GET',
            'path' => '/api/v1/users',
            'handler' => [App\Controllers\Api\UserController::class, 'index'],
            'middleware' => [
                App\Middleware\ApiAuthMiddleware::class,
                App\Middleware\ApiRoleMiddleware::class . ':admin',
            ],
        ],
        [
            'method' => 'GET',
            'path' => '/api/repairs',
            'handler' => [App\Controllers\Api\RepairController::class, 'index'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'GET',
            'path' => '/api/v1/repairs',
            'handler' => [App\Controllers\Api\RepairController::class, 'index'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'GET',
            'path' => '/api/repairs/{id}',
            'handler' => [App\Controllers\Api\RepairController::class, 'show'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'GET',
            'path' => '/api/v1/repairs/{id}',
            'handler' => [App\Controllers\Api\RepairController::class, 'show'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'POST',
            'path' => '/api/repairs',
            'handler' => [App\Controllers\Api\RepairController::class, 'create'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'POST',
            'path' => '/api/v1/repairs',
            'handler' => [App\Controllers\Api\RepairController::class, 'create'],
            'middleware' => [App\Middleware\ApiAuthMiddleware::class],
        ],
        [
            'method' => 'PATCH',
            'path' => '/api/repairs/{id}/status',
            'handler' => [App\Controllers\Api\RepairController::class, 'updateStatus'],
            'middleware' => [
                App\Middleware\ApiAuthMiddleware::class,
                App\Middleware\ApiRoleMiddleware::class . ':admin',
            ],
        ],
        [
            'method' => 'PATCH',
            'path' => '/api/v1/repairs/{id}/status',
            'handler' => [App\Controllers\Api\RepairController::class, 'updateStatus'],
            'middleware' => [
                App\Middleware\ApiAuthMiddleware::class,
                App\Middleware\ApiRoleMiddleware::class . ':admin',
            ],
        ],
    ],
];
