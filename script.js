const storageKeys = {
    users: 'repairUsers',
    currentUser: 'repairCurrentUser',
    heroSettings: 'repairHeroSettings',
};

const page = document.body.dataset.page || 'main';
const apiBase = 'api';
const useServer = true;
const navLinks = document.querySelectorAll('nav a');

function setActiveNavLinks() {
    let normalizedPage = page;
    if (page === 'submit_repair' || page.startsWith('my_')) {
        normalizedPage = 'account';
    }
    if (page.startsWith('admin_')) {
        normalizedPage = 'admin';
    }

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const normalizedHref = href.replace(/\.(html|php)$/, '');
        const isActive = (normalizedPage === 'main' && normalizedHref === 'main') || normalizedHref === normalizedPage;
        link.classList.toggle('active', isActive);
    });
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
    });
    const text = await response.text();
    let payload = {};
    try {
        payload = text ? JSON.parse(text) : {};
    } catch (error) {
        throw new Error('Server returned invalid JSON.');
    }

    if (!response.ok) {
        throw new Error(payload.message || `Request failed with status ${response.status}`);
    }

    return payload;
}

async function sendApiRequest(endpoint, method = 'GET', data = null) {
    const url = `${apiBase}/${endpoint}`;
    const options = { method, headers: {} };
    if (csrfToken) {
        options.headers['X-CSRF-Token'] = csrfToken;
    }
    if (data) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }
    return fetchJson(url, options);
}

const serviceButtons = document.querySelectorAll('.service-card button.service-action');
const summaryService = document.getElementById('summary-service');
const summaryDetails = document.getElementById('summary-details');
const assistantResponse = document.getElementById('assistant-response');
const userIssueInput = document.getElementById('issue');
const issueForm = document.getElementById('issue-form');
const adminHeroTitle = document.getElementById('admin-hero-title');
const adminHeroDesc = document.getElementById('admin-hero-desc');
const heroTitle = document.getElementById('hero-title');
const heroDescription = document.getElementById('hero-description');
const updateHeroButton = document.getElementById('update-hero');
const authTabs = document.querySelectorAll('.auth-tab');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const signupName = document.getElementById('signup-name');
const signupEmail = document.getElementById('signup-email');
const signupPassword = document.getElementById('signup-password');
const loginButton = document.getElementById('login-button');
const signupButton = document.getElementById('signup-button');
const logoutButton = document.getElementById('logout-button');
const dashboardGreeting = document.getElementById('dashboard-greeting');
const dashboardEmail = document.getElementById('dashboard-email');
const dashboardStatusMessage = document.getElementById('dashboard-status-message');
const accountModel = document.getElementById('account-model');
const accountService = document.getElementById('account-service');
const accountDate = document.getElementById('account-date');
const accountBookButton = document.getElementById('account-book-button');
const accountBookings = document.getElementById('account-bookings');
const accountRepairSummary = document.getElementById('account-repair-summary');
const accountRepairSummaryIntro = document.getElementById('account-repair-summary-intro');
const clientBookingsList = document.getElementById('client-bookings');
const clientSummaryActive = document.getElementById('client-summary-active');
const accountAuthCard = document.getElementById('account-auth-card');
const accountDashboard = document.getElementById('account-dashboard');
const adminNavLinks = document.querySelectorAll('a[href="#admin"], a[href="admin.html"]');
const adminSection = document.getElementById('admin');
const adminAccessMessage = document.getElementById('admin-access-message');
const adminControls = document.getElementById('admin-controls');
const bookingForm = document.getElementById('booking-form');
const bookingDate = document.getElementById('booking-date');
const repairFeedback = document.getElementById('repair-feedback');
const repairList = document.getElementById('repair-list');
const statsTotal = document.getElementById('stats-total');
const statsPending = document.getElementById('stats-pending');
const statsInProgress = document.getElementById('stats-in-progress');
const statsCompleted = document.getElementById('stats-completed');
const mainRepairSummaryIntro = document.getElementById('main-repair-summary-intro');
const mainRepairSummary = document.getElementById('main-repair-summary');

