<?php

namespace Core;

use PDO;

class Migrator
{
    private PDO $pdo;
    private string $table = 'migrations';
    private string $migrationsPath;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
        $this->migrationsPath = __DIR__ . '/../migrations';
        $this->ensureMigrationTableExists();
    }

    public function migrateUp(int $steps = 0): array
    {
        $pending = $this->getPendingMigrationFiles();
        if ($steps > 0) {
            $pending = array_slice($pending, 0, $steps);
        }

        $batch = $this->getNextBatch();
        $executed = [];

        foreach ($pending as $file) {
            $migration = $this->loadMigration($file);
            $migration->up($this->pdo);
            $this->recordMigration($file, $batch);
            $executed[] = $file;
        }

        return $executed;
    }

    public function migrateDown(int $steps = 1): array
    {
        $executed = $this->getExecutedMigrations();
        if (empty($executed)) {
            return [];
        }

        $toRollback = array_slice($executed, 0, $steps);
        $rolledBack = [];

        foreach ($toRollback as $migrationName) {
            $file = $this->migrationsPath . '/' . $migrationName;
            if (!file_exists($file)) {
                continue;
            }

            $migration = $this->loadMigration($file);
            $migration->down($this->pdo);
            $this->deleteMigrationRecord($migrationName);
            $rolledBack[] = $migrationName;
        }

        return $rolledBack;
    }

    private function ensureMigrationTableExists(): void
    {
        $this->pdo->exec(
            'CREATE TABLE IF NOT EXISTS `' . $this->table . '` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `migration` VARCHAR(255) NOT NULL UNIQUE,
                `batch` INT NOT NULL,
                `executed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
        );
    }

    private function getExecutedMigrations(): array
    {
        $stmt = $this->pdo->query('SELECT migration FROM `' . $this->table . '` ORDER BY id DESC');
        return $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];
    }

    private function getPendingMigrationFiles(): array
    {
        $all = glob($this->migrationsPath . '/*.php') ?: [];
        sort($all, SORT_STRING);

        $executed = $this->getExecutedMigrations();
        $files = [];

        foreach ($all as $path) {
            $name = basename($path);
            if (!in_array($name, $executed, true)) {
                $files[] = $name;
            }
        }

        return $files;
    }

    private function loadMigration(string $filename): MigrationInterface
    {
        $migration = require $this->migrationsPath . '/' . $filename;
        if (!$migration instanceof MigrationInterface) {
            throw new \RuntimeException("Migration file {$filename} must return an instance of MigrationInterface.");
        }

        return $migration;
    }

    private function recordMigration(string $filename, int $batch): void
    {
        $stmt = $this->pdo->prepare('INSERT INTO `' . $this->table . '` (`migration`, `batch`) VALUES (:migration, :batch)');
        $stmt->execute(['migration' => $filename, 'batch' => $batch]);
    }

    private function deleteMigrationRecord(string $filename): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM `' . $this->table . '` WHERE `migration` = :migration');
        $stmt->execute(['migration' => $filename]);
    }

    private function getNextBatch(): int
    {
        $stmt = $this->pdo->query('SELECT MAX(batch) AS last_batch FROM `' . $this->table . '`');
        $lastBatch = (int) $stmt->fetchColumn();
        return $lastBatch + 1;
    }
}
