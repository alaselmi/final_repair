<?php

namespace Api;

require_once __DIR__ . '/../core/MiddlewareInterface.php';
require_once __DIR__ . '/../core/Response.php';

use Core\MiddlewareInterface;
use Core\Response;

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, callable $action, array $middleware = []): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'action' => $action,
            'middleware' => $middleware,
            'pattern' => $this->buildPattern($path),
            'paramNames' => $this->extractParamNames($path),
        ];
    }

    public function dispatch(string $method, string $uri): void
    {
        $requestPath = parse_url($uri, PHP_URL_PATH);
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (preg_match($route['pattern'], $requestPath, $matches)) {
                array_shift($matches);
                $params = $this->buildParams($route['paramNames'], $matches);

                if (!$this->executeMiddleware($route['middleware'])) {
                    return;
                }

                $result = call_user_func_array($route['action'], $params);

                if ($result !== null) {
                    Response::json(['success' => true, 'data' => $result]);
                }

                return;
            }
        }

        Response::json(['success' => false, 'error' => 'Route not found.'], 404);
    }

    private function executeMiddleware(array $middleware): bool
    {
        foreach ($middleware as $item) {
            if (is_callable($item)) {
                $result = call_user_func($item);
            } elseif (is_object($item) && $item instanceof MiddlewareInterface) {
                $result = $item->handle();
            } else {
                continue;
            }

            if ($result === false) {
                return false;
            }
        }

        return true;
    }

    private function extractParamNames(string $path): array
    {
        preg_match_all('/\{([^\/}]+)\}/', $path, $matches);
        return $matches[1] ?? [];
    }

    private function buildPattern(string $path): string
    {
        $pattern = preg_replace('/\{[^\/}]+\}/', '([^/]+)', $path);
        return '/^' . str_replace('/', '\/', $pattern) . '$/';
    }

    private function buildParams(array $names, array $values): array
    {
        $params = [];

        foreach ($names as $index => $name) {
            $params[$name] = isset($values[$index]) ? urldecode($values[$index]) : null;
        }

        return $params;
    }
}