let users = [];
let currentUser = null;
let csrfToken = null;

const serviceInfo = {
    'Screen Repair': 'We replace cracked or unresponsive screens with premium glass. Typical turnaround: 1-2 business days.',
    'Battery Replacement': 'Fast battery swaps with genuine or high-quality compatible cells. Same-day service available.',
    'Water Damage': 'Deep drying, corrosion cleaning, and diagnostic recovery to bring your phone back alive.',
    'Camera Fix': 'Front and rear camera repairs, lens replacement, and image stabilization checks.',
    'Software Support': 'Speed-ups, OS updates, malware cleanup, and backup restoration for smooth performance.',
};

const serviceEstimates = {
    'Screen Repair': { price: '$129.00', duration: '2-3 days' },
    'Battery Replacement': { price: '$89.00', duration: '1-2 days' },
    'Water Damage': { price: '$149.00', duration: '3-5 days' },
    'Camera Fix': { price: '$119.00', duration: '2-4 days' },
    'Software Support': { price: '$69.00', duration: 'same day' },
};

let heroSettings = {
    title: '',
    description: '',
};

function loadUsers() {
    if (useServer) {
        users = [];
        return;
    }

    try {
        const stored = window.localStorage.getItem(storageKeys.users);
        users = stored ? JSON.parse(stored) : [];
    } catch (error) {
        users = [];
    }

    if (!users.some(user => user.role === 'admin')) {
        users.unshift({
            name: 'Site Admin',
            email: 'admin@repair.com',
            password: 'admin123',
            role: 'admin',
            bookings: [],
        });
        saveUsers();
    }
}

function saveUsers() {
    window.localStorage.setItem(storageKeys.users, JSON.stringify(users));
}

async function loadCurrentUser() {
    if (!useServer) {
        try {
            const email = window.localStorage.getItem(storageKeys.currentUser);
            currentUser = email ? users.find(user => user.email === email) || null : null;
        } catch (error) {
            currentUser = null;
        }
        return;
    }

    try {
        const user = await sendApiRequest('auth.php?action=current');
        currentUser = user || null;
        csrfToken = currentUser?.csrf_token || null;
    } catch (error) {
        currentUser = null;
        csrfToken = null;
    }
}

function saveCurrentUser() {
    if (useServer) {
        return;
    }

    if (currentUser) {
        window.localStorage.setItem(storageKeys.currentUser, currentUser.email);
    } else {
        window.localStorage.removeItem(storageKeys.currentUser);
    }
}


async function loadHeroSettings() {
    if (!useServer) {
        try {
            const stored = window.localStorage.getItem(storageKeys.heroSettings);
            heroSettings = stored ? JSON.parse(stored) : { title: '', description: '' };
        } catch (error) {
            heroSettings = { title: '', description: '' };
        }
        return;
    }

    try {
        heroSettings = await sendApiRequest('hero.php');
    } catch (error) {
        heroSettings = { title: '', description: '' };
    }
}

function saveHeroSettings() {
    if (useServer) {
        return;
    }
    window.localStorage.setItem(storageKeys.heroSettings, JSON.stringify(heroSettings));
}

function setCurrentUser(user) {
    currentUser = user;
    csrfToken = currentUser?.csrf_token || null;
    saveCurrentUser();
    renderAccountState();
}

function renderBookings() {
    const bookings = currentUser?.bookings || [];

    if (accountBookings) {
        accountBookings.innerHTML = bookings.length
            ? bookings.map(booking => {
                return `
                    <div class="booking-item">
                        <h5>${booking.service} — ${booking.model}</h5>
                        <p><strong>Date:</strong> ${booking.date}</p>
                        <p><strong>Estimated price:</strong> ${booking.price}</p>
                        <p><strong>Estimated duration:</strong> ${booking.duration}</p>
                        <p>${booking.notes}</p>
                    </div>
                `;
            }).join('')
            : '<p>No bookings yet.</p>';
    }

    if (dashboardStatusMessage) {
        dashboardStatusMessage.textContent = bookings.length
            ? `Latest booking for ${bookings[bookings.length - 1].model} is currently ${bookings[bookings.length - 1].status}.`
            : 'No bookings yet. Schedule a repair to track your phone.';
    }
}

