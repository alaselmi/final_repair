<?php
if (!isset($title)) {
    $title = 'Application';
}
if (!isset($content)) {
    $content = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($title, ENT_QUOTES, 'UTF-8') ?></title>
    <style>
        body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f3f4f6; color: #111827; }
        .container { width: min(1080px, calc(100% - 3rem)); margin: 0 auto; }
        .site-header, .site-footer { background: #ffffff; }
        .site-header { padding: 1rem 0; box-shadow: 0 1px 6px rgba(15, 23, 42, 0.08); }
        .site-logo { font-weight: 700; color: #111827; text-decoration: none; }
        .site-nav a { color: #374151; text-decoration: none; margin-left: 1rem; }
        .site-nav a:hover { color: #111827; }
        main.page-content { padding: 2rem 0; }
        .site-footer { padding: 1rem 0; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <?php require __DIR__ . '/../partials/header.php'; ?>
    <main class="page-content">
        <div class="container">
            <?= $content ?>
        </div>
    </main>
    <?php require __DIR__ . '/../partials/footer.php'; ?>
</body>
</html>
