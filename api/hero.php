<?php
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

function getCurrentUser(PDO $pdo)
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT id, role FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    return $stmt->fetch();
}

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT id, title, description FROM hero_settings ORDER BY id DESC LIMIT 1');
    $hero = $stmt->fetch();
    jsonResponse($hero ?: ['title' => '', 'description' => '']);
}

$user = getCurrentUser($pdo);
if (!$user || $user['role'] !== 'admin') {
    jsonResponse(['message' => 'Admin access required.'], 403);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
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
