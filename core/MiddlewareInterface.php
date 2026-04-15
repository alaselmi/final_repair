<?php

namespace Core;

interface MiddlewareInterface
{
    public function handle(Request $request, callable $next): bool;
}
