<?php

namespace Core;

class ApiResponse
{
    public static function success($data, string $message = '', int $code = 200, array $meta = []): void
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => $meta,
        ];

        self::json($payload, $code);
    }

    public static function error(string $message, int $code = 400, array $errors = [], array $meta = []): void
    {
        $payload = [
            'success' => false,
            'message' => $message,
            'data' => [],
            'meta' => $meta,
        ];

        if (!empty($errors)) {
            $payload['errors'] = $errors;
        }

        self::json($payload, $code);
    }

    public static function json($payload, int $code): void
    {
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
        }

        http_response_code($code);
        echo json_encode($payload, JSON_UNESCAPED_UNICODE);
        exit;
    }
}
