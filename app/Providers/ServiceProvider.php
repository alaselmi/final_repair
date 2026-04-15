<?php

namespace App\Providers;

use Core\Container;

abstract class ServiceProvider
{
    protected Container $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    abstract public function register(): void;

    public function boot(): void
    {
        // Optional boot logic for subclasses.
    }
}
