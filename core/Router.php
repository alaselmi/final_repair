<?php

namespace Core;

require_once __DIR__ . '/MiddlewareInterface.php';
require_once __DIR__ . '/Request.php';
require_once __DIR__ . '/FormRequest.php';
require_once __DIR__ . '/HttpException.php';

class Router
{
    private Container $container;
    private array $routes = [];
    private array $globalMiddleware = [];

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    public function setGlobalMiddleware(array $middleware): void
    {
        $this->globalMiddleware = $middleware;
    }

    public function add(string $method, string $path, callable $action, array $middleware = [], ?string $pattern = null, ?array $paramNames = null): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'path' => $path,
            'pattern' => $pattern ?? $this->buildPattern($path),
            'paramNames' => $paramNames ?? $this->extractParamNames($path),
            'action' => $action,
            'middleware' => $middleware,
        ];
    }

    public function dispatch(string $uri, string $method): void
    {
        $request = Request::fromGlobals();
        $request->setPath(parse_url($uri, PHP_URL_PATH) ?: '/');
        $method = strtoupper($method);

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            if (!preg_match($route['pattern'], $request->getPath(), $matches)) {
                continue;
            }

            array_shift($matches);
            $params = $this->buildParams($route['paramNames'], $matches);
            $request->setRouteParams($params);

            $this->dispatchRoute($route, $request, $params);
            return;
        }

        throw new HttpException('Route not found.', 404);
    }

    private function dispatchRoute(array $route, Request $request, array $params): void
    {
        $action = $this->resolveAction($route['action']);
        $middleware = array_merge($this->globalMiddleware, $route['middleware'] ?? []);

        $this->executeMiddlewarePipeline($middleware, $request, function () use ($action, $params, $request) {
            $arguments = $this->resolveActionParameters($action, $params, $request);
            call_user_func_array($action, $arguments);
        });
    }

    private function executeMiddlewarePipeline(array $middleware, Request $request, callable $finalAction): bool
    {
        $index = 0;
        $runner = function () use (&$index, $middleware, $request, $finalAction, &$runner) {
            if (!isset($middleware[$index])) {
                $finalAction();
                return true;
            }

            $current = $middleware[$index++];
            $result = $this->callMiddleware($current, $request, $runner);
            return $result !== false;
        };

        return $runner();
    }

    private function callMiddleware($middleware, Request $request, callable $next)
    {
        if (is_callable($middleware)) {
            return call_user_func($middleware, $request, $next);
        }

        if (is_object($middleware)) {
            if ($middleware instanceof MiddlewareInterface) {
                return $middleware->handle($request, $next);
            }

            if (method_exists($middleware, 'handle')) {
                return $middleware->handle($request, $next);
            }
        }

        if (is_string($middleware) || (is_array($middleware) && isset($middleware[0]) && is_string($middleware[0]))) {
            if (is_array($middleware)) {
                $class = $middleware[0];
                $params = $middleware[1] ?? [];
                $params = is_array($params) ? $params : [$params];
            } else {
                [$class, $params] = $this->parseMiddlewareDefinition($middleware);
            }

            $instance = $this->container->resolve($class, $params);
            if ($instance instanceof MiddlewareInterface) {
                return $instance->handle($request, $next);
            }

            if (is_object($instance) && method_exists($instance, 'handle')) {
                return $instance->handle($request, $next);
            }
        }

        return true;
    }

    private function resolveAction($action)
    {
        if (is_array($action) && isset($action[0], $action[1]) && is_string($action[0]) && is_string($action[1]) && class_exists($action[0])) {
            return [$this->container->resolve($action[0]), $action[1]];
        }

        return $action;
    }

    private function parseMiddlewareDefinition(string $definition): array
    {
        if (str_contains($definition, ':')) {
            [$class, $parameters] = explode(':', $definition, 2);
            $args = array_map('trim', explode(',', $parameters));
            return [$class, $args];
        }

        return [$definition, []];
    }

    private function resolveActionParameters($action, array $routeParams, Request $request): array
    {
        if (!is_array($action) || !isset($action[0], $action[1])) {
            return array_values($routeParams);
        }

        [$controller, $method] = $action;
        $reflection = new \ReflectionMethod($controller, $method);
        $arguments = [];

        foreach ($reflection->getParameters() as $parameter) {
            $type = $parameter->getType();
            if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                $className = $type->getName();
                if (is_subclass_of($className, FormRequest::class)) {
                    $arguments[] = $this->container->resolve($className);
                    continue;
                }
            }

            $name = $parameter->getName();
            if (array_key_exists($name, $routeParams)) {
                $arguments[] = $routeParams[$name];
                continue;
            }

            if ($parameter->isDefaultValueAvailable()) {
                $arguments[] = $parameter->getDefaultValue();
                continue;
            }

            $arguments[] = null;
        }

        return $arguments;
    }

    private function extractParamNames(string $path): array
    {
        preg_match_all('/\{([^\/}]+)\}/', $path, $matches);
        return $matches[1] ?? [];
    }

    private function buildPattern(string $path): string
    {
        $escaped = preg_quote($path, '/');
        $pattern = preg_replace('/\\\{[^\/}]+\\\}/', '([^/]+)', $escaped);
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
