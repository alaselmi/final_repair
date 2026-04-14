<?php

namespace App\Models;

use Core\Database;
use PDO;

class RepairModel
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    public function getAllRepairs(): array
    {
        $query = 'SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC';
        $stmt = $this->db->query($query);
        return $stmt->fetchAll();
    }

    public function getRepairsByStatus(string $status): array
    {
        $stmt = $this->db->prepare('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id WHERE r.status = :status ORDER BY r.created_at DESC');
        $stmt->execute(['status' => $status]);
        return $stmt->fetchAll();
    }

    public function countRepairs(array $filters = []): int
    {
        $sql = 'SELECT COUNT(*) AS total FROM repair_requests r JOIN users u ON r.user_id = u.id';
        $filterData = $this->buildFilterData($filters);

        if (!empty($filterData['clauses'])) {
            $sql .= ' WHERE ' . implode(' AND ', $filterData['clauses']);
        }

        $stmt = $this->db->prepare($sql);
        foreach ($filterData['params'] as $key => $value) {
            $stmt->bindValue(':' . $key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }
        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }

    public function getRepairs(array $filters = [], int $limit = 25, int $offset = 0): array
    {
        $sql = 'SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id';
        $filterData = $this->buildFilterData($filters);

        if (!empty($filterData['clauses'])) {
            $sql .= ' WHERE ' . implode(' AND ', $filterData['clauses']);
        }

        $sql .= ' ORDER BY r.created_at DESC LIMIT :limit OFFSET :offset';
        $stmt = $this->db->prepare($sql);

        foreach ($filterData['params'] as $key => $value) {
            $stmt->bindValue(':' . $key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function countByStatus(): array
    {
        $stmt = $this->db->query('SELECT status, COUNT(*) AS total FROM repair_requests GROUP BY status');
        $rows = $stmt->fetchAll();

        $counts = [
            'pending' => 0,
            'in_progress' => 0,
            'ready' => 0,
            'delivered' => 0,
            'completed' => 0,
        ];

        foreach ($rows as $row) {
            $key = $this->normalizeStatus($row['status']);
            if (isset($counts[$key])) {
                $counts[$key] = (int) $row['total'];
            }
        }

        return $counts;
    }

    public function getRepairsForUser(int $userId): array
    {
        $stmt = $this->db->prepare('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id WHERE r.user_id = :user_id ORDER BY r.created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        return $stmt->fetchAll();
    }

    public function getRepairsForTechnician(int $technicianId): array
    {
        $stmt = $this->db->prepare('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id WHERE r.technician_id = :technician_id ORDER BY r.created_at DESC');
        $stmt->execute(['technician_id' => $technicianId]);
        return $stmt->fetchAll();
    }

    public function getRepairById(int $id): ?array
    {
        $stmt = $this->db->prepare('SELECT r.*, u.name AS customer_name, u.email AS customer_email FROM repair_requests r JOIN users u ON r.user_id = u.id WHERE r.id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $repair = $stmt->fetch();

        return $repair === false ? null : $repair;
    }

    public function createRepair(array $data): int
    {
        $stmt = $this->db->prepare('INSERT INTO repair_requests (user_id, device_type, brand, problem_description, estimated_price, status) VALUES (:user_id, :device_type, :brand, :problem_description, :estimated_price, :status)');
        $stmt->execute([
            'user_id' => $data['user_id'],
            'device_type' => $data['device_type'],
            'brand' => $data['brand'],
            'problem_description' => $data['problem_description'],
            'estimated_price' => $data['estimated_price'],
            'status' => $data['status'] ?? 'Pending',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE repair_requests SET status = :status WHERE id = :id');
        return $stmt->execute(['status' => $status, 'id' => $id]);
    }

    private function buildFilterData(array $filters): array
    {
        $clauses = [];
        $params = [];

        if (isset($filters['user_id'])) {
            $clauses[] = 'r.user_id = :user_id';
            $params['user_id'] = $filters['user_id'];
        }

        if (isset($filters['technician_id'])) {
            $clauses[] = 'r.technician_id = :technician_id';
            $params['technician_id'] = $filters['technician_id'];
        }

        if (isset($filters['status'])) {
            $clauses[] = 'r.status = :status';
            $params['status'] = $filters['status'];
        }

        return ['clauses' => $clauses, 'params' => $params];
    }

    private function normalizeStatus(string $status): string
    {
        return match (strtolower($status)) {
            'pending' => 'pending',
            'in progress' => 'in_progress',
            'ready' => 'ready',
            'delivered' => 'delivered',
            'completed' => 'completed',
            default => 'pending',
        };
    }
}
