<?php
require_once __DIR__ . '/common.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, title, description FROM hero_settings ORDER BY id DESC LIMIT 1');
    $hero = $stmt->fetch();
    jsonResponse($hero ?: ['title' => '', 'description' => '']);
}

$user = getCurrentUser();
if (!$user || $user['role'] !== 'admin') {
    jsonResponse(['message' => 'Admin access required.'], 403);
}

if ($method === 'POST') {
    requireCsrfToken(getRequestCsrfToken());
    $data = getJsonPayload();
    $title = trim($data['title'] ?? '');
    $description = trim($data['description'] ?? '');

    if (!$title || !$description) {
        jsonResponse(['message' => 'Title and description are required.'], 400);
    }

    $insert = $pdo->prepare('INSERT INTO hero_settings (id, title, description) VALUES (1, :title, :description) ON DUPLICATE KEY UPDATE title = :title, description = :description');
    $insert->execute([
        'title' => $title,
        'description' => $description,
    ]);

    jsonResponse(['message' => 'Hero settings updated successfully.']);
}

jsonResponse(['message' => 'Method not allowed.'], 405);
