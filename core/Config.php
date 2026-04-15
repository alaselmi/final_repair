<?php

namespace Core;

class Config
{
    private static ?self $instance = null;
    private array $items = [];

    public function __construct(array $items = [])
    {
        $this->items = $items;
        self::$instance = $this;
    }

    public static function load(array $items): self
    {
        return new self($items);
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            throw new \RuntimeException('Configuration has not been loaded.');
        }

        return self::$instance;
    }

    public static function get(string $key, $default = null)
    {
        try {
            return self::getInstance()->get($key, $default);
        } catch (\RuntimeException $exception) {
            return $default;
        }
    }

    public function get(string $key, $default = null)
    {
        $segments = explode('.', $key);
        $value = $this->items;

        foreach ($segments as $segment) {
            if (!is_array($value) || !array_key_exists($segment, $value)) {
                return $default;
            }

            $value = $value[$segment];
        }

        return $value;
    }
}
