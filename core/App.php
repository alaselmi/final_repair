<?php

namespace Core;

class App
{
    public Router $router;
    private Container $container;

    public function __construct(?Container $container = null)
    {
        $this->container = $container ?? Container::getInstance();
        $this->router = new Router($this->container);
    }

    public function run(): void
    {
        $this->router->dispatch($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
    }
}
