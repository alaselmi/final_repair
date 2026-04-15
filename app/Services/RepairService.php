<?php

namespace App\Services;

use App\Models\RepairModel;

class RepairService
{
    private RepairModel $repairModel;

    public function __construct(RepairModel $repairModel)
    {
        $this->repairModel = $repairModel;
    }

    public function listRepairs(array $filters = [], int $limit = 25, int $offset = 0): array
    {
        return $this->repairModel->getRepairs($filters, $limit, $offset);
    }

    public function countRepairs(array $filters = []): int
    {
        return $this->repairModel->countRepairs($filters);
    }

    public function getRepairById(int $id): ?array
    {
        return $this->repairModel->getRepairById($id);
    }

    public function createRepair(array $data): int
    {
        return $this->repairModel->createRepair($data);
    }

    public function updateStatus(int $id, string $status): bool
    {
        return $this->repairModel->updateStatus($id, $status);
    }

    public function normalizeStatusFilter(string $status): ?string
    {
        return match (strtolower(trim($status))) {
            'pending' => 'Pending',
            'in progress', 'in_progress' => 'In Progress',
            'ready' => 'Ready',
            'delivered' => 'Delivered',
            'completed' => 'Completed',
            default => null,
        };
    }
}
