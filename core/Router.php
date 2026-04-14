<?php

namespace Core;

require_once __DIR__ . '/MiddlewareInterface.php';

class Router
{
    private array $routes = [];

    public function add(string $method, string $path, callable $action, array $middleware = []): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'pattern' => $this->buildPattern($path),
            'paramNames' => $this->extractParamNames($path),
            'action' => $action,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(string $uri, string $method): void
    {
        $path = parse_url($uri, PHP_URL_PATH);
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (!preg_match($route['pattern'], $path, $matches)) {
                continue;
            }

            array_shift($matches);
            $params = $this->buildParams($route['paramNames'], $matches);

            if (!$this->executeMiddleware($route['middleware'])) {
                return;
            }

            $action = $this->resolveAction($route['action']);
            call_user_func_array($action, $params);
            return;
        }

        http_response_code(404);
        echo 'Route not found.';
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

    private function resolveAction($action)
    {
        if (is_array($action) && isset($action[0], $action[1]) && is_string($action[0]) && is_string($action[1]) && class_exists($action[0])) {
            return [new $action[0](), $action[1]];
        }

        return $action;
    }

    private function extractParamNames(string $path): array
    {
        preg_match_all('/\{([^\/}]+)\}/', $path, $matches);
        return $matches[1] ?? [];
    }

    private function buildPattern(string $path): string
    {
        $escaped = preg_quote($path, '/');
        $pattern = preg_replace('/\\\{[^\\/}]+\\\}/', '([^/]+)', $escaped);
        return '/^' . $pattern . '$/';
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
