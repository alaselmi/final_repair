<?php

require_once __DIR__ . '/core/autoload.php';
require_once __DIR__ . '/core/Env.php';
require_once __DIR__ . '/core/Config.php';
require_once __DIR__ . '/core/Container.php';
require_once __DIR__ . '/core/ServiceProvider.php';
require_once __DIR__ . '/core/Console.php';
require_once __DIR__ . '/app/Providers/AppServiceProvider.php';

use Core\Config;
use Core\Container;
use Core\Env;
use App\Providers\AppServiceProvider;

Env::load(__DIR__ . '/.env');

Config::load([
    'app' => require __DIR__ . '/config/app.php',
    'database' => require __DIR__ . '/config/database.php',
    'jwt' => require __DIR__ . '/config/jwt.php',
    'cors' => require __DIR__ . '/config/cors.php',
    'rate_limiter' => require __DIR__ . '/config/rate_limiter.php',
    'permissions' => require __DIR__ . '/config/permissions.php',
]);

$container = new Container();
Container::setInstance($container);
$container->registerProvider(new AppServiceProvider($container));

Core\Console::run($argv);
