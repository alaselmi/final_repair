<?php

// Shared API initialization.
// This file is responsible for loading the minimal dependencies required by the API layer.

require_once __DIR__ . '/../services/session.php';
require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../app/Services/AuthService.php';
require_once __DIR__ . '/../app/Models/UserModel.php';
require_once __DIR__ . '/../app/Models/RepairModel.php';

// Session initialization for API auth/session-based access.
ensureSessionStarted();
