<?php

namespace App\Providers;

use App\Services\JwtService;
use Core\Config;
use Core\Container;
use Core\Database;
use Core\Logger;
use Core\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->container->singleton(Logger::class, static fn (Container $container) => new Logger(__DIR__ . '/../../logs/app.log'));
        $this->container->singleton(Database::class, static fn (Container $container) => Database::getInstance());
        $this->container->bind(\PDO::class, static fn (Container $container) => Database::getInstance());
        $this->container->singleton(Config::class, static fn (Container $container) => Config::load([
            'app' => require __DIR__ . '/../../config/app.php',
            'database' => require __DIR__ . '/../../config/database.php',
            'jwt' => require __DIR__ . '/../../config/jwt.php',
            'cors' => require __DIR__ . '/../../config/cors.php',
            'rate_limiter' => require __DIR__ . '/../../config/rate_limiter.php',
            'permissions' => require __DIR__ . '/../../config/permissions.php',
        ]));
        $this->container->singleton(JwtService::class, static fn (Container $container) => new JwtService($container->resolve(Config::class)));
        $this->container->singleton(\Core\RateLimiter::class, static fn (Container $container) => new \Core\RateLimiter());
    }
}
