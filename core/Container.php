<?php

namespace Core;

class Container
{
    private static ?self $instance = null;
    private array $bindings = [];
    private array $instances = [];

    public static function setInstance(self $container): void
    {
        self::$instance = $container;
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    public function bind(string $abstract, $concrete): void
    {
        $this->bindings[$abstract] = $concrete;
        unset($this->instances[$abstract]);
    }

    public function singleton(string $abstract, $concrete): void
    {
        $this->bindings[$abstract] = $concrete;
        $this->instances[$abstract] = null;
    }

    public function instance(string $abstract, $object): void
    {
        $this->bindings[$abstract] = $object;
        $this->instances[$abstract] = $object;
    }

    public function make(string $abstract, array $parameters = [])
    {
        return $this->resolve($abstract, $parameters);
    }

    public function registerProvider(ServiceProvider $provider): void
    {
        $provider->register();
    }

    public function resolve(string $abstract, array $parameters = [], array &$buildCache = [])
    {
        if (array_key_exists($abstract, $this->instances) && $this->instances[$abstract] !== null) {
            return $this->instances[$abstract];
        }

        if (isset($this->bindings[$abstract])) {
            $binding = $this->bindings[$abstract];

            if ($binding instanceof \Closure) {
                $object = $binding($this, $parameters);
            } elseif (is_string($binding)) {
                $object = $this->build($binding, $parameters, $buildCache);
            } else {
                $object = $binding;
            }

            if (array_key_exists($abstract, $this->instances)) {
                $this->instances[$abstract] = $object;
            }

            return $object;
        }

        if (class_exists($abstract)) {
            return $this->build($abstract, $parameters, $buildCache);
        }

        throw new \RuntimeException("Unable to resolve binding or class: $abstract");
    }

    private function build(string $class, array $parameters = [], array &$buildCache = [])
    {
        if (isset($buildCache[$class])) {
            return $buildCache[$class];
        }

        if (!class_exists($class)) {
            throw new \RuntimeException("Unable to resolve class: $class");
        }

        $reflection = new \ReflectionClass($class);

        if (!$reflection->isInstantiable()) {
            throw new \RuntimeException("Class $class is not instantiable.");
        }

        $constructor = $reflection->getConstructor();
        if ($constructor === null || $constructor->getNumberOfParameters() === 0) {
            return $buildCache[$class] = new $class();
        }

        $dependencies = [];
        foreach ($constructor->getParameters() as $index => $parameter) {
            if (array_key_exists($index, $parameters)) {
                $value = $parameters[$index];
                $type = $parameter->getType();

                if ($type instanceof \ReflectionNamedType && $type->getName() === 'array' && is_string($value)) {
                    $value = array_filter(array_map('trim', explode(',', $value)), static fn($item) => $item !== '');
                }

                $dependencies[] = $value;
                continue;
            }

            if ($parameter->isDefaultValueAvailable()) {
                $dependencies[] = $parameter->getDefaultValue();
                continue;
            }

            $type = $parameter->getType();
            if ($type instanceof \ReflectionNamedType && !$type->isBuiltin()) {
                $dependencies[] = $this->resolve($type->getName(), [], $buildCache);
                continue;
            }

            if ($parameter->allowsNull()) {
                $dependencies[] = null;
                continue;
            }

            throw new \RuntimeException("Unable to resolve dependency {$parameter->getName()} for class $class.");
        }

        return $buildCache[$class] = $reflection->newInstanceArgs($dependencies);
    }
}
