<?php
/**
 * Root connection helper for the repair site.
 * This file exists for compatibility with scripts that expect a top-level connection entry point.
 */

require_once __DIR__ . '/api/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Get a PDO database connection.
 *
 * @return PDO
 */
function connexion(): PDO
{
    return getConnection();
}

/**
 * Send a JSON response with a standard structure.
 *
 * @param mixed $data
 * @param int $status
 * @return void
 */
function responseJson($data, int $status = 200): void
{
    jsonResponse($data, $status);
}

/**
 * Backward-compatible alias in case older scripts call the French spelling.
 */
function reponseJson($data, int $status = 200): void
{
    responseJson($data, $status);
}