function isAdmin() {
    return currentUser && currentUser.role === 'admin';
}

function renderAccountState() {
    const adminVisible = isAdmin();

    if (accountAuthCard) accountAuthCard.classList.toggle('hidden', Boolean(currentUser));
    if (accountDashboard) accountDashboard.classList.toggle('hidden', !currentUser);

    if (adminSection) {
        if (page === 'admin') {
            if (adminAccessMessage) adminAccessMessage.classList.toggle('hidden', adminVisible);
            if (adminControls) adminControls.classList.toggle('hidden', !adminVisible);
        } else {
            adminSection.classList.toggle('hidden', !adminVisible);
        }
    }

    if (adminNavLinks.length) {
        adminNavLinks.forEach(link => {
            const adminItem = link.closest('li');
            if (adminItem) adminItem.classList.toggle('hidden', !adminVisible);
        });
    }

    if (currentUser) {
        if (dashboardGreeting) dashboardGreeting.textContent = `Hi, ${currentUser.name}`;
        if (dashboardEmail) dashboardEmail.textContent = currentUser.email;
        renderBookings();
        renderClientBookings();
        if (page === 'account') {
            loadAccountRepairSummary();
        }
    }
}

async function loadAccountRepairSummary() {
    if (!accountRepairSummary) return;
    if (!currentUser) {
        accountRepairSummary.innerHTML = '<p>Sign in to manage and track your repair requests.</p>';
        if (accountRepairSummaryIntro) accountRepairSummaryIntro.textContent = 'Repair status updates appear here after you sign in.';
        return;
    }

    if (!useServer) {
        accountRepairSummary.innerHTML = '<p>Repair tracking is available when connected to the server.</p>';
        if (accountRepairSummaryIntro) accountRepairSummaryIntro.textContent = 'Repair request details require server mode.';
        return;
    }

    try {
        const repairs = await sendApiRequest('repair_requests.php');
        const active = repairs.filter(r => r.status !== 'Completed');
        const completed = repairs.filter(r => r.status === 'Completed');

        if (accountRepairSummaryIntro) {
            accountRepairSummaryIntro.textContent = active.length
                ? `You have ${active.length} active request${active.length === 1 ? '' : 's'}.`
                : 'No active requests at the moment. View completed repairs or submit a new request.';
        }

        accountRepairSummary.innerHTML = active.length
            ? active.slice(0, 2).map(repair => `
                <div class="summary-panel">
                    <p><strong>${escapeHtml(repair.device_type)} ${escapeHtml(repair.brand)}</strong></p>
                    <p>Status: ${escapeHtml(repair.status)}</p>
                    <p>${escapeHtml(repair.problem_description)}</p>
                </div>
            `).join('')
            : '<div class="summary-panel"><p>No active repair requests found.</p><a href="submit_repair.php" class="button-secondary">Submit a repair</a></div>';

        if (completed.length && repairs.length > 2) {
            accountRepairSummary.innerHTML += '<div class="summary-panel"><p>See your full repair history in the dashboard.</p><a href="my_repairs.php" class="button-secondary">View all repairs</a></div>';
        }
    } catch (error) {
        accountRepairSummary.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
        if (accountRepairSummaryIntro) accountRepairSummaryIntro.textContent = 'Unable to load repair details right now.';
    }
}

