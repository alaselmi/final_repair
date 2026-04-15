<?php

namespace Core;

class Logger
{
    private string $path;

    public function __construct(string $path)
    {
        $this->path = $path;
    }

    public function error(string $message, array $context = []): void
    {
        $this->log('ERROR', $message, $context);
    }

    public function info(string $message, array $context = []): void
    {
        $this->log('INFO', $message, $context);
    }

    public function log(string $level, string $message, array $context = []): void
    {
        $directory = dirname($this->path);
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $entry = sprintf(
            "[%s] %s: %s\n",
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $this->formatMessage($message, $context)
        );

        file_put_contents($this->path, $entry, FILE_APPEND | LOCK_EX);
    }

    private function formatMessage(string $message, array $context): string
    {
        if (isset($context['exception']) && $context['exception'] instanceof \Throwable) {
            $exception = $context['exception'];
            return sprintf(
                "%s | %s in %s:%d\n%s",
                $message,
                get_class($exception),
                $exception->getFile(),
                $exception->getLine(),
                $exception->getTraceAsString()
            );
        }

        if (empty($context)) {
            return $message;
        }

        return $message . ' | ' . json_encode($context, JSON_UNESCAPED_UNICODE);
    }
}
