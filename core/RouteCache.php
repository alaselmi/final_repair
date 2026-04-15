<?php

namespace Core;

class RouteCache
{
    public static function load(string $sourcePath, string $cachePath, bool $useCache = false): array
    {
        if ($useCache && file_exists($cachePath) && filemtime($cachePath) >= filemtime($sourcePath)) {
            $cachedRoutes = require $cachePath;
            if (is_array($cachedRoutes)) {
                return $cachedRoutes;
            }
        }

        $routes = require $sourcePath;
        $compiledRoutes = self::compileRoutes($routes);
        self::write($cachePath, $compiledRoutes);

        return $compiledRoutes;
    }

    private static function compileRoutes(array $routes): array
    {
        foreach ($routes as $group => $groupRoutes) {
            foreach ($groupRoutes as $index => $route) {
                $routes[$group][$index] = self::compileRoute($route);
            }
        }

        return $routes;
    }

    private static function compileRoute(array $route): array
    {
        if (!isset($route['path'])) {
            return $route;
        }

        if (!isset($route['pattern'])) {
            $route['pattern'] = self::buildPattern($route['path']);
        }

        if (!isset($route['paramNames'])) {
            $route['paramNames'] = self::extractParamNames($route['path']);
        }

        return $route;
    }

    private static function write(string $cachePath, array $routes): void
    {
        $directory = dirname($cachePath);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $content = '<?php' . PHP_EOL . PHP_EOL . 'return ' . var_export($routes, true) . ';' . PHP_EOL;
        file_put_contents($cachePath, $content, LOCK_EX);
    }

    private static function extractParamNames(string $path): array
    {
        preg_match_all('/\{([^\/}]+)\}/', $path, $matches);
        return $matches[1] ?? [];
    }

    private static function buildPattern(string $path): string
    {
        $escaped = preg_quote($path, '/');
        $pattern = preg_replace('/\\\{[^\/}]+\\\}/', '([^/]+)', $escaped);
        return '/^' . $pattern . '$/';
    }
}
