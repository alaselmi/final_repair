<?php

namespace Core;

class Env
{
    public static function load(string $path): void
    {
        if (!file_exists($path) || !is_readable($path)) {
            return;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            [$key, $value] = array_map('trim', explode('=', $line, 2) + [1 => '']);
            if ($key === '') {
                continue;
            }

            $value = self::unescapeValue($value);
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }

    public static function get(string $key, $default = null)
    {
        if (array_key_exists($key, $_ENV) && $_ENV[$key] !== null) {
            return $_ENV[$key];
        }

        if (array_key_exists($key, $_SERVER) && $_SERVER[$key] !== null) {
            return $_SERVER[$key];
        }

        $value = getenv($key);
        if ($value === false) {
            return $default;
        }

        return $value;
    }

    private static function unescapeValue(string $value): string
    {
        $value = trim($value);

        if (str_starts_with($value, '"') && str_ends_with($value, '"')) {
            $value = substr($value, 1, -1);
            $value = str_replace(['\\n', '\\r', '\\t', '\\"'], ["\n", "\r", "\t", '"'], $value);
        }

        return $value;
    }
}

namespace {
    if (!function_exists('env')) {
        function env(string $key, $default = null)
        {
            return \Core\Env::get($key, $default);
        }
    }

    if (!function_exists('config')) {
        function config(string $key, $default = null)
        {
            return \Core\Config::get($key, $default);
        }
    }
}
