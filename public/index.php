<?php

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../core/App.php';
require_once __DIR__ . '/../core/Controller.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Validator.php';
require_once __DIR__ . '/../app/Controllers/AuthController.php';
require_once __DIR__ . '/../app/Controllers/AdminController.php';
require_once __DIR__ . '/../app/Services/AuthService.php';
require_once __DIR__ . '/../app/Middleware/AuthMiddleware.php';
require_once __DIR__ . '/../app/Middleware/RoleMiddleware.php';
require_once __DIR__ . '/../services/session.php';
require_once __DIR__ . '/../services/csrf.php';

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use Core\App;

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

$app = new App();
foreach ($routes['web'] as $route) {
    $middleware = isset($route['middleware']) ? instantiateMiddleware($route['middleware']) : [];

    $app->router->add(
        $route['method'],
        $route['path'],
        $route['handler'],
        $middleware
    );
}

$app->run();
