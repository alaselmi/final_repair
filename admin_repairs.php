<?php
require_once 'connexion.php';
$pdo = connexion();
$currentUser = null;
if (!empty($_SESSION['user_id'])) {
    $stmt = $pdo->prepare('SELECT id, name, email, role FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $currentUser = $stmt->fetch();
}

if (!$currentUser || $currentUser['role'] !== 'admin') {
    header('Location: account.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Repairs | Reactive Smartphone Repair</title>
    <link rel="stylesheet" href="first.css">
</head>
<body data-page="admin_repairs">
    <header>
        <div class="header-inner">
            <div>
                <h1>Repair Management</h1>
                <p>Manage repair requests, update statuses, and add technician notes.</p>
            </div>
            <div class="header-actions">
                <a href="admin.html" class="button-secondary">Back to admin</a>
                <a href="main.html" class="button-secondary">Back to home</a>
            </div>
        </div>
        <nav aria-label="Primary navigation">
            <ul class="nav-list">
                <li><a href="main.html">Home</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="account.html">Account</a></li>
                <li><a href="admin.html">Admin</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div id="repair-feedback"></div>
        <section class="features-grid">
            <article class="feature-card">
                <h3>Total Requests</h3>
                <p id="stats-total">--</p>
            </article>
            <article class="feature-card">
                <h3>Pending</h3>
                <p id="stats-pending">--</p>
            </article>
            <article class="feature-card">
                <h3>In Progress</h3>
                <p id="stats-in-progress">--</p>
            </article>
            <article class="feature-card">
                <h3>Completed</h3>
                <p id="stats-completed">--</p>
            </article>
        </section>

        <section id="repair-list" class="services-grid">
            <div class="summary-panel">
                <p>Loading repair requests...</p>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-links">
            <a href="main.html">Home</a>
            <a href="services.html">Services</a>
            <a href="account.html">Account</a>
            <a href="admin.html">Admin</a>
        </div>
        <p>Reactive Smartphone Repair · Admin repair workflow.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
