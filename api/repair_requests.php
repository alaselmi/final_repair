<?php
require_once __DIR__ . '/common.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];
$user = getCurrentUser();

if ($method === 'GET') {
    if (isset($_GET['stats'])) {
        requireAdmin();
        $stmt = $pdo->query('SELECT
            COUNT(*) AS total_repairs,
            SUM(status = "Pending") AS pending_repairs,
            SUM(status = "In Progress") AS in_progress_repairs,
            SUM(status = "Completed") AS completed_repairs
            FROM repair_requests');
        jsonResponse($stmt->fetch());
    }

    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $stmt = $pdo->prepare('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id WHERE r.id = :id');
        $stmt->execute(['id' => $id]);
        $repair = $stmt->fetch();
        if (!$repair) {
            jsonResponse(['message' => 'Repair request not found.'], 404);
        }

        if ($user['role'] !== 'admin' && $repair['user_id'] !== $user['id']) {
            jsonResponse(['message' => 'Access denied.'], 403);
        }

        $updatesStmt = $pdo->prepare('SELECT id, message, status, created_at FROM repair_updates WHERE repair_id = :repair_id ORDER BY created_at DESC');
        $updatesStmt->execute(['repair_id' => $id]);
        $repair['updates'] = $updatesStmt->fetchAll();

        $ratingStmt = $pdo->prepare('SELECT rating, comment, created_at FROM repair_ratings WHERE repair_id = :repair_id ORDER BY created_at DESC');
        $ratingStmt->execute(['repair_id' => $id]);
        $repair['ratings'] = $ratingStmt->fetchAll();

        jsonResponse($repair);
    }

    if ($user['role'] === 'admin') {
        $stmt = $pdo->query('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC');
        $repairs = $stmt->fetchAll();
        foreach ($repairs as &$repair) {
            $updatesStmt = $pdo->prepare('SELECT id, message, status, created_at FROM repair_updates WHERE repair_id = :repair_id ORDER BY created_at DESC');
            $updatesStmt->execute(['repair_id' => $repair['id']]);
            $repair['updates'] = $updatesStmt->fetchAll();
        }
        unset($repair);
        jsonResponse($repairs);
    }

    $stmt = $pdo->prepare('SELECT r.* FROM repair_requests r WHERE r.user_id = :user_id ORDER BY r.created_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    $repairs = $stmt->fetchAll();
    foreach ($repairs as &$repair) {
        $ratingStmt = $pdo->prepare('SELECT rating, comment, created_at FROM repair_ratings WHERE repair_id = :repair_id AND user_id = :user_id ORDER BY created_at DESC');
        $ratingStmt->execute(['repair_id' => $repair['id'], 'user_id' => $user['id']]);
        $repair['rating'] = $ratingStmt->fetch() ?: null;

        $updatesStmt = $pdo->prepare('SELECT id, message, status, created_at FROM repair_updates WHERE repair_id = :repair_id ORDER BY created_at DESC');
        $updatesStmt->execute(['repair_id' => $repair['id']]);
        $repair['updates'] = $updatesStmt->fetchAll();
    }
    unset($repair);
    jsonResponse($repairs);
}

if ($method === 'POST') {
    requireCsrfToken(getRequestCsrfToken());
    $action = $_GET['action'] ?? '';
    $data = getJsonPayload();

    if ($action === 'rate') {
        $repairId = (int) ($data['repair_id'] ?? 0);
        $rating = (int) ($data['rating'] ?? 0);
        $comment = sanitizeText($data['comment'] ?? '');

        if (!$repairId || $rating < 1 || $rating > 5) {
            jsonResponse(['message' => 'Repair ID and a valid rating between 1 and 5 are required.'], 400);
        }

        $stmt = $pdo->prepare('SELECT status, user_id FROM repair_requests WHERE id = :id');
        $stmt->execute(['id' => $repairId]);
        $repair = $stmt->fetch();
        if (!$repair) {
            jsonResponse(['message' => 'Repair request not found.'], 404);
        }
        if ($repair['user_id'] !== $user['id']) {
            jsonResponse(['message' => 'Access denied.'], 403);
        }
        if ($repair['status'] !== 'Completed') {
            jsonResponse(['message' => 'You can rate a repair only after it is completed.'], 400);
        }

        $insert = $pdo->prepare('INSERT INTO repair_ratings (repair_id, user_id, rating, comment) VALUES (:repair_id, :user_id, :rating, :comment)');
        $insert->execute([
            'repair_id' => $repairId,
            'user_id' => $user['id'],
            'rating' => $rating,
            'comment' => $comment,
        ]);

        jsonResponse(['message' => 'Thank you for your rating.']);
    }

    $deviceType = sanitizeText($data['device_type'] ?? '');
    $brand = sanitizeText($data['brand'] ?? '');
    $problemDescription = sanitizeText($data['problem_description'] ?? '');
    $estimatedPrice = number_format((float) ($data['estimated_price'] ?? 0), 2, '.', '');
    $image = sanitizeText($data['image'] ?? null);

    if (!$deviceType || !$brand || !$problemDescription) {
        jsonResponse(['message' => 'Device type, brand, and problem description are required.'], 400);
    }

    $stmt = $pdo->prepare('INSERT INTO repair_requests (user_id, device_type, brand, problem_description, image, estimated_price) VALUES (:user_id, :device_type, :brand, :problem_description, :image, :estimated_price)');
    $stmt->execute([
        'user_id' => $user['id'],
        'device_type' => $deviceType,
        'brand' => $brand,
        'problem_description' => $problemDescription,
        'image' => $image,
        'estimated_price' => $estimatedPrice,
    ]);

    jsonResponse(['message' => 'Repair request submitted successfully.', 'repair_id' => $pdo->lastInsertId()]);
}

if ($method === 'PATCH') {
    requireCsrfToken(getRequestCsrfToken());
    requireAdmin();
    $data = getJsonPayload();
    $repairId = (int) ($data['repair_id'] ?? 0);
    $status = isset($data['status']) ? validateEnum($data['status'], ['Pending', 'In Progress', 'Completed'], 'status') : null;
    $estimatedPrice = isset($data['estimated_price']) ? number_format((float) $data['estimated_price'], 2, '.', '') : null;
    $message = sanitizeText($data['message'] ?? '');

    if (!$repairId) {
        jsonResponse(['message' => 'Repair request ID is required.'], 400);
    }

    $fields = [];
    $params = ['id' => $repairId];
    if ($status !== null) {
        $fields[] = 'status = :status';
        $params['status'] = $status;
    }
    if ($estimatedPrice !== null) {
        $fields[] = 'estimated_price = :estimated_price';
        $params['estimated_price'] = $estimatedPrice;
    }

    if ($fields) {
        $stmt = $pdo->prepare('UPDATE repair_requests SET ' . implode(', ', $fields) . ' WHERE id = :id');
        $stmt->execute($params);
    }

    if ($message) {
        $insert = $pdo->prepare('INSERT INTO repair_updates (repair_id, message, status) VALUES (:repair_id, :message, :status)');
        $insert->execute([
            'repair_id' => $repairId,
            'message' => $message,
            'status' => $status,
        ]);
    }

    jsonResponse(['message' => 'Repair request updated successfully.']);
}

jsonResponse(['message' => 'Method not allowed.'], 405);
