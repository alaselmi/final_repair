<?php

$origins = env('CORS_ALLOWED_ORIGINS', '*');
if (is_string($origins)) {
    $origins = array_filter(array_map('trim', explode(',', $origins)), static fn($value) => $value !== '');
}

return [
    'allowed_origins' => is_array($origins) ? $origins : [$origins],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    'allow_credentials' => (bool) env('CORS_ALLOW_CREDENTIALS', true),
];
