<?php

namespace Core;

class RateLimiter
{
    private string $storagePath;

    public function __construct(string $storagePath = null)
    {
        $this->storagePath = $storagePath ?? __DIR__ . '/../cache/rate_limiter';

        if (!is_dir($this->storagePath)) {
            mkdir($this->storagePath, 0755, true);
        }
    }

    public function hit(string $key, int $limit, int $window): array
    {
        $filename = $this->storagePath . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $key) . '.json';
        $entry = ['count' => 0, 'expires_at' => time() + $window];

        if (file_exists($filename)) {
            $content = file_get_contents($filename);
            $saved = $content ? json_decode($content, true) : null;
            if (is_array($saved)) {
                $entry = array_merge($entry, $saved);
            }
        }

        $now = time();
        if ($entry['expires_at'] <= $now) {
            $entry = ['count' => 0, 'expires_at' => $now + $window];
        }

        $entry['count']++;

        file_put_contents($filename, json_encode($entry), LOCK_EX);

        return [
            'limit' => $limit,
            'remaining' => max(0, $limit - $entry['count']),
            'retry_after' => max(0, $entry['expires_at'] - $now),
            'allowed' => $entry['count'] <= $limit,
        ];
    }
}
