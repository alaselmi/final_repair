<?php
require_once __DIR__ . '/db.php';

$pdo = getConnection();
$method = $_SERVER['REQUEST_METHOD'];

function getCurrentUser(PDO $pdo)
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    return $stmt->fetch();
}

$user = getCurrentUser($pdo);
if (!$user) {
    jsonResponse(['message' => 'Authentication required.'], 401);
}

if ($method === 'GET') {
    $stmt = $pdo->prepare('SELECT c.id, c.product_id, c.quantity, p.name, p.brand, p.category, p.price, p.image, p.description FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = :user_id ORDER BY c.created_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    jsonResponse($stmt->fetchAll());
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $productId = (int) ($data['productId'] ?? 0);
    $quantity = max(1, (int) ($data['quantity'] ?? 1));

    if (!$productId) {
        jsonResponse(['message' => 'Product ID is required.'], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM cart_items WHERE user_id = :user_id AND product_id = :product_id');
    $stmt->execute(['user_id' => $user['id'], 'product_id' => $productId]);
    $existing = $stmt->fetch();

    if ($existing) {
        $update = $pdo->prepare('UPDATE cart_items SET quantity = quantity + :quantity WHERE id = :id');
        $update->execute(['quantity' => $quantity, 'id' => $existing['id']]);
    } else {
        $insert = $pdo->prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (:user_id, :product_id, :quantity)');
        $insert->execute(['user_id' => $user['id'], 'product_id' => $productId, 'quantity' => $quantity]);
    }

    jsonResponse(['message' => 'Cart updated successfully.']);
}

if ($method === 'DELETE') {
    if (isset($_GET['clear']) && $_GET['clear']) {
        $delete = $pdo->prepare('DELETE FROM cart_items WHERE user_id = :user_id');
        $delete->execute(['user_id' => $user['id']]);
        jsonResponse(['message' => 'Cart cleared successfully.']);
    }

    $itemId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if (!$itemId) {
        jsonResponse(['message' => 'Cart item ID is required.'], 400);
    }

    $delete = $pdo->prepare('DELETE FROM cart_items WHERE id = :id AND user_id = :user_id');
    $delete->execute(['id' => $itemId, 'user_id' => $user['id']]);
    jsonResponse(['message' => 'Cart item removed successfully.']);
}

jsonResponse(['message' => 'Method not allowed.'], 405);
