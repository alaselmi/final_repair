<?php
require_once 'connexion.php';
$pdo = connexion();
$currentUser = null;
if (!empty($_SESSION['user_id'])) {
    $stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $currentUser = $stmt->fetch();
}

if (!$currentUser) {
    header('Location: account.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Repairs | Reactive Smartphone Repair</title>
    <link rel="stylesheet" href="first.css">
</head>
<body data-page="my_repairs">
    <header>
        <div class="header-inner">
            <div>
                <h1>My Repair Requests</h1>
                <p>Track your requests, view status updates, and rate completed repairs.</p>
            </div>
            <a href="submit_repair.php" class="header-action button-secondary">Submit New Repair</a>
        </div>
        <nav aria-label="Primary navigation">
            <ul class="nav-list">
                <li><a href="main.html">Home</a></li>
                <li><a href="services.html">Services</a></li>
                <li><a href="store.html">Store</a></li>
                <li><a href="account.html">Account</a></li>
                <li><a href="admin.html">Admin</a></li>
            </ul>
        </nav>
    </header>

    <main>
        <div id="repair-feedback"></div>
        <section id="repair-list" class="services-grid">
            <div class="summary-panel">
                <p>Loading your repair history...</p>
            </div>
        </section>
    </main>

    <footer>
        <div class="footer-links">
            <a href="main.html">Home</a>
            <a href="services.html">Services</a>
            <a href="store.html">Store</a>
            <a href="account.html">Account</a>
            <a href="admin.html">Admin</a>
        </div>
        <p>Reactive Smartphone Repair · Track your repair history.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