function renderClientBookings() {
    if (!clientBookingsList) return;
    if (!currentUser || !currentUser.bookings?.length) {
        clientBookingsList.innerHTML = '<p>No repair orders yet. Book your first repair from your account page.</p>';
        if (clientSummaryActive) clientSummaryActive.textContent = '0 active repairs';
        return;
    }

    const activeBookings = currentUser.bookings.filter(booking => booking.status !== 'Completed');
    if (clientSummaryActive) clientSummaryActive.textContent = `${activeBookings.length} active repair${activeBookings.length === 1 ? '' : 's'}`;

    clientBookingsList.innerHTML = currentUser.bookings.map(booking => {
        return `
            <article class="repair-card">
                <div class="repair-card-header">
                    <div>
                        <h4>${escapeHtml(booking.model)}</h4>
                        <p>${escapeHtml(booking.service)}</p>
                    </div>
                    <span class="status-chip ${booking.status.replace(/\s+/g, '-').toLowerCase()}">${escapeHtml(booking.status)}</span>
                </div>
                <div class="repair-card-body">
                    <p><strong>Preferred date:</strong> ${escapeHtml(booking.date)}</p>
                    <p><strong>Estimated time:</strong> ${escapeHtml(booking.duration)}</p>
                    <p><strong>Estimate:</strong> ${escapeHtml(booking.price)}</p>
                    <p>${escapeHtml(booking.notes)}</p>
                </div>
            </article>
        `;
    }).join('');
}

async function loadMyRepairs() {
    if (!repairList) return;
    try {
        const repairs = await sendApiRequest('repair_requests.php');
        if (!repairs.length) {
            repairList.innerHTML = '<div class="summary-panel"><p>You have no repair requests yet. Submit a repair from your account page.</p></div>';
            return;
        }
        repairList.innerHTML = repairs.map(renderUserRepairCard).join('');
    } catch (error) {
        repairList.innerHTML = `<div class="summary-panel"><p>${escapeHtml(error.message)}</p></div>`;
    }
}

async function loadMainRepairSummary() {
    if (!mainRepairSummary) return;

    if (!currentUser) {
        mainRepairSummary.innerHTML = '<article class="feature-card"><p>Sign in to see your active repair requests and track progress from the dashboard.</p><a href="account.html" class="button-secondary">Sign in</a></article>';
        if (mainRepairSummaryIntro) mainRepairSummaryIntro.textContent = 'Sign in to see active repair requests and track completion status.';
        return;
    }

    if (!useServer) {
        mainRepairSummary.innerHTML = '<article class="feature-card"><p>Repair tracking is available when connected to the server.</p></article>';
        if (mainRepairSummaryIntro) mainRepairSummaryIntro.textContent = 'Repair summaries are only shown in server mode.';
        return;
    }

    try {
        const repairs = await sendApiRequest('repair_requests.php');
        const activeRepairs = repairs.filter(r => r.status !== 'Completed');

        if (!repairs.length) {
            mainRepairSummary.innerHTML = '<article class="feature-card"><p>You have no repair requests yet. Start a new request from your repair dashboard.</p><a href="submit_repair.php" class="button-secondary">Submit a repair</a></article>';
            if (mainRepairSummaryIntro) mainRepairSummaryIntro.textContent = 'You have no repair requests yet.';
            return;
        }

        mainRepairSummaryIntro.textContent = activeRepairs.length
            ? `You have ${activeRepairs.length} active request${activeRepairs.length === 1 ? '' : 's'} in progress.`
            : 'All repairs are complete. View your completed jobs in the dashboard.';

        mainRepairSummary.innerHTML = activeRepairs.length
            ? activeRepairs.slice(0, 3).map(repair => `
                <article class="feature-card">
                    <h3>${escapeHtml(repair.device_type)} — ${escapeHtml(repair.brand)}</h3>
                    <p><strong>Status:</strong> ${escapeHtml(repair.status)}</p>
                    <p><strong>Requested:</strong> ${escapeHtml(repair.created_at)}</p>
                    <p>${escapeHtml(repair.problem_description)}</p>
                    <a href="my_repairs.php" class="button-secondary">View details</a>
                </article>
            `).join('')
            : '<article class="feature-card"><p>All repairs are complete. Thank you for choosing us.</p><a href="my_repairs.php" class="button-secondary">View completed repairs</a></article>';
    } catch (error) {
        mainRepairSummary.innerHTML = `<article class="feature-card"><p>${escapeHtml(error.message)}</p></article>`;
        if (mainRepairSummaryIntro) mainRepairSummaryIntro.textContent = 'Repair summary loading failed.';
    }
}

