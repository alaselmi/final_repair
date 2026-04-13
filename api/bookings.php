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

$user = getCurrentUser($pdo);
if (!$user) {
    jsonResponse(['message' => 'Authentication required.'], 401);
}

if ($method === 'GET') {
    if ($user['role'] === 'admin') {
        $stmt = $pdo->query('SELECT b.*, u.name AS user_name, u.email AS user_email FROM bookings b JOIN users u ON b.user_id = u.id ORDER BY b.created_at DESC');
        jsonResponse($stmt->fetchAll());
    }

    $stmt = $pdo->prepare('SELECT b.*, u.name AS user_name, u.email AS user_email FROM bookings b JOIN users u ON b.user_id = u.id WHERE b.user_id = :user_id ORDER BY b.created_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    jsonResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $model = trim($data['model'] ?? '');
    $service = trim($data['service'] ?? '');
    $date = trim($data['date'] ?? '');
    $price = trim($data['price'] ?? '0');
    $status = trim($data['status'] ?? 'Scheduled');

    if (!$model || !$service || !$date) {
        jsonResponse(['message' => 'Device model, service, and date are required.'], 400);
    }

    $insert = $pdo->prepare('INSERT INTO bookings (user_id, model, service, date, duration, price, notes, status) VALUES (:user_id, :model, :service, :date, :duration, :price, :notes, :status)');
    $insert->execute([
        'user_id' => $user['id'],
        'model' => $model,
        'service' => $service,
        'date' => $date,
        'duration' => $data['duration'] ?? 'TBD',
        'price' => $price,
        'notes' => $data['details'] ?? '',
        'status' => $status,
    ]);

    jsonResponse(['message' => 'Repair booking created successfully.']);
}

if ($method === 'PATCH') {
    if ($user['role'] !== 'admin') {
        jsonResponse(['message' => 'Admin access required.'], 403);
    }

    $params = json_decode(file_get_contents('php://input'), true) ?: [];
    $bookingId = $params['id'] ?? null;
    $status = trim($params['status'] ?? '');

    if (!$bookingId || !$status) {
        jsonResponse(['message' => 'Booking ID and status are required.'], 400);
    }

    $update = $pdo->prepare('UPDATE bookings SET status = :status WHERE id = :id');
    $update->execute(['status' => $status, 'id' => $bookingId]);
    jsonResponse(['message' => 'Booking status updated successfully.']);
}

jsonResponse(['message' => 'Method not allowed.'], 405);
