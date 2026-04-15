<?php

namespace App\Middleware;

use App\Services\AuthService;
use Core\ApiResponse;
use Core\MiddlewareInterface;
use Core\RateLimiter;
use Core\Request;
use Core\Config;

class RateLimitMiddleware implements MiddlewareInterface
{
    private RateLimiter $rateLimiter;
    private AuthService $authService;
    private int $limit;
    private int $window;

    public function __construct(RateLimiter $rateLimiter, AuthService $authService, array $options = [])
    {
        $this->rateLimiter = $rateLimiter;
        $this->authService = $authService;
        $this->limit = isset($options[0]) ? (int) $options[0] : (int) config('rate_limiter.max_attempts', 60);
        $this->window = isset($options[1]) ? (int) $options[1] : (int) config('rate_limiter.window_seconds', 60);
    }

    public function handle(Request $request, callable $next): bool
    {
        $user = $this->authService->getUser();
        $key = $user['id'] ?? $request->getServerParam('REMOTE_ADDR') ?? 'anonymous';
        $scope = $user ? 'user' : 'ip';
        $rateKey = sprintf('rate:%s:%s', $scope, $key);

        $result = $this->rateLimiter->hit($rateKey, $this->limit, $this->window);
        if (!$result['allowed']) {
            if (str_starts_with($request->getPath(), '/api/')) {
                ApiResponse::error('Too many requests.', 429, ['retry_after' => $result['retry_after']]);
                return false;
            }

            header('Retry-After: ' . $result['retry_after']);
            http_response_code(429);
            echo 'Too many requests. Please slow down.';
            return false;
        }

        return $next($request);
    }
}
