<?php
require_once 'connexion.php';
require_once __DIR__ . '/services/csrf.php';
$pdo = connexion();
$currentUser = null;
if (!empty($_SESSION['user_id'])) {
    $stmt = $pdo->prepare('SELECT id, name, email FROM users WHERE id = :id');
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $currentUser = $stmt->fetch();
}

$errors = [];
$success = '';
$imagePath = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? null;
    if (!verifyCsrfToken($csrfToken)) {
        $errors[] = 'The form submission is invalid. Please refresh the page and try again.';
    } elseif (!$currentUser) {
        $errors[] = 'You must be logged in to submit a repair request.';
    } else {
        $deviceType = trim($_POST['device_type'] ?? '');
        $brand = trim($_POST['brand'] ?? '');
        $problemDescription = trim($_POST['problem_description'] ?? '');
        $estimatedPrice = trim($_POST['estimated_price'] ?? '0');

        if ($deviceType === '' || $brand === '' || $problemDescription === '') {
            $errors[] = 'Device type, brand, and problem description are required.';
        }

        if (!empty($_FILES['device_image']['name'])) {
            $uploadDir = __DIR__ . '/uploads/repair_images/';
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            $fileName = basename($_FILES['device_image']['name']);
            $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            if (!in_array($extension, $allowed, true)) {
                $errors[] = 'Image must be a JPG, PNG, or GIF file.';
            } else {
                $safeName = uniqid('repair_', true) . '.' . $extension;
                $targetPath = $uploadDir . $safeName;
                if (!move_uploaded_file($_FILES['device_image']['tmp_name'], $targetPath)) {
                    $errors[] = 'Image upload failed. Please try again.';
                } else {
                    $imagePath = 'uploads/repair_images/' . $safeName;
                }
            }
        }

        if (empty($errors)) {
            $stmt = $pdo->prepare('INSERT INTO repair_requests (user_id, device_type, brand, problem_description, image, estimated_price) VALUES (:user_id, :device_type, :brand, :problem_description, :image, :estimated_price)');
            $stmt->execute([
                'user_id' => $currentUser['id'],
                'device_type' => htmlspecialchars($deviceType, ENT_QUOTES, 'UTF-8'),
                'brand' => htmlspecialchars($brand, ENT_QUOTES, 'UTF-8'),
                'problem_description' => htmlspecialchars($problemDescription, ENT_QUOTES, 'UTF-8'),
                'image' => $imagePath,
                'estimated_price' => number_format((float) $estimatedPrice, 2, '.', ''),
            ]);
            $success = 'Your repair request has been submitted successfully. Our technician team will review it soon.';
        }
    }
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Submit Repair Request | Reactive Smartphone Repair</title>
    <link rel="stylesheet" href="first.css">
</head>
<body data-page="submit_repair">
    <header>
        <div class="header-inner">
            <div>
                <h1>Submit Repair Request</h1>
                <p>Tell us about your device issue and our team will begin processing your repair.</p>
            </div>
            <a href="account.html" class="header-action button-secondary">Account</a>
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
        <section class="book-form">
            <?php if ($success): ?>
                <div class="summary-panel">
                    <p><?= htmlspecialchars($success, ENT_QUOTES, 'UTF-8') ?></p>
                </div>
            <?php endif; ?>

            <?php if (!$currentUser): ?>
                <div class="summary-panel">
                    <p>Please <a href="account.html">log in</a> to submit a repair request.</p>
                </div>
            <?php else: ?>
                <?php if (!empty($errors)): ?>
                    <div class="summary-panel" style="background:#fee2e2;color:#b91c1c;">
                        <ul>
                            <?php foreach ($errors as $error): ?>
                                <li><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>

                <form method="post" enctype="multipart/form-data">
                    <label for="device_type">Device type</label>
                    <input id="device_type" name="device_type" type="text" placeholder="Smartphone, Tablet, Laptop" required />

                    <label for="brand">Brand</label>
                    <input id="brand" name="brand" type="text" placeholder="Apple, Samsung, Xiaomi" required />

                    <label for="problem_description">Problem description</label>
                    <textarea id="problem_description" name="problem_description" placeholder="Describe the issue in as much detail as possible" required></textarea>

                    <label for="estimated_price">Estimated price</label>
                    <input id="estimated_price" name="estimated_price" type="number" step="0.01" min="0" placeholder="0.00" />

                    <label for="device_image">Device image (optional)</label>
                    <input id="device_image" name="device_image" type="file" accept="image/*" />
                    <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(getCsrfToken(), ENT_QUOTES, 'UTF-8') ?>" />

                    <button type="submit" class="button full-width">Submit Repair Request</button>
                </form>
            <?php endif; ?>
        </section>
    </main>

    <footer>
        <div class="footer-links">
            <a href="main.html">Home</a>
            <a href="services.html">Services</a>
            <a href="account.html">Account</a>
            <a href="admin.html">Admin</a>
        </div>
        <p>Reactive Smartphone Repair · Repair management made simple.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
