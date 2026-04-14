<?php

namespace Api;

require_once __DIR__ . '/BaseController.php';
require_once __DIR__ . '/../app/Models/RepairModel.php';
require_once __DIR__ . '/../core/Validator.php';

use App\Models\RepairModel;
use Core\Validator;

class RepairController extends BaseController
{
    private RepairModel $repairModel;

    public function __construct()
    {
        parent::__construct();
        $this->repairModel = new RepairModel();
    }

    public function index(): void
    {
        $user = $this->authorize();

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int) ($_GET['limit'] ?? 25)));
        $status = trim((string) ($_GET['status'] ?? ''));

        $filters = [];
        if ($status !== '') {
            $filters['status'] = $this->normalizeStatusFilter($status);
            if ($filters['status'] === null) {
                $this->error('Invalid status filter.', 422);
            }
        }

        if ($user['role'] === 'technician') {
            $filters['technician_id'] = (int) $user['id'];
        } elseif ($user['role'] !== 'admin') {
            $filters['user_id'] = (int) $user['id'];
        }

        $total = $this->repairModel->countRepairs($filters);
        $offset = ($page - 1) * $limit;
        $repairs = $this->repairModel->getRepairs($filters, $limit, $offset);

        $this->success(
            ['repairs' => $repairs],
            'Repairs retrieved successfully.',
            200,
            ['total' => $total, 'page' => $page, 'limit' => $limit]
        );
    }

    public function show(string $id): void
    {
        $this->authorize();

        $repair = $this->repairModel->getRepairById((int) $id);
        if ($repair === null) {
            $this->error('Repair request not found.', 404);
        }

        $user = $this->getUser();
        if ($user['role'] !== 'admin' && $repair['user_id'] !== $user['id'] && $repair['technician_id'] !== $user['id']) {
            $this->error('Forbidden.', 403);
        }

        $this->success(['repair' => $repair]);
    }

    public function create(): void
    {
        $user = $this->authorize();

        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $validator = $this->validate($payload, [
            'device_type' => 'required',
            'brand' => 'required',
            'problem_description' => 'required',
        ]);

        $newRepairId = $this->repairModel->createRepair([
            'user_id' => $user['id'],
            'device_type' => $validator->sanitize('device_type'),
            'brand' => $validator->sanitize('brand'),
            'problem_description' => $validator->sanitize('problem_description'),
            'estimated_price' => is_numeric($payload['estimated_price'] ?? null) ? (float) $payload['estimated_price'] : 0.00,
        ]);

        $repair = $this->repairModel->getRepairById($newRepairId);
        $this->success(['repair' => $repair], 'Repair request created.', 201);
    }

    public function updateStatus(string $id): void
    {
        $this->authorize(['admin']);

        $payload = json_decode(file_get_contents('php://input'), true) ?: [];
        $validator = $this->validate($payload, [
            'status' => 'required',
        ]);

        $status = trim((string) ($payload['status'] ?? ''));
        $allowedStatuses = ['Pending', 'In Progress', 'Ready', 'Delivered', 'Completed'];
        if (!in_array($status, $allowedStatuses, true)) {
            $this->error('Invalid status value.', 422);
        }

        if (!$this->repairModel->updateStatus((int) $id, $status)) {
            $this->error('Unable to update repair status.', 500);
        }

        $repair = $this->repairModel->getRepairById((int) $id);
        $this->success(['repair' => $repair], 'Repair status updated.');
    }

    private function normalizeStatusFilter(string $status): ?string
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
