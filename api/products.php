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

function seedDefaultProducts(PDO $pdo): void
{
    $stmt = $pdo->query('SELECT COUNT(*) AS count FROM products');
    $count = (int) $stmt->fetchColumn();
    if ($count > 0) {
        return;
    }

    $defaultProducts = [
        ['Tempered Glass Screen Protector', 'ClearGuard', 'Accessories', '19.99', 'images/tempered-glass.svg', 'Ultra-clear protection that keeps your screen scratch-free without losing touch sensitivity.'],
        ['Fast Wireless Charger', 'VoltWave', 'Chargers', '29.99', 'images/wireless-charger.svg', 'Compact wireless charging pad for fast top-up sessions at home or on the desk.'],
        ['Phone Grip & Stand', 'GripMate', 'Cases', '14.99', 'images/phone-grip.svg', 'Slim grip accessory for easier handling and hands-free media viewing.'],
        ['USB-C Power Cable', 'ChargePro', 'Cables', '9.99', 'images/usb-c-cable.svg', 'Durable braided charging cable for fast charge and data transfer.'],
    ];

    $insert = $pdo->prepare('INSERT INTO products (name, brand, category, price, image, description) VALUES (:name, :brand, :category, :price, :image, :description)');
    foreach ($defaultProducts as $product) {
        [$name, $brand, $category, $price, $image, $description] = $product;
        $insert->execute([
            'name' => $name,
            'brand' => $brand,
            'category' => $category,
            'price' => $price,
            'image' => $image,
            'description' => $description,
        ]);
    }
}

if ($method === 'GET') {
    seedDefaultProducts($pdo);
    $stmt = $pdo->query('SELECT id, name, brand, category, price, image, description FROM products ORDER BY created_at DESC');
    jsonResponse($stmt->fetchAll());
}

$user = getCurrentUser($pdo);
if (!$user || $user['role'] !== 'admin') {
    jsonResponse(['message' => 'Admin access required.'], 403);
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $name = trim($data['name'] ?? '');
    $brand = trim($data['brand'] ?? '');
    $category = trim($data['category'] ?? '');
    $price = trim($data['price'] ?? '0');
    $image = trim($data['image'] ?? '');
    $description = trim($data['description'] ?? '');

    if (!$name || !$description) {
        jsonResponse(['message' => 'Name and description are required.'], 400);
    }

    $priceValue = preg_replace('/[^0-9.]/', '', $price);
    $insert = $pdo->prepare('INSERT INTO products (name, brand, category, price, image, description) VALUES (:name, :brand, :category, :price, :image, :description)');
    $insert->execute([
        'name' => $name,
        'brand' => $brand,
        'category' => $category,
        'price' => $priceValue,
        'image' => $image,
        'description' => $description,
    ]);

    jsonResponse(['message' => 'Product added successfully.']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['message' => 'Product ID is required.'], 400);
    }

    $delete = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $delete->execute(['id' => $id]);
    jsonResponse(['message' => 'Product removed successfully.']);
}

jsonResponse(['message' => 'Method not allowed.'], 405);
