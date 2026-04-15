<?php

return [
    'max_attempts' => (int) env('RATE_LIMIT_MAX', 60),
    'window_seconds' => (int) env('RATE_LIMIT_WINDOW', 60),
];
