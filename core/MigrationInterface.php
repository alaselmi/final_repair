<?php

namespace Core;

use PDO;

interface MigrationInterface
{
    public function up(PDO $pdo): void;

    public function down(PDO $pdo): void;
}
