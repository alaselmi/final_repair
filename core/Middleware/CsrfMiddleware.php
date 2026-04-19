<?php

namespace Core\Middleware;

class CsrfMiddleware implements \Core\MiddlewareInterface
{
    public function handle($request, $next)
    {
        // Generate CSRF token if not exists
        if (!isset($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        // Validate CSRF token on POST/PUT/DELETE
        if ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
            $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? null;
            
            if (!hash_equals($_SESSION['csrf_token'], $token ?? '')) {
                http_response_code(403);
                echo json_encode(['error' => 'CSRF token validation failed']);
                exit;
            }
        }

        return $next($request);
    }
}