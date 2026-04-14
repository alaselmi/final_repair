<?php
$title = 'Admin Dashboard';
?>
<style>
    .hero { margin-bottom: 1.5rem; }
    .hero h1 { margin: 0 0 0.5rem; font-size: 2rem; }
    .hero p { margin: 0; color: #4b5563; }
    .stats-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 1.5rem; }
    .card { background: #ffffff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); }
    .card h2 { margin: 0 0 0.75rem; font-size: 1rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; }
    .card p { margin: 0; font-size: 2rem; color: #111827; }
    .chart-section { background: #ffffff; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); }
    .chart-section h3 { margin-top: 0; }
    .status-list { display: grid; gap: 0.75rem; margin-top: 1rem; }
    .status-item { display: flex; justify-content: space-between; padding: 0.9rem 1rem; background: #f9fafb; border-radius: 12px; }
    .status-item strong { color: #111827; }
    .status-label { color: #6b7280; }
</style>
<section class="hero">
    <h1>Admin Dashboard</h1>
    <p>Overview of users and repairs from the new MVC data layer.</p>
</section>

<section class="stats-grid">
    <div class="card">
        <h2>Total users</h2>
        <p><?= htmlspecialchars($totalUsers ?? 0, ENT_QUOTES, 'UTF-8') ?></p>
    </div>
    <div class="card">
        <h2>Total repairs</h2>
        <p><?= htmlspecialchars($totalRepairs ?? 0, ENT_QUOTES, 'UTF-8') ?></p>
    </div>
</section>

<section class="chart-section">
    <h3>Repair status breakdown</h3>
    <div class="status-list">
        <div class="status-item">
            <span class="status-label">Pending</span>
            <strong><?= htmlspecialchars($repairsByStatus['pending'] ?? 0, ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
        <div class="status-item">
            <span class="status-label">In Progress</span>
            <strong><?= htmlspecialchars($repairsByStatus['in_progress'] ?? 0, ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
        <div class="status-item">
            <span class="status-label">Ready</span>
            <strong><?= htmlspecialchars($repairsByStatus['ready'] ?? 0, ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
        <div class="status-item">
            <span class="status-label">Delivered</span>
            <strong><?= htmlspecialchars($repairsByStatus['delivered'] ?? 0, ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
        <div class="status-item">
            <span class="status-label">Completed</span>
            <strong><?= htmlspecialchars($repairsByStatus['completed'] ?? 0, ENT_QUOTES, 'UTF-8') ?></strong>
        </div>
    </div>
</section>