function renderUserRepairCard(repair) {
    const ratingSection = repair.status === 'Completed' && !repair.rating
        ? `
            <form class="repair-rating-form" data-repair-id="${repair.id}">
                <h4>Rate this repair</h4>
                <label for="rating_${repair.id}">Rating</label>
                <select id="rating_${repair.id}" name="rating">
                    <option value="0">Choose</option>
                    <option value="1">1 star</option>
                    <option value="2">2 stars</option>
                    <option value="3">3 stars</option>
                    <option value="4">4 stars</option>
                    <option value="5">5 stars</option>
                </select>
                <label for="comment_${repair.id}">Comment</label>
                <textarea id="comment_${repair.id}" name="comment" placeholder="Tell us how the repair went."></textarea>
                <button type="submit" class="button full-width">Submit rating</button>
            </form>
        `
        : repair.rating
            ? `<div class="summary-panel" style="background:#f0fdf4;color:#166534;"><p><strong>Your rating:</strong> ${escapeHtml(repair.rating.rating)} / 5</p><p>${escapeHtml(repair.rating.comment)}</p></div>`
            : '';

    return `
        <article class="feature-card">
            <h3>${escapeHtml(repair.device_type)} — ${escapeHtml(repair.brand)}</h3>
            <p><strong>Status:</strong> ${escapeHtml(repair.status)}</p>
            <p><strong>Estimated price:</strong> $${Number(repair.estimated_price).toFixed(2)}</p>
            <p><strong>Requested on:</strong> ${escapeHtml(repair.created_at)}</p>
            <p>${escapeHtml(repair.problem_description)}</p>
            ${repair.image ? `<img src="${escapeHtml(repair.image)}" alt="Repair image" />` : ''}
            ${ratingSection}
        </article>
    `;
}

async function submitRepairRating(repairId, rating, comment) {
    try {
        await sendApiRequest('repair_requests.php?action=rate', 'POST', {
            repair_id: repairId,
            rating,
            comment,
        });
        if (repairFeedback) {
            repairFeedback.innerHTML = '<div class="summary-panel">Thank you for your rating. Your feedback has been submitted.</div>';
        }
        await loadMyRepairs();
    } catch (error) {
        if (repairFeedback) {
            repairFeedback.innerHTML = `<div class="summary-panel" style="background:#fee2e2;color:#b91c1c;"><p>${escapeHtml(error.message)}</p></div>`;
        }
    }
}

async function loadAdminRepairs() {
    if (!repairList) return;
    try {
        const stats = await sendApiRequest('repair_requests.php?stats=1');
        statsTotal.textContent = stats.total_repairs || '0';
        statsPending.textContent = stats.pending_repairs || '0';
        statsInProgress.textContent = stats.in_progress_repairs || '0';
        statsCompleted.textContent = stats.completed_repairs || '0';
    } catch (error) {
        if (repairFeedback) {
            repairFeedback.innerHTML = `<div class="summary-panel" style="background:#fee2e2;color:#b91c1c;"><p>${escapeHtml(error.message)}</p></div>`;
        }
    }

    try {
        const repairs = await sendApiRequest('repair_requests.php');
        if (!repairs.length) {
            repairList.innerHTML = '<div class="summary-panel"><p>No repair requests found.</p></div>';
            return;
        }
        repairList.innerHTML = repairs.map(renderAdminRepairCard).join('');
    } catch (error) {
        repairList.innerHTML = `<div class="summary-panel"><p>${escapeHtml(error.message)}</p></div>`;
    }
}

