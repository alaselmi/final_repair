<?php
return [
    'app_name' => 'Reactive Smartphone Repair',
    'app_url' => getenv('APP_URL') ?: 'http://localhost',
    'env' => getenv('APP_ENV') ?: 'development',
    'csrf_secret' => getenv('CSRF_SECRET') ?: 'change-me-now',
    'pagination' => [
        'per_page' => 20,
    ],
];
