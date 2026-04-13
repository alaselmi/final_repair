<?php
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/../services/csrf.php';

function getCurrentUser(): ?array
{
    if (empty($_SESSION['user_id'])) {
        return null;
    }

    $pdo = getConnection();
    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    return $stmt->fetch() ?: null;
}

function requireAuth(): array
{
    $user = getCurrentUser();
    if (!$user) {
        jsonResponse(['message' => 'Authentication required.'], 401);
    }
    return $user;
}

function requireAdmin(): array
{
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        jsonResponse(['message' => 'Admin access required.'], 403);
    }
    return $user;
}

function sanitizeText(string $text): string
{
    return trim(htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
}

function validateEnum(string $value, array $allowed, string $field): string
{
    if (!in_array($value, $allowed, true)) {
        jsonResponse(['message' => sprintf('Invalid %s value.', $field)], 400);
    }
    return $value;
}

function simulateNotification(array $user, string $subject, string $message): void
{
    // In a real system, integrate email or SMS here.
    // This returns a simulated notification payload for debugging.
    jsonResponse([
        'notification' => [
            'to' => $user['email'],
            'subject' => $subject,
            'message' => $message,
        ],
    ]);
}