function renderAdminRepairCard(repair) {
    const updates = Array.isArray(repair.updates) && repair.updates.length
        ? repair.updates.map(update => `
            <p><strong>${escapeHtml(update.status || 'Update')}:</strong> ${escapeHtml(update.message)}<br><small>${escapeHtml(update.created_at)}</small></p>
        `).join('')
        : '<p>No updates yet.</p>';

    return `
        <article class="feature-card">
            <h3>#${repair.id} — ${escapeHtml(repair.device_type)} / ${escapeHtml(repair.brand)}</h3>
            <p><strong>Customer:</strong> ${escapeHtml(repair.customer_name)} (${escapeHtml(repair.customer_email)})</p>
            <p><strong>Status:</strong> ${escapeHtml(repair.status)}</p>
            <p><strong>Price:</strong> $${Number(repair.estimated_price).toFixed(2)}</p>
            <p><strong>Requested:</strong> ${escapeHtml(repair.created_at)}</p>
            <p>${escapeHtml(repair.problem_description)}</p>
            ${repair.image ? `<img src="${escapeHtml(repair.image)}" alt="Device image" />` : ''}
            <div class="summary-panel" style="background:#f8fafc;">
                <h4>Technician notes</h4>
                ${updates}
            </div>
            <form class="admin-repair-update-form" data-repair-id="${repair.id}">
                <label for="status_${repair.id}">Status</label>
                <select id="status_${repair.id}" name="status">
                    <option value="Pending" ${repair.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="In Progress" ${repair.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Completed" ${repair.status === 'Completed' ? 'selected' : ''}>Completed</option>
                </select>

                <label for="estimated_price_${repair.id}">Estimated price</label>
                <input id="estimated_price_${repair.id}" name="estimated_price" type="number" step="0.01" min="0" value="${Number(repair.estimated_price).toFixed(2)}" />

                <label for="note_${repair.id}">Technician note</label>
                <textarea id="note_${repair.id}" name="message" placeholder="Add a short update or note."></textarea>
                <button type="submit" class="button full-width">Save update</button>
            </form>
        </article>
    `;
}

async function submitAdminRepairUpdate(form) {
    const repairId = Number(form.dataset.repairId);
    const status = form.querySelector('[name="status"]').value;
    const estimatedPrice = form.querySelector('[name="estimated_price"]').value;
    const message = form.querySelector('[name="message"]').value.trim();

    try {
        await sendApiRequest('repair_requests.php', 'PATCH', {
            repair_id: repairId,
            status,
            estimated_price: Number(estimatedPrice).toFixed(2),
            message,
        });
        if (repairFeedback) {
            repairFeedback.innerHTML = '<div class="summary-panel">Repair request updated successfully.</div>';
        }
        await loadAdminRepairs();
    } catch (error) {
        if (repairFeedback) {
            repairFeedback.innerHTML = `<div class="summary-panel" style="background:#fee2e2;color:#b91c1c;"><p>${escapeHtml(error.message)}</p></div>`;
        }
    }
}

function attachRepairListHandlers() {
    if (!repairList) return;

    repairList.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.target.closest('form');
        if (!form) return;

        if (form.classList.contains('repair-rating-form')) {
            const repairId = Number(form.dataset.repairId);
            const rating = Number(form.rating.value);
            const comment = form.comment.value.trim();
            await submitRepairRating(repairId, rating, comment);
        }

        if (form.classList.contains('admin-repair-update-form')) {
            await submitAdminRepairUpdate(form);
        }
    });
}

function setActiveAuthPanel(panelId) {
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.panel === panelId);
        const panel = document.getElementById(tab.dataset.panel);
        panel.classList.toggle('hidden', tab.dataset.panel !== panelId);
    });
}

