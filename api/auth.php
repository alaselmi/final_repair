<?php
require_once __DIR__ . '/db.php';

function ensureAdminUser(PDO $pdo): void
{
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email' => 'admin@repair.com']);
    if ($stmt->fetch()) {
        return;
    }

    $passwordHash = password_hash('admin123', PASSWORD_DEFAULT);
    $insert = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)');
    $insert->execute([
        'name' => 'Site Admin',
        'email' => 'admin@repair.com',
        'password' => $passwordHash,
        'role' => 'admin',
    ]);
}

function getCurrentUser(PDO $pdo)
{
    if (empty($_SESSION['user_id'])) {
        jsonResponse(null);
    }

    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(null);
    }

    $stmt = $pdo->prepare('SELECT id, model, service, date, duration, price, status, notes FROM bookings WHERE user_id = :user_id ORDER BY created_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    $user['bookings'] = $stmt->fetchAll();

    return $user;
}

function login(PDO $pdo): void
{
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $email = trim(strtolower($data['email'] ?? ''));
    $password = trim($data['password'] ?? '');

    if (!$email || !$password) {
        jsonResponse(['message' => 'Email and password are required.'], 400);
    }

    $stmt = $pdo->prepare('SELECT id, name, email, password, role FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['message' => 'Login failed: invalid email or password.'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $stmt = $pdo->prepare('SELECT id, model, service, date, duration, price, status, notes FROM bookings WHERE user_id = :user_id ORDER BY created_at DESC');
    $stmt->execute(['user_id' => $user['id']]);
    $user['bookings'] = $stmt->fetchAll();
    jsonResponse($user);
}

function register(PDO $pdo): void
{
    $data = json_decode(file_get_contents('php://input'), true) ?: [];
    $name = trim($data['name'] ?? '');
    $email = trim(strtolower($data['email'] ?? ''));
    $password = trim($data['password'] ?? '');

    if (!$name || !$email || !$password) {
        jsonResponse(['message' => 'Name, email, and password are required.'], 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        jsonResponse(['message' => 'A user with that email already exists.'], 409);
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $insert = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)');
    $insert->execute([
        'name' => $name,
        'email' => $email,
        'password' => $passwordHash,
        'role' => 'customer',
    ]);

    $userId = $pdo->lastInsertId();
    $_SESSION['user_id'] = $userId;
    jsonResponse(['id' => $userId, 'name' => $name, 'email' => $email, 'role' => 'customer', 'bookings' => []]);
}

function logout(): void
{
    unset($_SESSION['user_id']);
    session_destroy();
    jsonResponse(['message' => 'Logged out successfully.']);
}

$pdo = getConnection();
ensureAdminUser($pdo);
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'current':
        jsonResponse(getCurrentUser($pdo));
        break;
    case 'login':
        login($pdo);
        break;
    case 'register':
        register($pdo);
        break;
    case 'logout':
        logout();
        break;
    default:
        jsonResponse(['message' => 'Invalid auth action.'], 400);
        break;
}
