<?php

namespace App\Controllers;

use App\Models\RepairModel;
use App\Models\UserModel;
use Core\Controller;

class AdminController extends Controller
{
    private UserModel $userModel;
    private RepairModel $repairModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->repairModel = new RepairModel();
    }

    public function dashboard(): void
    {
        $stats = [
            'totalUsers' => $this->userModel->countUsers(),
            'totalRepairs' => $this->repairModel->countRepairs(),
            'repairsByStatus' => $this->repairModel->countByStatus(),
        ];

        $this->view('admin/dashboard', $stats, 'layouts/admin');
    }
}
