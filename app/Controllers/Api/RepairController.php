<?php

namespace App\Controllers\Api;

use App\Http\Requests\CreateRepairRequest;
use App\Http\Requests\UpdateRepairStatusRequest;
use App\Services\RepairService;

class RepairController extends BaseController
{
    private RepairService $repairService;

    public function __construct(RepairService $repairService, AuthService $authService)
    {
        parent::__construct($authService);
        $this->repairService = $repairService;
    }

    public function index(): void
    {
        $user = $this->authorize();

        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = max(1, min(100, (int) ($_GET['limit'] ?? 25)));
        $status = trim((string) ($_GET['status'] ?? ''));

        $filters = [];
        if ($status !== '') {
            $filters['status'] = $this->repairService->normalizeStatusFilter($status);
            if ($filters['status'] === null) {
                $this->error('Invalid status filter.', 422);
            }
        }

        if ($user['role'] === 'technician') {
            $filters['technician_id'] = (int) $user['id'];
        } elseif ($user['role'] !== 'admin') {
            $filters['user_id'] = (int) $user['id'];
        }

        $total = $this->repairService->countRepairs($filters);
        $offset = ($page - 1) * $limit;
        $repairs = $this->repairService->listRepairs($filters, $limit, $offset);

        $this->success(
            ['repairs' => $repairs],
            'Repairs retrieved successfully.',
            200,
            ['total' => $total, 'page' => $page, 'limit' => $limit]
        );
    }

    public function show(string $id): void
    {
        $user = $this->authorize();

        $repair = $this->repairService->getRepairById((int) $id);
        if ($repair === null) {
            $this->error('Repair request not found.', 404);
        }

        if ($user['role'] !== 'admin' && $repair['user_id'] !== $user['id'] && $repair['technician_id'] !== $user['id']) {
            $this->error('Forbidden.', 403);
        }

        $this->success(['repair' => $repair]);
    }

    public function create(CreateRepairRequest $request): void
    {
        $user = $this->authorize();

        $data = $request->validated();
        $newRepairId = $this->repairService->createRepair([
            'user_id' => $user['id'],
            'device_type' => $request->get('device_type'),
            'brand' => $request->get('brand'),
            'problem_description' => $request->get('problem_description'),
            'estimated_price' => is_numeric($request->get('estimated_price')) ? (float) $request->get('estimated_price') : 0.00,
        ]);

        $repair = $this->repairService->getRepairById($newRepairId);
        $this->success(['repair' => $repair], 'Repair request created.', 201);
    }

    public function updateStatus(UpdateRepairStatusRequest $request, string $id): void
    {
        $this->authorize(['admin']);

        $status = $request->get('status');
        if (!$this->repairService->updateStatus((int) $id, $status)) {
            $this->error('Unable to update repair status.', 500);
        }

        $repair = $this->repairService->getRepairById((int) $id);
        $this->success(['repair' => $repair], 'Repair status updated.');
    }
}
