<?php
$title = 'Login';
$error = $error ?? null;
$email = $email ?? '';
?>
<style>
    .auth-card { max-width: 520px; margin: 0 auto; background: #ffffff; padding: 2rem; border-radius: 16px; box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08); }
    .auth-card h1 { margin-top: 0; }
    .auth-card p { margin: 0.75rem 0; color: #4b5563; }
    .auth-card a { color: #1d4ed8; text-decoration: none; }
    .auth-card form { display: grid; gap: 1rem; margin-top: 1.25rem; }
    .auth-card label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
    .auth-card input { width: 100%; padding: 0.9rem 1rem; border: 1px solid #d1d5db; border-radius: 12px; font-size: 1rem; }
    .auth-card button { width: 100%; padding: 0.95rem 1rem; background: #1d4ed8; color: #ffffff; border: none; border-radius: 12px; cursor: pointer; font-size: 1rem; }
    .auth-card .error { color: #b91c1c; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 12px; padding: 0.9rem 1rem; margin-bottom: 1rem; }
</style>
<div class="auth-card">
    <h1>Login</h1>
    <p>Enter your credentials to access the repair dashboard.</p>

    <?php if (!empty($error)): ?>
        <div class="error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div>
    <?php endif; ?>

    <form method="post" action="/auth/login">
        <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($csrf_token ?? '', ENT_QUOTES, 'UTF-8') ?>">

        <div>
            <label for="email">Email</label>
            <input type="email" id="email" name="email" value="<?= htmlspecialchars($email, ENT_QUOTES, 'UTF-8') ?>" required autocomplete="email">
        </div>

        <div>
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required autocomplete="current-password">
        </div>

        <button type="submit">Sign in</button>
    </form>
</div>
