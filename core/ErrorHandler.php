<?php

namespace Core;

class ErrorHandler
{
    public static function register(): void
    {
        set_exception_handler([self::class, 'handleException']);
        set_error_handler([self::class, 'handleError']);
        register_shutdown_function([self::class, 'handleShutdown']);
    }

    public static function handleException(\Throwable $exception): void
    {
        $status = $exception instanceof HttpException ? $exception->getStatusCode() : 500;
        $message = $exception->getMessage() ?: 'An unexpected error occurred.';

        self::logException($exception);

        if (self::isApiRequest()) {
            ApiResponse::error($message, $status);
        }

        self::renderWebError($status, $message);
    }

    private static function logException(\Throwable $exception): void
    {
        try {
            $logger = Container::getInstance()->resolve(Logger::class);
            $logger->error($exception->getMessage(), ['exception' => $exception]);
        } catch (\Throwable $error) {
            // Silent fallback when logging is unavailable.
        }
    }

    public static function handleError(int $severity, string $message, string $file, int $line): bool
    {
        if (!(error_reporting() & $severity)) {
            return false;
        }

        throw new \ErrorException($message, 0, $severity, $file, $line);
    }

    public static function handleShutdown(): void
    {
        $error = error_get_last();
        if ($error === null) {
            return;
        }

        $fatalErrors = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR];
        if (in_array($error['type'], $fatalErrors, true)) {
            self::handleException(new \ErrorException($error['message'], 0, $error['type'], $error['file'], $error['line']));
        }
    }

    private static function isApiRequest(): bool
    {
        $uri = $_SERVER['REQUEST_URI'] ?? '';
        return str_starts_with($uri, '/api/');
    }

    private static function renderWebError(int $status, string $message): void
    {
        http_response_code($status);
        $errorMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        require __DIR__ . '/../app/Views/error.php';
        exit;
    }
}
