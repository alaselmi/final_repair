<?php

namespace Core;

class Request
{
    private string $path;
    private string $method;
    private array $query = [];
    private array $body = [];
    private array $routeParams = [];

    public function __construct(array $data = null)
    {
        $this->path = '/';
        $this->method = 'GET';
        $this->query = [];
        $this->body = [];
        $this->routeParams = [];

        if ($data === null) {
            $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
            $this->method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
            $this->query = $_GET;

            $rawBody = file_get_contents('php://input');
            if ($rawBody !== false && trim($rawBody) !== '') {
                $decoded = json_decode($rawBody, true);
                $this->body = is_array($decoded) ? $decoded : $_POST;
            } else {
                $this->body = $_POST;
            }
        } else {
            $this->body = $data;
        }
    }

    public static function fromGlobals(): self
    {
        return new self();
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function setPath(string $path): void
    {
        $this->path = $path;
    }

    public function getMethod(): string
    {
        return $this->method;
    }

    public function getQuery(): array
    {
        return $this->query;
    }

    public function getBody(): array
    {
        return $this->body;
    }

    public function getRouteParams(): array
    {
        return $this->routeParams;
    }

    public function setRouteParams(array $params): void
    {
        $this->routeParams = $params;
    }

    public function get(string $name, $default = null)
    {
        return $this->routeParams[$name] ?? $this->body[$name] ?? $this->query[$name] ?? $default;
    }

    public function all(): array
    {
        return array_merge($this->query, $this->body, $this->routeParams);
    }

    public function getServerParam(string $name, $default = null)
    {
        return $_SERVER[$name] ?? $default;
    }
}
