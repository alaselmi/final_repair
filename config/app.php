<?php
return [
    'app_name' => env('APP_NAME', 'Reactive Smartphone Repair'),
    'app_url' => env('APP_URL', 'http://localhost'),
    'env' => env('APP_ENV', 'development'),
    'csrf_secret' => env('CSRF_SECRET', 'change-me-now'),
    'pagination' => [
        'per_page' => (int) env('PAGINATION_PER_PAGE', 20),
    ],
];
