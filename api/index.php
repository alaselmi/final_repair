<?php

// API entry point for the new REST layer.
// This file bootstraps shared services and dispatches API routes using the shared core router.

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/AuthController.php';
require_once __DIR__ . '/RepairController.php';
require_once __DIR__ . '/Middleware/ApiAuthMiddleware.php';
require_once __DIR__ . '/Middleware/ApiRoleMiddleware.php';

use Core\Router;

function instantiateMiddleware(array $middlewareSpec): array
{
    $middleware = [];
    foreach ($middlewareSpec as $item) {
        if (is_string($item)) {
            $middleware[] = new $item();
            continue;
        }

        if (is_array($item) && is_string($item[0])) {
            $middleware[] = new $item[0](...($item[1] ?? []));
        }
    }

    return $middleware;
}

$routes = require __DIR__ . '/../routes.php';

$router = new Router();
foreach ($routes['api'] as $route) {
    $middleware = isset($route['middleware']) ? instantiateMiddleware($route['middleware']) : [];

    $router->add(
        $route['method'],
        $route['path'],
        $route['handler'],
        $middleware
    );
}

$router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
