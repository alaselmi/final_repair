<?php

namespace App\Middleware;

use Core\Config;
use Core\MiddlewareInterface;
use Core\Request;

class CorsMiddleware implements MiddlewareInterface
{
    private array $allowedOrigins;
    private array $allowedMethods;
    private array $allowedHeaders;
    private bool $allowCredentials;

    public function __construct()
    {
        $this->allowedOrigins = config('cors.allowed_origins', ['*']);
        $this->allowedMethods = config('cors.allowed_methods', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
        $this->allowedHeaders = config('cors.allowed_headers', ['Content-Type', 'Authorization', 'X-Requested-With']);
        $this->allowCredentials = (bool) config('cors.allow_credentials', true);
    }

    public function handle(Request $request, callable $next): bool
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $allowed = in_array('*', $this->allowedOrigins, true) || in_array($origin, $this->allowedOrigins, true);

        if ($allowed) {
            header('Access-Control-Allow-Origin: ' . ($origin !== '' ? $origin : '*'));
            header('Access-Control-Allow-Methods: ' . implode(', ', $this->allowedMethods));
            header('Access-Control-Allow-Headers: ' . implode(', ', $this->allowedHeaders));
            header('Access-Control-Allow-Credentials: ' . ($this->allowCredentials ? 'true' : 'false'));
        }

        if ($request->getMethod() === 'OPTIONS') {
            http_response_code(204);
            return false;
        }

        return $next($request);
    }
}
