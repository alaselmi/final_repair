<?php

namespace App\Models;

use Core\Database;
use PDO;

class UserModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAllUsers(): array
    {
        $stmt = $this->db->query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }

    public function getUsersPaginated(int $offset, int $limit): array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC LIMIT :limit OFFSET :offset');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function getTotalUsersCount(): int
    {
        $stmt = $this->db->query('SELECT COUNT(*) AS total FROM users');
        return (int) $stmt->fetchColumn();
    }

    public function countUsers(): int
    {
        $stmt = $this->db->query('SELECT COUNT(*) AS total FROM users');
        return (int) $stmt->fetchColumn();
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT id, name, email, password, role FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user === false ? null : $user;
    }
}