async function signupUser() {
    const name = signupName.value.trim();
    const email = signupEmail.value.trim().toLowerCase();
    const password = signupPassword.value.trim();

    if (!name || !email || !password) {
        alert('Please complete all signup fields.');
        return;
    }

    if (useServer) {
        try {
            await sendApiRequest('auth.php?action=register', 'POST', { name, email, password });
            await loadCurrentUser();
            setCurrentUser(currentUser);
            signupName.value = '';
            signupEmail.value = '';
            signupPassword.value = '';
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    if (users.some(user => user.email === email)) {
        alert('A user with that email already exists. Please log in instead.');
        return;
    }

    const user = {
        name,
        email,
        password,
        role: 'customer',
        bookings: [],
    };
    users.push(user);
    saveUsers();
    setCurrentUser(user);
    signupName.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}

async function loginUser() {
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value.trim();

    if (!email || !password) {
        alert('Login failed: please enter both email and password.');
        return;
    }

    if (useServer) {
        try {
            await sendApiRequest('auth.php?action=login', 'POST', { email, password });
            await loadCurrentUser();
            setCurrentUser(currentUser);
            loginEmail.value = '';
            loginPassword.value = '';
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        alert('Login failed: invalid email or password.');
        return;
    }

    setCurrentUser(user);
    loginEmail.value = '';
    loginPassword.value = '';
}

async function logoutUser() {
    if (useServer) {
        try {
            await sendApiRequest('auth.php?action=logout', 'POST');
        } catch (error) {
            console.warn('Logout error:', error.message);
        }
    }

    currentUser = null;
    csrfToken = null;
    saveCurrentUser();
    renderAccountState();
}

async function bookRepair(data = {}) {
    if (!currentUser) {
        alert('Please log in to book a repair.');
        return;
    }

    const model = data.model || accountModel.value.trim();
    const service = data.service || accountService.value;
    const date = data.date || accountDate.value;
    const details = data.details || `Booked through account dashboard.`;

    if (!model || !date) {
        alert('Please enter your phone model and preferred date.');
        return;
    }

    const estimate = serviceEstimates[service] || { price: '$0.00', duration: 'TBD' };
    const bookingData = {
        model,
        service,
        date,
        details,
        price: estimate.price,
        duration: estimate.duration,
    };

    if (useServer) {
        try {
            await sendApiRequest('bookings.php', 'POST', bookingData);
            await loadCurrentUser();
            renderAccountState();
            renderClientBookings();
            accountModel.value = '';
            accountDate.value = '';
            if (data.clearForm !== false) {
                bookingForm?.reset();
            }
            alert('Repair booked! You can track the status on your dashboard.');
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    const booking = {
        id: Date.now(),
        model,
        service,
        date,
        notes: details,
        status: 'Scheduled',
        price: estimate.price,
        duration: estimate.duration,
    };

    currentUser.bookings = currentUser.bookings || [];
    currentUser.bookings.push(booking);
    saveUsers();
    renderBookings();
    accountModel.value = '';
    accountDate.value = '';

    if (data.clearForm !== false) {
        bookingForm?.reset();
    }

    alert('Repair booked! You can track the status on your dashboard.');
}

function advanceBookingStatuses() {
    users.forEach(user => {
        user.bookings.forEach(booking => {
            if (booking.status === 'Scheduled') booking.status = 'In repair';
            else if (booking.status === 'In repair') booking.status = 'Ready for pickup';
            else if (booking.status === 'Ready for pickup') booking.status = 'Completed';
        });
    });
    saveUsers();
}

if (!useServer) {
    setInterval(() => {
        if (users.length) {
            advanceBookingStatuses();
            if (currentUser) renderBookings();
        }
    }, 60000);
}

function updateSummary(service) {
    if (summaryService) summaryService.textContent = service;
    if (summaryDetails) summaryDetails.textContent = serviceInfo[service] || 'Select a service to see details and estimated response time.';
}

function selectService(event) {
    const card = event.currentTarget.closest('.service-card');
    const serviceName = card.querySelector('h3').textContent;
    updateSummary(serviceName);
    document.querySelectorAll('.service-card').forEach(node => node.classList.remove('active'));
    card.classList.add('active');
}

if (serviceButtons.length) {
    serviceButtons.forEach(button => button.addEventListener('click', selectService));
}

if (issueForm) {
    issueForm.addEventListener('submit', event => {
        event.preventDefault();
        const issue = userIssueInput?.value.trim() || '';
        if (!issue) {
            if (assistantResponse) {
                assistantResponse.textContent = 'Tell me the issue in a few words so I can suggest the best service.';
            }
            return;
        }

        const lower = issue.toLowerCase();
        let recommendation = 'For best results, choose the service that matches your issue below.';
        if (lower.includes('screen') || lower.includes('glass') || lower.includes('crack')) {
            recommendation = 'It sounds like a screen issue. A Screen Repair will usually help faster than a full diagnostic.';
            updateSummary('Screen Repair');
        } else if (lower.includes('battery') || lower.includes('power') || lower.includes('charge')) {
            recommendation = 'This is likely a battery problem. We recommend Battery Replacement for quick recovery.';
            updateSummary('Battery Replacement');
        } else if (lower.includes('water') || lower.includes('liquid') || lower.includes('wet')) {
            recommendation = 'Water exposure is serious. Choose Water Damage and bring the device in as soon as possible.';
            updateSummary('Water Damage');
        } else if (lower.includes('camera') || lower.includes('photo') || lower.includes('lens')) {
            recommendation = 'Camera performance problems are best handled by our Camera Fix specialists.';
            updateSummary('Camera Fix');
        } else {
            updateSummary('Software Support');
        }
        if (assistantResponse) assistantResponse.textContent = recommendation;
    });
}

async function updateHeroSection() {
    const title = adminHeroTitle?.value.trim() || '';
    const desc = adminHeroDesc?.value.trim() || '';
    if (!title || !desc) {
        alert('Please provide both a hero title and description.');
        return;
    }

    if (heroTitle) heroTitle.textContent = title;
    if (heroDescription) heroDescription.textContent = desc;
    heroSettings.title = title;
    heroSettings.description = desc;

    if (useServer) {
        try {
            await sendApiRequest('hero.php', 'POST', { title, description: desc });
            return;
        } catch (error) {
            alert(error.message);
            return;
        }
    }

    saveHeroSettings();
}

if (updateHeroButton) updateHeroButton.addEventListener('click', updateHeroSection);

if (authTabs.length) {
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => setActiveAuthPanel(tab.dataset.panel));
    });
}

if (loginButton) loginButton.addEventListener('click', loginUser);
if (signupButton) signupButton.addEventListener('click', signupUser);
if (logoutButton) logoutButton.addEventListener('click', logoutUser);
if (accountBookButton) accountBookButton.addEventListener('click', () => bookRepair({ clearForm: false }));
if (bookingForm) {
    bookingForm.addEventListener('submit', event => {
        event.preventDefault();
        bookRepair({
            model: document.getElementById('model')?.value.trim(),
            service: document.getElementById('service-select')?.value,
            date: bookingDate?.value,
            details: document.getElementById('details')?.value.trim(),
        });
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    if (!useServer) {
        loadUsers();
    }

    await loadCurrentUser();
    await loadHeroSettings();
    if (heroSettings.title && heroTitle) heroTitle.textContent = heroSettings.title;
    if (heroSettings.description && heroDescription) heroDescription.textContent = heroSettings.description;
    renderAccountState();
    setActiveNavLinks();
    updateSummary('Screen Repair');
    if (adminHeroTitle) adminHeroTitle.value = heroTitle?.textContent || heroSettings.title;
    if (adminHeroDesc) adminHeroDesc.value = heroDescription?.textContent || heroSettings.description;
    if (authTabs.length) setActiveAuthPanel('login-panel');

    attachRepairListHandlers();
    if (page === 'main') {
        await loadMainRepairSummary();
    }
    if (page === 'account') {
        await loadAccountRepairSummary();
    }
    if (page === 'my_repairs') {
        await loadMyRepairs();
    }
    if (page === 'admin_repairs') {
        await loadAdminRepairs();
    }
});
