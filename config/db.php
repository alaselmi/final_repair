<?php
// Database connection helper for the repair management system.
// Uses PDO with secure defaults and UTF-8 charset.

$env = parse_ini_file(__DIR__ . '/../.env', false, INI_SCANNER_TYPED) ?: [];
$dbHost = $env['DB_HOST'] ?? '127.0.0.1';
$dbName = $env['DB_NAME'] ?? 'repair_company';
$dbUser = $env['DB_USER'] ?? 'root';
$dbPass = $env['DB_PASS'] ?? '';
$dbPort = $env['DB_PORT'] ?? 3306;

function getConnection(): PDO
{
    global $dbHost, $dbName, $dbUser, $dbPass, $dbPort;

    $dsn = "mysql:host={$dbHost};port={$dbPort};dbname={$dbName};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    return new PDO($dsn, $dbUser, $dbPass, $options);
}
