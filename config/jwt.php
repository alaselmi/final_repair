<?php

return [
    'secret' => env('JWT_SECRET', 'change-me-secret'),
    'ttl' => (int) env('JWT_TTL', 3600),
];
