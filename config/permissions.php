<?php

return [
    'roles' => [
        'admin' => [
            'view-dashboard',
            'manage-repairs',
            'update-repair-status',
            'view-users',
        ],
        'technician' => [
            'view-repairs',
            'update-repair-status',
        ],
        'user' => [
            'create-repair',
            'view-own-repairs',
        ],
    ],
];
