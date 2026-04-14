<?php

namespace Core;

class Response
{
    public static function redirect(string $url): void
    {
        header('Location: ' . $url);
        exit;
    }

    public static function json(array $data, int $status = 200): void
    {
        header('Content-Type: application/json; charset=utf-8');
        http_response_code($status);
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $code = 400): void
    {
        http_response_code($code);
        echo $message;
        exit;
    }
}
