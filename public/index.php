<?php

require_once __DIR__ . '/../core/autoload.php';
require_once __DIR__ . '/../core/Env.php';
require_once __DIR__ . '/../core/Config.php';
require_once __DIR__ . '/../core/Container.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/ErrorHandler.php';
require_once __DIR__ . '/../core/RouteCache.php';
require_once __DIR__ . '/../core/ServiceProvider.php';
require_once __DIR__ . '/../services/session.php';
require_once __DIR__ . '/../services/csrf.php';
require_once __DIR__ . '/../app/Providers/AppServiceProvider.php';

use App\Middleware\CorsMiddleware;
use App\Middleware\RateLimitMiddleware;
use Core\App;
use Core\Config;
use Core\Container;
use Core\Env;
use Core\ErrorHandler;
use Core\RouteCache;
use App\Providers\AppServiceProvider;

Env::load(__DIR__ . '/../.env');

Config::load([
    'app' => require __DIR__ . '/../config/app.php',
    'database' => require __DIR__ . '/../config/database.php',
    'jwt' => require __DIR__ . '/../config/jwt.php',
]);

$container = new Container();
Container::setInstance($container);
$container->registerProvider(new AppServiceProvider($container));

ErrorHandler::register();

$appEnv = config('app.env', 'development');

$routes = RouteCache::load(
    __DIR__ . '/../routes.php',
    __DIR__ . '/../cache/routes.php',
    $appEnv === 'production'
);

$app = new App($container);
$app->router->setGlobalMiddleware([
    CorsMiddleware::class,
    RateLimitMiddleware::class,
]);

foreach ($routes as $routeGroup) {
    foreach ($routeGroup as $route) {
        $app->router->add(
            $route['method'],
            $route['path'],
            $route['handler'],
            $route['middleware'] ?? [],
            $route['pattern'] ?? null,
            $route['paramNames'] ?? null
        );
    }
}

$app->run();
