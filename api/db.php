<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/session.php';

secureSessionStart();

function jsonResponse($data, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
