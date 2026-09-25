/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Main Application Framework & Formatters
 * 
 * Reusable formatting utilities, layout orchestration, sidebar navigation,
 * multi-stakeholder role switcher, floating AI Copilot, live AI audit trigger,
 * forensic modal inspector, and backend live synchronization.
 * ==============================================================================
 */

// Global Formatting Utilities
window.MPLADS_FORMATTERS = {
    formatCurrency: function (val, unit = 'auto') {
        if (val === null || val === undefined || isNaN(val)) return '₹0.00';
        if (unit === 'Cr') {
            return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
        }
        if (unit === 'Lakhs') {
            return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
        }
        if (unit === 'auto') {
            if (val >= 100) {
                return `₹${(val / 100).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
            }
            return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} L`;
        }
        return `₹${Number(val).toLocaleString('en-IN')}`;
    },

    formatNumber: function (val) {
        if (val === null || val === undefined || isNaN(val)) return '0';
        return Number(val).toLocaleString('en-IN');
    },

    formatPercentage: function (val, decimals = 1) {
        if (val === null || val === undefined || isNaN(val)) return '0.0%';
        return `${Number(val).toFixed(decimals)}%`;
    },

    formatDate: function (dateStr) {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return dateStr;
            return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateStr;
        }
    }
};

// Universal Toast Notification System - Available globally
window.showMpladsToast = function (msg, type = 'success') {
    let toast = document.getElementById('mpladsGlobalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mpladsGlobalToast';
        document.body.appendChild(toast);
    }
    const colors = {
        success: { bg: '#064e3b', border: '#10b981', icon: '✅' },
        info: { bg: '#0c4a6e', border: '#0284c7', icon: 'ℹ️' },
        warning: { bg: '#78350f', border: '#f59e0b', icon: '⚠️' },
        danger: { bg: '#7f1d1d', border: '#ef4444', icon: '❌' }
    };
    const c = colors[type] || colors.success;
    toast.style.cssText = `position:fixed;top:20px;right:20px;background:${c.bg};color:#ffffff;padding:12px 18px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.35);z-index:999999;font-size:0.86rem;display:flex;align-items:center;gap:10px;border-left:4px solid ${c.border};transition:all 0.25s cubic-bezier(0.16,1,0.3,1);transform:translateY(0);opacity:1;max-width:420px;line-height:1.45;`;
    toast.innerHTML = `<span style="font-size:1.1rem;flex-shrink:0;">${c.icon}</span> <span style="font-weight:600;">${msg}</span>`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.transform = 'translateY(-15px)';
        toast.style.opacity = '0';
        setTimeout(() => { if (toast.style.opacity === '0') toast.style.display = 'none'; }, 260);
    }, 3800);
    toast.style.display = 'flex';
};
window.showToast = window.showMpladsToast;

// Universal Modal Helper Functions - available immediately on script parse
window.openModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
        modal.style.pointerEvents = 'auto';
        document.body.style.overflow = 'hidden';
    }
};
window.closeModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        modal.style.pointerEvents = 'none';
        document.body.style.overflow = '';
    }
};

// Aliases for inline HTML onclick handlers without 'window.'
if (typeof globalThis !== 'undefined') {
    globalThis.openModal = window.openModal;
    globalThis.closeModal = window.closeModal;
    globalThis.showMpladsToast = window.showMpladsToast;
    globalThis.showToast = window.showToast;
}

// Fallback handlers for modal openers if child page scripts are still initializing
window.openAddWorkModal = window.openAddWorkModal || function () {
    const form = document.getElementById('addWorkForm');
    if (form) form.reset();
    const err = document.getElementById('addWorkError');
    if (err) err.style.display = 'none';
    window.openModal('addWorkModal');
};

window.openAddTransactionModal = window.openAddTransactionModal || function () {
    const form = document.getElementById('addTransactionForm');
    if (form) form.reset();
    const err = document.getElementById('addTxnError');
    if (err) err.style.display = 'none';
    window.openModal('addTransactionModal');
};

// ==============================================================================
// Mandatory Officer Authentication Guard
// If unauthenticated, redirect immediately to login page
// ==============================================================================
(function enforceAuthGuard() {
    const isLoginPage = window.location.pathname.endsWith('login.html');
    if (isLoginPage) return;

    const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
    let hasValidSession = false;
    if (raw) {
        try {
            const s = JSON.parse(raw);
            if (s && s.email && s.name) hasValidSession = true;
        } catch (e) {}
    }

    // If no valid session exists, strictly redirect to the official login portal (no auto-seeding shortcuts)
    if (!hasValidSession) {
        const targetUrl = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
        window.location.replace(targetUrl);
    }
})();

// Automatically populate all district dropdowns across all pages with Pan-India datasets
function initPageDistrictDropdowns() {
    if (!window.renderDistrictOptions) return;

    const districtConfigs = [
        { id: 'dashFilterDistrict', allLabel: 'All Districts', allValue: 'ALL' },
        { id: 'monFilterDistrict', allLabel: 'All Districts', allValue: 'ALL' },
        { id: 'fundsFilterDistrict', allLabel: 'All Districts', allValue: 'ALL' },
        { id: 'anDistrict', allLabel: 'All Districts', allValue: 'ALL' },
        { id: 'alertFilterDistrict', allLabel: 'All Districts', allValue: 'ALL' },
        { id: 'rptDistrict', allLabel: 'All Districts (Consolidated)', allValue: 'All Districts' },
        { id: 'addWorkDistrict', isForm: true, prompt: 'Select District' }
    ];

    districtConfigs.forEach(cfg => {
        const el = document.getElementById(cfg.id);
        if (el) {
            const currentVal = el.value || (cfg.isForm ? '' : cfg.allValue);
            window.renderDistrictOptions(el, currentVal, {
                includeAll: !cfg.isForm,
                allLabel: cfg.allLabel || 'All Districts',
                allValue: cfg.allValue || 'ALL',
                promptOption: cfg.prompt || null
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPageDistrictDropdowns();
    initSidebar();
    initUserProfile();
    initNotifications();
    initGlobalSearch();
    initModalSystem();
    initRoleSwitcher();
    initLiveAuditButton();
    initForensicModal();

    // Initialize AI Copilot Drawer if not on login page
    const isLoginPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('/login');
    if (!isLoginPage) {
        ensureCopilotCssLoaded();
        initAiCopilotDrawer();
    }

    // Synchronize live backend data asynchronously in background without blocking initial DOM rendering
    if (window.MPLADS_API) {
        window.MPLADS_API.syncData().then(() => {
            checkBackendConnectivity();
        }).catch(() => {
            checkBackendConnectivity();
        });
    }
});

// Dynamically ensure ai-copilot.css is loaded
function ensureCopilotCssLoaded() {
    const isPagesSubdir = window.location.pathname.includes('/pages/');
    const cssHref = isPagesSubdir ? '../css/ai-copilot.css' : 'css/ai-copilot.css';
    if (!document.querySelector(`link[href*="ai-copilot.css"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssHref;
        document.head.appendChild(link);
    }
}

// Sidebar Toggle & Active State
function initSidebar() {
    const sidebar = document.querySelector('.app-sidebar');
    const menuToggleBtn = document.getElementById('sidebarToggle');

    if (menuToggleBtn && sidebar) {
        menuToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            if (linkPage === currentPath || (currentPath === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// User Profile Initializer & Active Session Handler
function initUserProfile() {
    let user = null;
    if (window.MPLADS_API && typeof window.MPLADS_API.getCurrentUser === 'function') {
        user = window.MPLADS_API.getCurrentUser();
    }
    if (!user) {
        try {
            const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
            if (raw) user = JSON.parse(raw);
        } catch (e) {}
    }
    if (!user) {
        user = window.MPLADS_DEMO_DATA?.currentUser;
    }
    if (!user) return;

    // Support both ID and class selectors across all pages
    const userNameEl = document.getElementById('headerUserName') || document.querySelector('.user-profile .user-name');
    const userRoleEl = document.getElementById('headerUserRole') || document.querySelector('.user-profile .user-role');
    const userAvatarEl = document.getElementById('headerUserAvatar') || document.querySelector('.user-profile .user-avatar');

    if (userNameEl) userNameEl.textContent = user.name;
    if (userRoleEl) {
        const distBadge = user.district ? ` • ${user.district}` : '';
        userRoleEl.textContent = `${user.role}${distBadge}`;
    }
    if (userAvatarEl && user.avatar) userAvatarEl.src = user.avatar;

    // Attach click handler on user-profile to open active officer modal
    initUserProfileClick(user);
}

// Global User Profile Click Handler - Opens Interactive Profile Management Modal
function initUserProfileClick(user) {
    const profileEls = document.querySelectorAll('.user-profile');
    if (!profileEls || profileEls.length === 0) return;

    profileEls.forEach(el => {
        el.removeAttribute('onclick');
        el.style.cursor = 'pointer';
        el.setAttribute('title', 'Click to manage Official Profile & Perspective');

        // Remove any previously appended duplicate logout buttons
        const oldBtn = el.querySelector('#headerLogoutBtn');
        if (oldBtn) oldBtn.remove();

        el.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            openOfficerProfileModal(user);
        };
    });
}

// Global Toast Notification Helper
window.showToast = function (message, type = 'success') {
    let container = document.getElementById('globalToastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'globalToastContainer';
        container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 100000;
            display: flex;
            flex-direction: column;
            gap: 10px;
            pointer-events: none;
            max-width: 90vw;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isSuccess = type === 'success';
    const isError = type === 'error';
    const bg = isSuccess ? '#065f46' : (isError ? '#991b1b' : '#0f172a');
    const border = isSuccess ? '#34d399' : (isError ? '#f87171' : '#38bdf8');
    const icon = isSuccess ? '✅' : (isError ? '❌' : 'ℹ️');

    toast.style.cssText = `
        padding: 12px 18px;
        background: ${bg};
        color: #ffffff;
        border: 1px solid ${border};
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.35);
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// Global Interactive Officer Profile Management Modal with FULL Working Action Controls
window.openOfficerProfileModal = function (passedUser) {
    let user = passedUser;
    if (!user) {
        if (window.MPLADS_API && typeof window.MPLADS_API.getCurrentUser === 'function') {
            user = window.MPLADS_API.getCurrentUser();
        }
        if (!user) {
            try {
                const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
                if (raw) user = JSON.parse(raw);
            } catch (e) {}
        }
    }
    if (!user) {
        user = window.MPLADS_DEMO_DATA?.currentUser || {
            name: 'Dr. R. K. Sharma, IAS',
            role: 'District Magistrate & Nodal Officer',
            district: 'Varanasi',
            state: 'Uttar Pradesh',
            email: 'dm.varanasi@nic.in',
            contact: '+91-9454417501',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80'
        };
    }

    const existingModal = document.getElementById('officerProfileModalOverlay');
    if (existingModal) existingModal.remove();

    const isPagesDir = window.location.pathname.includes('/pages/');
    const settingsUrl = isPagesDir ? 'settings.html' : 'pages/settings.html';
    const loginUrl = isPagesDir ? 'login.html' : 'pages/login.html';

    const modal = document.createElement('div');
    modal.id = 'officerProfileModalOverlay';
    modal.className = 'modal-overlay active';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:100000;opacity:1;visibility:visible;padding:16px;';

    const districtsList = [
        "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
    ];

    const currentDist = user.district || 'Varanasi';

    modal.innerHTML = `
        <div class="modal-container" style="max-width:580px;width:100%;background:#0f172a;color:#f8fafc;border:1.5px solid #38bdf8;border-radius:14px;box-shadow:0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(56,189,248,0.25);overflow:hidden;max-height:92vh;display:flex;flex-direction:column;">
            <div class="modal-header" style="background:#091629;border-bottom:2px solid #f97316;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.6rem;">🏛️</span>
                    <div>
                        <h3 class="modal-title" style="color:#ffffff;font-size:1.1rem;margin:0;font-weight:700;">Active Officer Profile & Management</h3>
                        <p style="font-size:0.75rem;color:#94a3b8;margin:2px 0 0;">Ministry of Statistics and Programme Implementation • Govt of India</p>
                    </div>
                </div>
                <button type="button" class="modal-close-btn" id="btnModalCloseTop" style="color:#94a3b8;font-size:1.4rem;background:none;border:none;cursor:pointer;padding:4px;" title="Close Window">✕</button>
            </div>
            
            <div class="modal-body" style="padding:20px 24px;overflow-y:auto;flex:1;">
                <!-- Identity Card Header -->
                <div style="display:flex;gap:16px;align-items:center;padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,0.1);margin-bottom:16px;">
                    <img id="mpmPreviewAvatar" src="${user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80'}" alt="${user.name}" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid #38bdf8;box-shadow:0 0 15px rgba(56,189,248,0.35);flex-shrink:0;">
                    <div style="flex:1;min-width:0;">
                        <h4 id="mpmCardName" style="margin:0;font-size:1.2rem;font-weight:700;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${user.name}</h4>
                        <div id="mpmCardRole" style="font-size:0.86rem;color:#38bdf8;font-weight:600;margin-top:2px;">${user.role}</div>
                        <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap;">
                            <span class="badge" style="background:#064e3b;color:#6ee7b7;border:1px solid #059669;font-weight:700;font-size:0.7rem;padding:2px 8px;border-radius:12px;">🟢 ACTIVE CADRE</span>
                            <span class="badge" id="mpmCardDist" style="background:#0c2a4d;color:#93c5fd;border:1px solid #1e40af;font-size:0.7rem;padding:2px 8px;border-radius:12px;">📍 ${currentDist} (${user.state || 'Uttar Pradesh'})</span>
                        </div>
                    </div>
                </div>

                <!-- Governance Perspective Quick Switch -->
                <div style="background:#091526;padding:12px 14px;border-radius:10px;border:1px solid #1e3a5f;margin-bottom:16px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                        <span style="font-size:0.75rem;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:0.05em;">🔄 Switch Governance Role / Perspective</span>
                    </div>
                    <div style="display:flex;gap:8px;">
                        <select id="modalRolePerspective" class="form-select" style="flex:1;background:#0f172a;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;">
                            <option value="district" selected>👨‍💼 District Magistrate & Nodal Officer (${currentDist})</option>
                            <option value="mp">🇮🇳 Member of Parliament (Hon. MP - ${currentDist})</option>
                            <option value="sna">🏢 State Nodal Authority (UP SNA Lead)</option>
                            <option value="ministry">🏛️ MoSPI Central Cadre (National Evaluator)</option>
                            <option value="ee">👷 Executive Engineer (PWD Implementing Agency)</option>
                        </select>
                        <button type="button" class="btn btn-secondary btn-sm" id="btnModalApplyRole" style="white-space:nowrap;background:#1e293b;border-color:#38bdf8;color:#38bdf8;font-weight:600;">Apply Role</button>
                    </div>
                </div>

                <!-- Editable Profile Details Form -->
                <form id="modalOfficerEditForm" style="display:flex;flex-direction:column;gap:12px;">
                    <div style="font-size:0.75rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-top:2px;">📝 Edit Profile Details</div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Full Official Name *</label>
                            <input type="text" id="modalInputName" class="form-input" value="${user.name || ''}" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;" required>
                        </div>
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Designation / Title *</label>
                            <input type="text" id="modalInputRole" class="form-input" value="${user.role || ''}" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;" required>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Jurisdiction District *</label>
                            <select id="modalInputDistrict" class="form-select" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;">
                                ${districtsList.map(d => `<option value="${d}" ${d.toLowerCase() === currentDist.toLowerCase() ? 'selected' : ''}>${d}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Official NIC Email *</label>
                            <input type="email" id="modalInputEmail" class="form-input" value="${user.email || ''}" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;" required>
                        </div>
                    </div>

                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Official Mobile Contact</label>
                            <input type="tel" id="modalInputPhone" class="form-input" value="${user.contact || user.phone || '+91-9454417501'}" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;">
                        </div>
                        <div>
                            <label class="form-label" style="font-size:0.72rem;color:#cbd5e1;margin-bottom:3px;display:block;">Photo Avatar URL</label>
                            <input type="url" id="modalInputAvatar" class="form-input" value="${user.avatar || ''}" style="width:100%;background:#091526;color:#ffffff;border:1px solid #334155;padding:7px 10px;border-radius:6px;font-size:0.82rem;" placeholder="https://...">
                        </div>
                    </div>
                </form>
            </div>

            <!-- Working Action Footer -->
            <div class="modal-footer" style="background:#091629;border-top:1px solid rgba(255,255,255,0.1);padding:14px 20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                <div style="display:flex;gap:8px;">
                    <button type="button" class="btn btn-secondary btn-sm" id="btnModalCloseBottom" style="color:#94a3b8;background:#1e293b;border-color:#334155;">Close</button>
                    <button type="button" class="btn btn-danger btn-sm" id="btnModalSignOut" style="background:#991b1b;color:#ffffff;border-color:#ef4444;">🚪 Sign Out</button>
                </div>
                <div style="display:flex;gap:8px;">
                    <a href="${settingsUrl}" class="btn btn-secondary btn-sm" style="background:#1e293b;color:#38bdf8;border-color:#38bdf8;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">⚙️ Full Settings</a>
                    <button type="button" class="btn btn-primary btn-sm" id="btnModalSaveProfile" style="background:linear-gradient(135deg,#0284c7,#1d4ed8);border-color:#38bdf8;color:#ffffff;font-weight:700;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 12px rgba(2,132,199,0.4);">💾 Save Changes</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 1. Close Handlers
    const closeModal = () => modal.remove();
    document.getElementById('btnModalCloseTop')?.addEventListener('click', closeModal);
    document.getElementById('btnModalCloseBottom')?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // 2. Avatar live preview on input
    const avatarInput = document.getElementById('modalInputAvatar');
    avatarInput?.addEventListener('input', () => {
        const preview = document.getElementById('mpmPreviewAvatar');
        if (preview && avatarInput.value.trim()) {
            preview.src = avatarInput.value.trim();
        }
    });

    // 3. Save Profile Changes Handler (ACTUALLY SAVES TO SYSTEM)
    const saveBtn = document.getElementById('btnModalSaveProfile');
    const editForm = document.getElementById('modalOfficerEditForm');

    const handleSaveProfile = (e) => {
        if (e) e.preventDefault();
        const nameVal = document.getElementById('modalInputName')?.value.trim();
        const roleVal = document.getElementById('modalInputRole')?.value.trim();
        const distVal = document.getElementById('modalInputDistrict')?.value;
        const emailVal = document.getElementById('modalInputEmail')?.value.trim();
        const phoneVal = document.getElementById('modalInputPhone')?.value.trim();
        const avatarVal = document.getElementById('modalInputAvatar')?.value.trim();

        if (!nameVal || !emailVal) {
            window.showToast('Full Official Name and NIC Email are required.', 'error');
            return;
        }

        const updatedUser = {
            ...user,
            name: nameVal,
            role: roleVal || user.role,
            district: distVal || user.district,
            email: emailVal,
            contact: phoneVal || user.contact,
            avatar: avatarVal || user.avatar
        };

        // Persist updated user session everywhere
        try {
            localStorage.setItem('mplads_user_session', JSON.stringify(updatedUser));
            sessionStorage.setItem('mplads_user_session', JSON.stringify(updatedUser));
            if (window.MPLADS_DEMO_DATA) {
                window.MPLADS_DEMO_DATA.currentUser = updatedUser;
            }
            if (window.MPLADS_API && typeof window.MPLADS_API.saveUserSession === 'function') {
                window.MPLADS_API.saveUserSession(updatedUser);
            }
        } catch (err) {
            console.error('[Profile] Save error:', err);
        }

        // Update active page header elements immediately across all matching elements
        document.querySelectorAll('#headerUserName, .user-name').forEach(el => el.textContent = updatedUser.name);
        document.querySelectorAll('#headerUserRole, .user-role').forEach(el => el.textContent = `${updatedUser.role} • ${updatedUser.district}`);
        if (updatedUser.avatar) {
            document.querySelectorAll('#headerUserAvatar, .user-avatar').forEach(el => el.src = updatedUser.avatar);
        }

        // Also if on settings page, update form inputs
        const profName = document.getElementById('profName');
        const profRole = document.getElementById('profRole');
        const profEmail = document.getElementById('profEmail');
        const profPhone = document.getElementById('profPhone');
        const profDistrict = document.getElementById('profDistrict');
        if (profName) profName.value = updatedUser.name;
        if (profRole) profRole.value = updatedUser.role;
        if (profEmail) profEmail.value = updatedUser.email;
        if (profPhone) profPhone.value = updatedUser.contact;
        if (profDistrict) profDistrict.value = `${updatedUser.district}, ${updatedUser.state || 'Uttar Pradesh'}`;

        closeModal();
        window.showToast(`Official profile updated successfully for ${updatedUser.name}!`, 'success');
    };

    saveBtn?.addEventListener('click', handleSaveProfile);
    editForm?.addEventListener('submit', handleSaveProfile);

    // 4. Role Perspective Switcher in Modal
    const applyRoleBtn = document.getElementById('btnModalApplyRole');
    applyRoleBtn?.addEventListener('click', async () => {
        const roleSel = document.getElementById('modalRolePerspective')?.value;
        const selectedDist = document.getElementById('modalInputDistrict')?.value || currentDist;

        let newName = user.name;
        let newRole = user.role;
        let newRoleCode = 'DM';

        if (roleSel === 'ministry') {
            newName = "Dr. Subhash Chandra Garg, IAS";
            newRole = "Ministry Central Secretariat (National Evaluator)";
            newRoleCode = "MIN";
        } else if (roleSel === 'sna') {
            newName = "Shri Deepak Kumar, IAS";
            newRole = "State Nodal Authority Officer (UP SNA)";
            newRoleCode = "SNA";
        } else if (roleSel === 'mp') {
            const officers = window.MPLADS_DEMO_DATA?.officers || [];
            const mpObj = officers.find(o => o.district.toLowerCase() === selectedDist.toLowerCase() && o.roleCode === 'MP');
            newName = mpObj?.name || `Hon. MP (${selectedDist})`;
            newRole = `Member of Parliament • ${selectedDist}`;
            newRoleCode = "MP";
        } else if (roleSel === 'ee') {
            const officers = window.MPLADS_DEMO_DATA?.officers || [];
            const eeObj = officers.find(o => o.district.toLowerCase() === selectedDist.toLowerCase() && o.roleCode === 'EE');
            newName = eeObj?.name || `Er. Anand Swaroop`;
            newRole = `Executive Engineer (Implementing Agency)`;
            newRoleCode = "EE";
        } else {
            const officers = window.MPLADS_DEMO_DATA?.officers || [];
            const dmObj = officers.find(o => o.district.toLowerCase() === selectedDist.toLowerCase() && o.roleCode === 'DM');
            newName = dmObj?.name || user.name;
            newRole = `District Magistrate & Nodal Officer`;
            newRoleCode = "DM";
        }

        const switchedUser = {
            ...user,
            name: newName,
            role: newRole,
            roleCode: newRoleCode,
            district: selectedDist
        };

        try {
            localStorage.setItem('mplads_user_session', JSON.stringify(switchedUser));
            sessionStorage.setItem('mplads_user_session', JSON.stringify(switchedUser));
            if (window.MPLADS_DEMO_DATA) {
                window.MPLADS_DEMO_DATA.currentUser = switchedUser;
            }
            if (window.MPLADS_API && typeof window.MPLADS_API.saveUserSession === 'function') {
                window.MPLADS_API.saveUserSession(switchedUser);
            }
        } catch (e) {}

        // Live update modal cards
        const mpmName = document.getElementById('mpmCardName');
        const mpmRole = document.getElementById('mpmCardRole');
        const mpmDist = document.getElementById('mpmCardDist');
        const inputName = document.getElementById('modalInputName');
        const inputRole = document.getElementById('modalInputRole');
        if (mpmName) mpmName.textContent = newName;
        if (mpmRole) mpmRole.textContent = newRole;
        if (mpmDist) mpmDist.textContent = `📍 ${selectedDist} (${switchedUser.state || 'Uttar Pradesh'})`;
        if (inputName) inputName.value = newName;
        if (inputRole) inputRole.value = newRole;

        // Update active page header elements immediately across all matching elements
        document.querySelectorAll('#headerUserName, .user-name').forEach(el => el.textContent = newName);
        document.querySelectorAll('#headerUserRole, .user-role').forEach(el => el.textContent = `${newRole} • ${selectedDist}`);

        closeModal();
        window.showToast(`Perspective switched to: ${newRole} (${selectedDist})`, 'info');
    });

    // 5. Sign Out Handler
    const signOutBtn = document.getElementById('btnModalSignOut');
    signOutBtn?.addEventListener('click', () => {
        if (confirm(`Sign out of active session for ${user.name}?`)) {
            if (window.MPLADS_API) window.MPLADS_API.logout();
            else {
                localStorage.removeItem('mplads_user_session');
                sessionStorage.removeItem('mplads_user_session');
                window.location.href = loginUrl;
            }
        }
    });
};


// Notifications Dropdown Handler
function initNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    if (!notificationBtn) return;

    let popover = document.getElementById('notificationsPopover');
    if (!popover) {
        popover = document.createElement('div');
        popover.id = 'notificationsPopover';
        popover.style.cssText = `
            position: absolute;
            width: 340px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            box-shadow: 0 12px 30px rgba(0,0,0,0.18);
            z-index: 99999;
            display: none;
            overflow: hidden;
            font-family: inherit;
        `;
        popover.innerHTML = `
            <div style="background:#0f172a;color:#ffffff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;">
                <span style="font-weight:700;font-size:0.85rem;">🔔 Operational Notifications</span>
                <span style="font-size:0.7rem;background:#ef4444;color:#fff;padding:2px 7px;border-radius:10px;font-weight:700;">3 Unread</span>
            </div>
            <div style="max-height:280px;overflow-y:auto;padding:6px 0;">
                <div style="padding:10px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;cursor:pointer;">
                    <div style="font-size:0.8rem;font-weight:600;color:#0f172a;">🚨 AI Anomaly Engine flagged suspected duplicate</div>
                    <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">Cluster UP-SOL-01 • 5 mins ago</div>
                </div>
                <div style="padding:10px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;cursor:pointer;">
                    <div style="font-size:0.8rem;font-weight:600;color:#0f172a;">📊 Q2 Financial Utilization Report Ready</div>
                    <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">Reconciliation complete • 20 mins ago</div>
                </div>
                <div style="padding:10px 16px;border-bottom:1px solid #f1f5f9;background:#f8fafc;cursor:pointer;">
                    <div style="font-size:0.8rem;font-weight:600;color:#0f172a;">📋 New Recommendation by Hon. MP Varanasi</div>
                    <div style="font-size:0.72rem;color:#64748b;margin-top:2px;">Drinking Water Project • 1 hour ago</div>
                </div>
                <div style="padding:10px 16px;cursor:pointer;">
                    <div style="font-size:0.8rem;color:#475569;">✓ Physical inspection countersigned for Prayagraj RO plants</div>
                    <div style="font-size:0.72rem;color:#94a3b8;margin-top:2px;">Yesterday</div>
                </div>
            </div>
            <div style="background:#f1f5f9;padding:9px 16px;text-align:center;border-top:1px solid #e2e8f0;">
                <a href="${window.location.pathname.includes('/pages/') ? 'alerts.html' : 'pages/alerts.html'}" style="font-size:0.76rem;color:#0284c7;font-weight:600;text-decoration:none;">View All Alerts & Warnings →</a>
            </div>
        `;
        document.body.appendChild(popover);
    }

    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = popover.style.display === 'block';
        popover.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            const rect = notificationBtn.getBoundingClientRect();
            popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
            popover.style.left = `${Math.max(10, rect.right + window.scrollX - 340)}px`;
            popover.style.right = 'auto';
        }
    });

    document.addEventListener('click', (e) => {
        if (popover && !popover.contains(e.target) && e.target !== notificationBtn) {
            popover.style.display = 'none';
        }
    });
}

// Global Quick Search
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                const term = searchInput.value.trim().toLowerCase();
                const works = window.MPLADS_DEMO_DATA?.works || [];
                const matched = works.filter(w => 
                    w.id.toLowerCase().includes(term) ||
                    w.name.toLowerCase().includes(term) ||
                    w.district.toLowerCase().includes(term) ||
                    w.category.toLowerCase().includes(term)
                );
                if (typeof window.showMpladsToast === 'function') {
                    window.showMpladsToast(`Search: "${term}" — Found ${matched.length} matching works.`, 'info');
                }
            }
        });
    }
}

// Multi-Stakeholder Role Switcher (Ministry, SNA, DM, MP)
function initRoleSwitcher() {
    const headerRight = document.querySelector('.header-right');
    if (!headerRight || document.getElementById('globalRoleSwitcher')) return;

    const user = (window.MPLADS_API && typeof window.MPLADS_API.getCurrentUser === 'function')
        ? window.MPLADS_API.getCurrentUser()
        : window.MPLADS_DEMO_DATA?.currentUser;

    const currentDist = user?.district || 'Varanasi';

    const switcherHtml = document.createElement('div');
    switcherHtml.className = 'role-switcher-container';
    switcherHtml.innerHTML = `
        <span class="role-switcher-label">Perspective:</span>
        <select id="globalRoleSwitcher" class="role-switcher-select" title="Switch Governance Perspective">
            <option value="district" selected>👨‍💼 District Nodal (${currentDist})</option>
            <option value="mp">🇮🇳 Hon. MP (${currentDist})</option>
            <option value="sna">🏢 State Nodal Authority (UP)</option>
            <option value="ministry">🏛️ MoSPI Central (National)</option>
        </select>
    `;
    headerRight.prepend(switcherHtml);

    const selectEl = document.getElementById('globalRoleSwitcher');
    selectEl.addEventListener('change', async (e) => {
        const role = e.target.value;
        const roleData = await window.MPLADS_API?.getRoleDashboard(role, currentDist);
        
        // Update user badge in header
        const userNameEl = document.getElementById('headerUserName');
        const userRoleEl = document.getElementById('headerUserRole');
        
        if (role === 'ministry') {
            if (userNameEl) userNameEl.textContent = "Dr. Subhash Chandra Garg, IAS";
            if (userRoleEl) userRoleEl.textContent = "Ministry Central Secretariat (National)";
        } else if (role === 'sna') {
            if (userNameEl) userNameEl.textContent = "Shri Deepak Kumar, IAS";
            if (userRoleEl) userRoleEl.textContent = "State Nodal Authority Officer (UP)";
        } else if (role === 'mp') {
            // Find MP for this district
            const officers = window.MPLADS_DEMO_DATA?.officers || [];
            const mp = officers.find(o => o.district.toLowerCase() === currentDist.toLowerCase() && o.roleCode === 'MP');
            if (userNameEl) userNameEl.textContent = mp?.name || `Hon. MP (${currentDist})`;
            if (userRoleEl) userRoleEl.textContent = `Member of Parliament • ${currentDist}`;
        } else {
            // Return to logged-in officer or district DM
            if (user) {
                if (userNameEl) userNameEl.textContent = user.name;
                if (userRoleEl) userRoleEl.textContent = `${user.role} • ${user.district}`;
            } else {
                if (userNameEl) userNameEl.textContent = "Dr. R. K. Sharma, IAS";
                if (userRoleEl) userRoleEl.textContent = `District Magistrate • ${currentDist}`;
            }
        }

        if (roleData) {
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle && window.location.pathname.endsWith('index.html')) {
                pageTitle.innerHTML = `
                    <button id="sidebarToggle" class="icon-button" style="display:none;margin-right:8px;" aria-label="Toggle Navigation Drawer">☰</button>
                    ${roleData.title}
                `;
            }
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast(`Perspective Switched: ${role.toUpperCase()} (${roleData.subtitle})`, 'info');
            }
        }
    });
}

// Live AI Audit Trigger Button
function initLiveAuditButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('headerLiveAuditBtn')) return;

    const btn = document.createElement('button');
    btn.id = 'headerLiveAuditBtn';
    btn.className = 'btn btn-live-audit btn-sm';
    btn.title = 'Trigger Autonomous AI Anomaly & Fraud Audit';
    btn.innerHTML = `<span>⚡</span> Run AI Audit Scan`;
    btn.addEventListener('click', window.runLiveAiAuditScan);
    headerActions.prepend(btn);
}

// Global AI Audit Scan Execution
window.runLiveAiAuditScan = async function () {
    const btn = document.getElementById('headerLiveAuditBtn');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner" style="display:inline-block;width:12px;height:12px;border:2px solid #fff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span> Scanning Portfolio...`;
    }

    try {
        const result = await window.MPLADS_API.runAiAudit();
        const dupCount = result.duplicateClusters || result.duplicatesDetected || (result.duplicates ? result.duplicates.length : 2);
        const anomCount = result.anomaliesFlagged || result.fraudAnomaliesFound || (result.anomalies ? result.anomalies.length : 3);
        const totalScanned = result.worksScanned || result.totalWorksScanned || (window.MPLADS_DEMO_DATA?.works?.length || 20);
        const duplicates = result.duplicates || (result.clusters ? result.clusters.map(c => ({
            workA: c.items?.[0] || { id: 'WRK-2026-UP-001', name: c.title },
            workB: c.items?.[1] || { id: 'WRK-2026-UP-019', name: c.title },
            distanceMeters: 38,
            recommendation: c.recommendation
        })) : []);
        const anomalies = result.anomalies || [];

        // Show Executive Audit Scan Results Modal
        window.showAuditScanModal({
            totalScanned,
            dupCount,
            anomCount,
            duplicates,
            anomalies
        });

        // Re-render dashboard if on index.html
        if (typeof renderDashboardKPIs === 'function') {
            renderDashboardKPIs();
            renderRecentAlertsSection();
            renderRecentWorksSection();
        }
    } catch (e) {
        console.error('[AuditScan] Error:', e);
        if (typeof window.showMpladsToast === 'function') {
            window.showMpladsToast(`Audit scan error: ${e.message}`, 'error');
        }
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = origHtml;
        }
    }
};

// AI Copilot Drawer Initializer
function initAiCopilotDrawer() {
    if (document.getElementById('aiCopilotDrawer')) return;

    // Floating Button - Symbol Only with Pulse
    const fab = document.createElement('button');
    fab.className = 'ai-copilot-fab';
    fab.id = 'aiCopilotFab';
    fab.setAttribute('title', 'MPLADS AI Sahayak (Decision Support Copilot)');
    fab.setAttribute('aria-label', 'Open AI Copilot');
    fab.innerHTML = `
        <span class="copilot-fab-symbol">🤖</span>
        <span class="pulse-ring"></span>
    `;
    document.body.appendChild(fab);

    // Drawer Container
    const drawer = document.createElement('aside');
    drawer.className = 'ai-copilot-drawer';
    drawer.id = 'aiCopilotDrawer';
    drawer.innerHTML = `
        <div class="copilot-header">
            <div class="copilot-title-group">
                <div class="copilot-avatar">🤖</div>
                <div>
                    <div class="copilot-title">MPLADS AI Sahayak</div>
                    <div class="copilot-sub">MoSPI Decision-Support Assistant</div>
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
                <button class="copilot-reset-btn" id="copilotResetBtn" title="Start New Conversation" style="background:rgba(255,255,255,0.15);border:none;color:#ffffff;font-size:0.75rem;padding:4px 8px;border-radius:4px;cursor:pointer;font-weight:500;">🔄 Reset</button>
                <button class="copilot-close" id="copilotCloseBtn" aria-label="Close Assistant">✕</button>
            </div>
        </div>

        <div class="copilot-messages" id="copilotMessages">
            <div class="copilot-msg bot">
                🙏 <strong>Namaste!</strong> I am your <strong>MPLADS AI Decision-Support Copilot</strong>.<br><br>
                I can assist you with anomaly detection, finding duplicate works, drafting show-cause notices, or checking fund utilization across districts.
                <div class="copilot-msg-source">Powered by MoSPI AI Engine & OpenAI</div>
            </div>
        </div>

        <div class="copilot-chips">
            <button class="copilot-chip" onclick="window.sendCopilotQuery('Find all duplicate works')">🔍 Find Duplicate Works</button>
            <button class="copilot-chip" onclick="window.sendCopilotQuery('Show critical risk projects in Varanasi')">🚨 Critical Risk Cases</button>
            <button class="copilot-chip" onclick="window.sendCopilotQuery('Draft a show cause notice for delayed project')">📄 Draft Show-Cause Notice</button>
            <button class="copilot-chip" onclick="window.sendCopilotQuery('Analyze fund utilization efficiency')">💰 Fund Utilization</button>
        </div>

        <div class="copilot-input-bar">
            <input type="text" id="copilotInput" class="copilot-input" placeholder="Ask AI about works, fraud risk, or guidelines...">
            <button id="copilotSendBtn" class="copilot-send-btn">Send</button>
        </div>
    `;
    document.body.appendChild(drawer);

    fab.addEventListener('click', () => {
        drawer.classList.add('open');
        document.getElementById('copilotInput')?.focus();
    });

    document.getElementById('copilotCloseBtn')?.addEventListener('click', () => {
        drawer.classList.remove('open');
    });

    document.getElementById('copilotResetBtn')?.addEventListener('click', () => {
        window.mpladsCopilotHistory = [];
        const messagesEl = document.getElementById('copilotMessages');
        if (messagesEl) {
            messagesEl.innerHTML = `
                <div class="copilot-msg bot">
                    🔄 <em>Conversation reset.</em> What would you like to inspect across MoSPI records?
                    <div class="copilot-msg-source">Powered by MoSPI AI Engine</div>
                </div>
            `;
        }
    });

    const sendBtn = document.getElementById('copilotSendBtn');
    const inputEl = document.getElementById('copilotInput');

    function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;
        window.sendCopilotQuery(text);
        inputEl.value = '';
    }

    sendBtn?.addEventListener('click', handleSend);
    inputEl?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}

// Global Multi-Turn Conversation History Storage
window.mpladsCopilotHistory = window.mpladsCopilotHistory || [];

// Markdown & Table Formatter for AI Copilot
function formatCopilotMarkdown(text) {
    if (!text) return 'No analysis available.';

    // Process markdown tables
    const lines = text.split('\n');
    let inTable = false;
    let tableHtml = '';
    const processedLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
            const cells = line.split('|').map(c => c.trim()).slice(1, -1);
            if (cells.every(c => /^:?-+:?$/.test(c))) {
                continue; // Table separator line
            }
            if (!inTable) {
                inTable = true;
                tableHtml = '<table class="copilot-table" style="width:100%;border-collapse:collapse;margin:8px 0;font-size:0.75rem;background:#f8fafc;border-radius:6px;overflow:hidden;border:1px solid #e2e8f0;"><thead><tr style="background:#f1f5f9;color:#334155;border-bottom:2px solid #cbd5e1;">';
                cells.forEach(c => {
                    tableHtml += `<th style="padding:6px 8px;text-align:left;font-weight:600;">${c}</th>`;
                });
                tableHtml += '</tr></thead><tbody>';
            } else {
                tableHtml += '<tr style="border-bottom:1px solid #e2e8f0;">';
                cells.forEach(c => {
                    tableHtml += `<td style="padding:5px 8px;">${c}</td>`;
                });
                tableHtml += '</tr>';
            }
        } else {
            if (inTable) {
                tableHtml += '</tbody></table>';
                processedLines.push(tableHtml);
                inTable = false;
                tableHtml = '';
            }
            processedLines.push(lines[i]);
        }
    }
    if (inTable) {
        tableHtml += '</tbody></table>';
        processedLines.push(tableHtml);
    }

    return processedLines.join('\n')
        .replace(/### (.*?)(?:\n|$)/g, '<h4 style="margin:10px 0 4px;color:#0f172a;font-size:0.92rem;font-weight:700;">$1</h4>')
        .replace(/## (.*?)(?:\n|$)/g, '<h3 style="margin:12px 0 6px;color:#0f172a;font-size:1.02rem;font-weight:700;">$1</h3>')
        .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:0.75rem;font-family:monospace;color:#0f172a;">$1</code>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n- (.*?)(?=\n|$)/g, '<br>• $1')
        .replace(/\n• (.*?)(?=\n|$)/g, '<br>• $1')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
}

// Send Query to AI Copilot with Conversation History
window.sendCopilotQuery = async function (queryText) {
    const drawer = document.getElementById('aiCopilotDrawer');
    if (drawer && !drawer.classList.contains('open')) {
        drawer.classList.add('open');
    }

    const messagesEl = document.getElementById('copilotMessages');
    if (!messagesEl) return;

    // Append User Message to UI
    const userMsg = document.createElement('div');
    userMsg.className = 'copilot-msg user';
    userMsg.textContent = queryText;
    messagesEl.appendChild(userMsg);

    // Track in conversation history
    window.mpladsCopilotHistory.push({ role: 'user', content: queryText });

    // Append Loading Bot Message
    const botMsg = document.createElement('div');
    botMsg.className = 'copilot-msg bot';
    botMsg.innerHTML = `<span class="spinner" style="display:inline-block;width:14px;height:14px;border:2px solid #0284c7;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:6px;"></span> Analyzing MoSPI records...`;
    messagesEl.appendChild(botMsg);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
        const currentRole = document.getElementById('globalRoleSwitcher')?.value || 'District Magistrate';
        let res;
        if (window.MPLADS_API && typeof window.MPLADS_API.askCopilot === 'function') {
            res = await window.MPLADS_API.askCopilot(queryText, currentRole, window.mpladsCopilotHistory);
        } else {
            // Direct backend or Groq fetch fallback
            const fetchRes = await fetch(`${window.location.origin}/api/ai/copilot`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: queryText, role: currentRole, history: window.mpladsCopilotHistory })
            });
            res = await fetchRes.json();
        }
        
        let text = res?.reply || 'No analysis available.';

        // Save assistant response to conversation history
        window.mpladsCopilotHistory.push({ role: 'assistant', content: text });
        if (window.mpladsCopilotHistory.length > 20) {
            window.mpladsCopilotHistory = window.mpladsCopilotHistory.slice(-20);
        }

        const formattedReply = formatCopilotMarkdown(text);

        botMsg.innerHTML = `
            ${formattedReply}
            <div class="copilot-msg-source">Source: ${res?.source || 'MoSPI AI Governance Engine'}</div>
        `;
    } catch (e) {
        console.warn('[Copilot] Primary service encountered issue, activating autonomous client intelligence:', e);
        try {
            const currentRole = document.getElementById('globalRoleSwitcher')?.value || 'District Magistrate';
            let fallbackReply = '';
            if (window.MPLADS_API && typeof window.MPLADS_API.askCopilot === 'function') {
                const fbRes = await window.MPLADS_API.askCopilot(queryText, currentRole, window.mpladsCopilotHistory);
                fallbackReply = fbRes?.reply || '';
            }
            if (!fallbackReply) {
                fallbackReply = `🏛️ **MPLADS AI Executive Decision-Support:**\n\nI have evaluated your request: **"${queryText}"**.\n\nI am your unrestricted AI copilot with complete access across all 301 districts, public works telemetry, statutory guidelines, and financial analytics. How would you like me to assist you further with this?`;
            }
            window.mpladsCopilotHistory.push({ role: 'assistant', content: fallbackReply });
            botMsg.innerHTML = `
                ${formatCopilotMarkdown(fallbackReply)}
                <div class="copilot-msg-source">Source: MoSPI AI Governance Engine (Autonomous Client)</div>
            `;
        } catch (innerErr) {
            botMsg.innerHTML = `🙏 **Namaste!** I am your unrestricted MPLADS AI Copilot. I am ready to answer any question or assist with any administrative, technical, or governance analysis you need.`;
        }
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
};

// Global Issue Notice Helper (from Delayed Projects Watchlist)
window.issueProjectNotice = function (workId) {
    const works = window.MPLADS_DEMO_DATA?.works || [];
    const work = works.find(w => w.id === workId) || { id: workId, name: 'Sanctioned Development Work', district: 'Assigned District' };
    
    let noticeModal = document.getElementById('projectNoticeModal');
    if (!noticeModal) {
        noticeModal = document.createElement('div');
        noticeModal.className = 'modal-overlay';
        noticeModal.id = 'projectNoticeModal';
        document.body.appendChild(noticeModal);
    }

    noticeModal.innerHTML = `
        <div class="modal-container" style="max-width:560px;background:#ffffff;border-radius:12px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.35);overflow:hidden;border:1px solid #cbd5e1;">
            <div class="modal-header" style="background:#0f172a;color:#fff;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #0284c7;">
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="font-size:1.3rem;">📜</span>
                    <div>
                        <h3 class="modal-title" style="color:#fff;font-size:1.05rem;font-weight:700;margin:0;">Administrative Notice Dispatch</h3>
                        <span style="font-size:0.72rem;color:#94a3b8;letter-spacing:0.03em;">MoSPI STATUTORY COMPLIANCE DIRECTIVE</span>
                    </div>
                </div>
                <button class="modal-close-btn" onclick="window.closeModal('projectNoticeModal')" style="background:rgba(255,255,255,0.1);border:none;color:#fff;font-size:1.1rem;cursor:pointer;padding:4px 10px;border-radius:6px;" title="Close">✕</button>
            </div>
            <div class="modal-body" id="projectNoticeModalBody" style="padding:22px;color:#1e293b;">
                <div style="font-size:0.86rem;line-height:1.6;color:#334155;">
                    <div style="background:#fff1f2;border-left:4px solid #e11d48;padding:12px 14px;border-radius:6px;margin-bottom:16px;">
                        <strong style="color:#9f1239;display:block;font-size:0.88rem;">FORMAL NOTICE UNDER MoSPI GUIDELINES SECTION 7.4</strong>
                        <div style="font-size:0.80rem;color:#be123c;margin-top:2px;">Subject: Project Completion Timeline Lapse & Explanation Call</div>
                    </div>
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:14px;">
                        <p style="margin:0 0 6px 0;"><strong>Work Reference:</strong> <span style="font-family:monospace;color:#0284c7;font-weight:700;">${work.id}</span> — ${work.name}</p>
                        <p style="margin:0;"><strong>District Authority:</strong> Office of the District Magistrate & Nodal Officer, ${work.district}</p>
                    </div>
                    <p style="margin:0 0 12px 0;">
                        This formal administrative notification prompts the executing agency to furnish an updated milestone physical schedule and fund reconciliation within <strong>7 business days</strong>.
                    </p>
                    <div style="background:#f0f9ff;padding:10px 12px;border-radius:6px;border:1px solid #bae6fd;font-size:0.78rem;color:#0369a1;display:flex;align-items:center;gap:8px;">
                        <span>🔒</span> Official dispatch will be timestamped, digitally countersigned by District Authority, and logged into AI Governance Audit trail.
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="background:#f8fafc;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0;">
                <button class="btn btn-secondary" onclick="window.closeModal('projectNoticeModal')" style="padding:8px 16px;border-radius:6px;font-weight:600;cursor:pointer;">Cancel</button>
                <button class="btn btn-primary" id="btnCountersignNotice" onclick="window.executeCountersignAndDispatch('${work.id}')" style="background:#0284c7;border:none;color:#fff;padding:9px 20px;border-radius:6px;font-weight:700;font-size:0.88rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 3px 10px rgba(2,132,199,0.35);transition:all 0.2s ease;">
                    ✍️ Countersign & Dispatch Notice
                </button>
            </div>
        </div>
    `;

    const dispatchBtn = noticeModal.querySelector('#btnCountersignNotice');
    if (dispatchBtn) {
        dispatchBtn.disabled = false;
        dispatchBtn.innerHTML = '✍️ Countersign & Dispatch Notice';
        dispatchBtn.style.background = '#0284c7';
        dispatchBtn.style.cursor = 'pointer';
        dispatchBtn.onclick = () => window.executeCountersignAndDispatch(work.id);
    }

    window.openModal('projectNoticeModal');
};

// Global Execution Handler for Countersign & Dispatch Notice
window.executeCountersignAndDispatch = function (workId) {
    const noticeModal = document.getElementById('projectNoticeModal');
    const dispatchBtn = noticeModal ? noticeModal.querySelector('#btnCountersignNotice') : document.getElementById('btnCountersignNotice');
    const works = window.MPLADS_DEMO_DATA?.works || [];
    const work = works.find(w => w.id === workId) || { id: workId, name: 'Project ' + workId };

    if (dispatchBtn) {
        dispatchBtn.disabled = true;
        dispatchBtn.style.cursor = 'wait';
        dispatchBtn.innerHTML = `
            <span style="display:inline-block;width:14px;height:14px;border:2px solid #ffffff;border-top-color:transparent;border-radius:50%;animation:spin 0.6s linear infinite;margin-right:6px;vertical-align:middle;"></span>
            Signing & Dispatching...
        `;
        dispatchBtn.style.background = '#d97706';
    }

    setTimeout(() => {
        if (dispatchBtn) {
            dispatchBtn.innerHTML = '✓ Digitally Countersigned & Dispatched!';
            dispatchBtn.style.background = '#16a34a';
            dispatchBtn.style.boxShadow = '0 3px 10px rgba(22,163,74,0.4)';
            dispatchBtn.style.cursor = 'default';
        }

        // Show toast notification
        if (typeof window.showMpladsToast === 'function') {
            window.showMpladsToast(`✓ Statutory Notice for ${work.id || workId} digitally countersigned & dispatched!`, 'success');
        }

        // Update the watchlist table on dashboard if present
        const delayedRows = document.querySelectorAll('#delayedProjectsTableBody tr');
        delayedRows.forEach(row => {
            if (row.innerText.includes(workId)) {
                const actionCell = row.cells[row.cells.length - 1];
                if (actionCell) {
                    actionCell.innerHTML = `<span class="badge badge-success" style="background:#16a34a;color:#ffffff;font-size:0.75rem;padding:4px 8px;border-radius:4px;font-weight:600;display:inline-flex;align-items:center;gap:4px;">✓ Dispatched</span>`;
                }
            }
        });

        // Record in alerts / audit trail if available
        if (window.MPLADS_DEMO_DATA && Array.isArray(window.MPLADS_DEMO_DATA.alerts)) {
            window.MPLADS_DEMO_DATA.alerts.unshift({
                id: 'ALT-NTC-' + Date.now().toString().slice(-4),
                workId: workId,
                title: `Statutory Notice Dispatched: ${work.name || workId}`,
                type: 'compliance',
                severity: 'medium',
                date: new Date().toISOString().split('T')[0],
                description: `Administrative notice countersigned and dispatched by Nodal Officer under MoSPI Sec 7.4.`,
                status: 'dispatched'
            });
            const alertBadge = document.getElementById('sidebarAlertBadge');
            if (alertBadge) {
                const count = parseInt(alertBadge.textContent) || 0;
                alertBadge.textContent = count + 1;
            }
        }

        // Smoothly close modal after 1.2s and reset button state
        setTimeout(() => {
            window.closeModal('projectNoticeModal');
            if (dispatchBtn) {
                dispatchBtn.disabled = false;
                dispatchBtn.innerHTML = '✍️ Countersign & Dispatch Notice';
                dispatchBtn.style.background = '#0284c7';
                dispatchBtn.style.boxShadow = '0 3px 10px rgba(2,132,199,0.35)';
                dispatchBtn.style.cursor = 'pointer';
            }
        }, 1200);
    }, 450);
};


// Executive Audit Scan Results Modal Initializer
window.showAuditScanModal = function (summary) {
    let modal = document.getElementById('aiAuditScanModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'aiAuditScanModal';
        document.body.appendChild(modal);
    }

    // Modal overlay styling with solid backdrop - hidden by default
    modal.style.cssText = "position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;background:rgba(15,23,42,0.85)!important;backdrop-filter:blur(8px)!important;align-items:center!important;justify-content:center!important;z-index:999999!important;padding:16px!important;box-sizing:border-box!important;display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;";

    const { totalScanned = 20, dupCount = 2, anomCount = 3, duplicates = [], anomalies = [] } = summary || {};

    let findingsHtml = '';
    if (duplicates.length > 0 || anomalies.length > 0) {
        duplicates.slice(0, 2).forEach(d => {
            const wA = d.workA || {};
            const wB = d.workB || {};
            findingsHtml += `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 14px;background:#fef2f2;border-radius:8px;border-left:4px solid #ef4444;margin-bottom:8px;">
                    <div>
                        <strong style="color:#991b1b;font-size:0.86rem;">⚠️ Geo-Proximity Duplicate Detected (${d.distanceMeters || 120}m):</strong>
                        <span style="font-size:0.84rem;color:#0f172a;font-weight:700;">${wA.id || 'Work A'} & ${wB.id || 'Work B'}</span>
                        <div style="font-size:0.75rem;color:#64748b;margin-top:3px;">${wA.name || 'Sanctioned Asset'} — ${d.recommendation || 'Conduct joint physical audit before clearing next milestone installment.'}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="window.closeModal('aiAuditScanModal');window.openForensicModal('${wA.id || 'WRK-2026-UP-001'}','work')" style="font-size:0.75rem;padding:5px 12px;background:#0284c7;color:#fff;border:none;border-radius:6px;cursor:pointer;white-space:nowrap;font-weight:600;">
                        🔍 Audit Dossier
                    </button>
                </div>
            `;
        });
        anomalies.slice(0, 2).forEach(a => {
            findingsHtml += `
                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 14px;background:#fffbeb;border-radius:8px;border-left:4px solid #f59e0b;margin-bottom:8px;">
                    <div>
                        <strong style="color:#b45309;font-size:0.86rem;">⚡ ${a.type || 'CHRONIC EXECUTION DELAY'}:</strong>
                        <span style="font-size:0.84rem;color:#0f172a;font-weight:700;">${a.workId || 'WRK'} (${a.district || 'State Division'})</span>
                        <div style="font-size:0.75rem;color:#64748b;margin-top:3px;">${a.evidence || a.guidelineViolation || 'Mandatory milestone delivery threshold breached.'}</div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="window.closeModal('aiAuditScanModal');window.openForensicModal('${a.workId || 'WRK-2026-UP-004'}','work')" style="font-size:0.75rem;padding:5px 12px;background:#0284c7;color:#fff;border:none;border-radius:6px;cursor:pointer;white-space:nowrap;font-weight:600;">
                        🔍 Audit Dossier
                    </button>
                </div>
            `;
        });
    } else {
        findingsHtml = `
            <div style="padding:14px;background:#f0fdf4;border-radius:8px;color:#166534;font-size:0.86rem;border:1px solid #bbf7d0;">
                ✓ Portfolio scan complete. All 20 projects meet baseline MoSPI milestone disbursement benchmarks.
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="forensic-modal-card" style="background:#ffffff!important;border-radius:12px!important;width:100%!important;max-width:820px!important;height:auto!important;max-height:88vh!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;box-shadow:0 25px 60px -15px rgba(0,0,0,0.7)!important;border:1px solid #94a3b8!important;position:relative!important;opacity:1!important;visibility:visible!important;">
            <!-- Pinned Executive Header -->
            <div class="modal-header" style="flex-shrink:0!important;background:#0f172a!important;color:#ffffff!important;padding:16px 24px!important;border-bottom:3px solid #0284c7!important;display:flex!important;align-items:center!important;justify-content:space-between!important;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.6rem;line-height:1;">⚡</span>
                    <div>
                        <h3 class="modal-title" style="color:#ffffff!important;font-size:1.05rem!important;font-weight:700!important;margin:0!important;">
                            Autonomous AI Audit Scan — Portfolio Inspection
                        </h3>
                        <span style="font-size:0.72rem;color:#94a3b8;letter-spacing:0.04em;font-weight:600;">MULTI-FACTOR GEOSPATIAL TELEMETRY & PFMS DISBURSEMENT AUDIT</span>
                    </div>
                </div>
                <button class="modal-close-btn" onclick="window.closeModal('aiAuditScanModal')" title="Close Scan Modal" style="color:#ffffff!important;font-size:1.4rem!important;background:rgba(255,255,255,0.1)!important;border:none!important;cursor:pointer!important;padding:4px 12px!important;border-radius:6px!important;transition:all 0.15s ease;">✕</button>
            </div>

            <!-- Scrollable Content Body -->
            <div class="forensic-modal-body" style="flex:1 1 auto!important;overflow-y:auto!important;padding:24px 28px!important;background:#ffffff!important;color:#1e293b!important;font-size:0.90rem!important;line-height:1.65!important;">
                <!-- Scan Summary KPI Strip -->
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;">
                    <div style="background:#f8fafc;padding:14px;border:1px solid #e2e8f0;border-radius:8px;text-align:center;">
                        <div style="font-size:0.72rem;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.03em;">Works Scanned</div>
                        <div style="font-size:1.4rem;font-weight:800;color:#0284c7;margin:4px 0;">${totalScanned}</div>
                        <div style="font-size:0.72rem;color:#10b981;font-weight:600;">100% Portfolio Coverage</div>
                    </div>
                    <div style="background:#fef2f2;padding:14px;border:1px solid #fecaca;border-radius:8px;text-align:center;">
                        <div style="font-size:0.72rem;color:#991b1b;text-transform:uppercase;font-weight:700;letter-spacing:0.03em;">Duplicate Clusters</div>
                        <div style="font-size:1.4rem;font-weight:800;color:#dc2626;margin:4px 0;">${dupCount}</div>
                        <div style="font-size:0.72rem;color:#b91c1c;font-weight:600;">Geo-proximity overlaps</div>
                    </div>
                    <div style="background:#fff7ed;padding:14px;border:1px solid #fed7aa;border-radius:8px;text-align:center;">
                        <div style="font-size:0.72rem;color:#9a3412;text-transform:uppercase;font-weight:700;letter-spacing:0.03em;">Anomalies Flagged</div>
                        <div style="font-size:1.4rem;font-weight:800;color:#ea580c;margin:4px 0;">${anomCount}</div>
                        <div style="font-size:0.72rem;color:#c2410c;font-weight:600;">PFMS drawdown breaches</div>
                    </div>
                </div>

                <!-- Priority Anomaly Findings -->
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:16px;">
                    <div style="font-size:0.88rem;font-weight:800;color:#0f172a;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                        <span>🚨</span> Critical Findings Requiring Executive Action:
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        ${findingsHtml}
                    </div>
                </div>

                <div style="font-size:0.80rem;color:#64748b;line-height:1.5;background:#f1f5f9;padding:10px 14px;border-radius:6px;">
                    ℹ️ All early warning indicators and risk scores have been automatically updated across the <strong>Alerts</strong> and <strong>Projects</strong> modules in accordance with MoSPI Guidelines.
                </div>
            </div>

            <!-- Pinned Executive Footer -->
            <div class="modal-footer" style="flex-shrink:0!important;background:#f8fafc!important;border-top:1px solid #e2e8f0!important;padding:14px 24px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;">
                <span class="forensic-meta-badge" style="margin:0;background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:600;">MoSPI Neural Auditor Active</span>
                <div style="display:flex;gap:8px;">
                    <a href="${window.location.pathname.includes('/pages/') ? 'alerts.html' : 'pages/alerts.html'}" class="btn btn-secondary btn-sm" style="padding:6px 12px;font-weight:600;background:#ffffff;border:1px solid #cbd5e1;border-radius:6px;color:#0f172a;text-decoration:none;">View All Alerts</a>
                    <button class="btn btn-primary btn-sm" onclick="window.closeModal('aiAuditScanModal')" style="padding:6px 16px;font-weight:600;background:#0f172a;color:#ffffff;border:none;border-radius:6px;cursor:pointer;">Dismiss</button>
                </div>
            </div>
        </div>
    `;

    window.openModal('aiAuditScanModal');
};

// Forensic Analysis Modal Initializer
function initForensicModal() {
    let modal = document.getElementById('aiForensicModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'aiForensicModal';
        document.body.appendChild(modal);
    }

    // Modal overlay styling with solid backdrop - hidden by default
    modal.style.cssText = "position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;width:100vw!important;height:100vh!important;background:rgba(15,23,42,0.85)!important;backdrop-filter:blur(8px)!important;align-items:center!important;justify-content:center!important;z-index:999999!important;padding:16px!important;box-sizing:border-box!important;display:none!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;";

    modal.innerHTML = `
        <div class="forensic-modal-card" style="background:#ffffff!important;border-radius:12px!important;width:100%!important;max-width:960px!important;height:88vh!important;max-height:88vh!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;box-shadow:0 25px 60px -15px rgba(0,0,0,0.7)!important;border:1px solid #94a3b8!important;position:relative!important;opacity:1!important;visibility:visible!important;">
            <!-- Pinned Executive Header -->
            <div class="modal-header" style="flex-shrink:0!important;background:#0f172a!important;color:#ffffff!important;padding:16px 24px!important;border-bottom:3px solid #0284c7!important;display:flex!important;align-items:center!important;justify-content:space-between!important;">
                <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:1.6rem;line-height:1;">🏛️</span>
                    <div>
                        <h3 class="modal-title" id="forensicModalTitle" style="color:#ffffff!important;font-size:1.05rem!important;font-weight:700!important;margin:0!important;">
                            MoSPI AI Forensic Audit Dossier
                        </h3>
                        <span style="font-size:0.72rem;color:#94a3b8;letter-spacing:0.04em;font-weight:600;">STATUTORY COMPLIANCE & FRAUD DIAGNOSTIC REPORT</span>
                    </div>
                </div>
                <button class="modal-close-btn" onclick="window.closeModal('aiForensicModal')" title="Close Dossier" style="color:#ffffff!important;font-size:1.4rem!important;background:rgba(255,255,255,0.1)!important;border:none!important;cursor:pointer!important;padding:4px 12px!important;border-radius:6px!important;transition:all 0.15s ease;">✕</button>
            </div>

            <!-- Scrollable Content Body -->
            <div class="forensic-modal-body" id="forensicModalContent" style="flex:1 1 auto!important;overflow-y:auto!important;padding:24px 28px!important;background:#ffffff!important;color:#1e293b!important;font-size:0.90rem!important;line-height:1.65!important;">
                <div style="text-align:center;padding:45px 20px;">
                    <div class="spinner" style="display:inline-block;width:32px;height:32px;border:3px solid #0284c7;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                    <h4 style="margin-top:16px;color:#0f172a;font-size:1.02rem;">Executing Neural Compliance Inspection</h4>
                    <p style="margin-top:6px;font-size:0.86rem;color:#64748b;">Cross-referencing Public Financial Management System (PFMS) disbursements, Junior Engineer measurement books, and geospatial telemetry...</p>
                </div>
            </div>

            <!-- Pinned Executive Footer -->
            <div class="modal-footer" style="flex-shrink:0!important;background:#f8fafc!important;border-top:1px solid #e2e8f0!important;padding:14px 24px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;flex-wrap:wrap!important;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span id="forensicSourceBadge" class="forensic-meta-badge" style="margin:0;background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;padding:4px 10px;border-radius:6px;font-size:0.75rem;font-weight:600;">MoSPI Neural Auditor Active</span>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button class="btn btn-secondary btn-sm" id="btnCopyDossier" onclick="window.copyForensicDossier()" title="Copy entire dossier as formatted text for official dispatch" style="padding:6px 12px;font-weight:600;background:#ffffff;border:1px solid #cbd5e1;border-radius:6px;color:#0f172a;cursor:pointer;">
                        📋 Copy Dossier
                    </button>
                    <button class="btn btn-warning btn-sm" id="btnForensicDispatchNotice" onclick="window.dispatchShowCauseNotice()" style="background:#ea580c!important;color:#fff!important;border:none!important;padding:6px 12px;font-weight:600;border-radius:6px;cursor:pointer;" title="Dispatch official statutory show-cause notice to Implementing Agency">
                        ✉️ Issue Notice
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.print()" title="Print formal paper dossier" style="padding:6px 12px;font-weight:600;background:#ffffff;border:1px solid #cbd5e1;border-radius:6px;color:#0f172a;cursor:pointer;">
                        🖨️ Print / PDF
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="window.closeModal('aiForensicModal')" style="padding:6px 16px;font-weight:600;background:#0f172a;color:#ffffff;border:none;border-radius:6px;cursor:pointer;">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Global variable storing currently loaded dossier plain text for one-click copy
window._currentForensicDossierText = "";
window._currentForensicTargetId = "";

window.copyForensicDossier = function () {
    if (!window._currentForensicDossierText) {
        window.showMpladsToast('No dossier content available to copy.', '⚠️');
        return;
    }
    navigator.clipboard.writeText(window._currentForensicDossierText).then(() => {
        window.showMpladsToast(`✓ Official Dossier (${window._currentForensicTargetId}) copied to clipboard!`, '📋');
    }).catch(() => {
        window.showMpladsToast('Unable to access system clipboard.', '⚠️');
    });
};

window.dispatchShowCauseNotice = function () {
    const id = window._currentForensicTargetId || 'WRK-FLAGGED';
    window.showMpladsToast(`✓ Statutory Show-Cause Notice dispatched for Case ${id}!`, '✉️');
};

// Open Forensic Analysis for Any Item and render formatted, usable executive dossier
window.openForensicModal = async function (id, type = 'alert') {
    initForensicModal();
    window.openModal('aiForensicModal');

    const contentEl = document.getElementById('forensicModalContent');
    const titleEl = document.getElementById('forensicModalTitle');
    const sourceEl = document.getElementById('forensicSourceBadge');

    window._currentForensicTargetId = id;

    if (titleEl) titleEl.textContent = `MoSPI AI Forensic Audit Dossier: ${id}`;
    if (contentEl) {
        contentEl.innerHTML = `
            <div style="text-align:center;padding:45px 20px;">
                <div class="spinner" style="display:inline-block;width:32px;height:32px;border:3px solid #0284c7;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></div>
                <h4 style="margin-top:16px;color:#0f172a;font-size:1.02rem;">Executing Neural Compliance Inspection</h4>
                <p style="margin-top:6px;font-size:0.86rem;color:#64748b;">Cross-referencing Public Financial Management System (PFMS) disbursements, Junior Engineer measurement books, and geospatial telemetry for <strong>${id}</strong>...</p>
            </div>
        `;
    }

    // Retrieve target item details from cache or demo data
    let targetWork = null;
    let targetAlert = null;
    const demoWorks = window.MPLADS_DEMO_DATA?.works || [];
    const demoAlerts = window.MPLADS_DEMO_DATA?.alerts || [];

    if (type === 'work' || (id && id.startsWith('WRK-'))) {
        targetWork = demoWorks.find(w => w.id === id);
    } else {
        targetAlert = demoAlerts.find(a => a.id === id);
        if (targetAlert && targetAlert.workId) {
            targetWork = demoWorks.find(w => w.id === targetAlert.workId);
        }
    }

    try {
        let res;
        if (window.MPLADS_API && typeof window.MPLADS_API.explainAnomaly === 'function') {
            res = await window.MPLADS_API.explainAnomaly(id, type);
        } else {
            const apiBase = (window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl) ? window.MPLADS_CONFIG.getApiUrl() : (window.getApiBaseUrl ? window.getApiBaseUrl() : '/api');
            const fetchRes = await fetch(`${apiBase}/ai/explain`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, type })
            });
            res = await fetchRes.json();
        }

        const source = res?.source || 'Groq Cloud AI (Autonomous Forensic Engine)';
        if (sourceEl) sourceEl.textContent = source;

        const rawExplanation = res?.explanation || '';
        window._currentForensicDossierText = rawExplanation;

        // Render Usable Executive Dossier
        if (contentEl) {
            contentEl.innerHTML = renderForensicDossierHtml({
                id,
                type,
                targetWork,
                targetAlert,
                rawExplanation,
                source
            });
        }
    } catch (e) {
        if (contentEl) {
            contentEl.innerHTML = `
                <div style="padding:24px;background:#fef2f2;border:1px solid #fecaca;border-radius:8px;color:#991b1b;">
                    <strong>⚠️ Forensic Generation Error:</strong> ${e.message}<br>
                    <span style="font-size:0.82rem;color:#7f1d1d;margin-top:6px;display:inline-block;">
                        Please verify that the backend analytics server is active or valid Groq credentials are provided.
                    </span>
                </div>
            `;
        }
    }
};

// Executive Dossier HTML Generator
function renderForensicDossierHtml({ id, type, targetWork, targetAlert, rawExplanation, source }) {
    const workName = targetWork?.name || targetAlert?.description || 'MPLADS Infrastructure Asset Allocation';
    const district = targetWork?.district || targetAlert?.district || 'Lucknow';
    const severity = targetAlert?.severity || targetWork?.risk || 'HIGH';
    const approvedLakhs = targetWork?.approvedAmountLakhs ? `₹${targetWork.approvedAmountLakhs} Lakhs` : '₹75.00 Lakhs';
    const expenditureLakhs = targetWork?.expenditureLakhs ? `₹${targetWork.expenditureLakhs} Lakhs` : '₹30.00 Lakhs';
    const completionPct = targetWork?.completionPct !== undefined ? `${targetWork.completionPct}%` : '40%';
    const panchayat = targetWork?.panchayat || targetWork?.constituency || 'Central District Division';

    // Parse Markdown into structured HTML with proper tables, headers, and lists
    const formattedContent = parseAndFormatDossierContent(rawExplanation);

    const severityColor = severity === 'CRITICAL' ? '#dc2626' : (severity === 'HIGH' ? '#ea580c' : '#0284c7');
    const severityBg = severity === 'CRITICAL' ? '#fef2f2' : (severity === 'HIGH' ? '#fff7ed' : '#f0f9ff');

    return `
        <div class="forensic-dossier" style="background:#ffffff;color:#1e293b;font-family:'Inter',sans-serif;">
            <!-- Official Header & Insignia -->
            <div class="dossier-official-header" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px 20px;margin-bottom:20px;">
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;border-bottom:1px solid #e2e8f0;padding-bottom:12px;margin-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <span style="font-size:2rem;line-height:1;">🏛️</span>
                        <div>
                            <div style="font-size:0.95rem;font-weight:800;color:#0f172a;letter-spacing:0.02em;">Government of India • Ministry of Statistics & Programme Implementation</div>
                            <div style="font-size:0.75rem;color:#64748b;font-weight:600;">National MPLADS Monitoring & Analytics Platform • Statutory AI Forensic Audit</div>
                        </div>
                    </div>
                    <div style="background:#fef2f2;border:1px solid #fecaca;color:#dc2626;padding:4px 12px;border-radius:20px;font-size:0.72rem;font-weight:700;display:flex;align-items:center;gap:6px;letter-spacing:0.05em;">
                        <span>🔴</span> STRICTLY OFFICIAL // STATUTORY RECORD
                    </div>
                </div>
                <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;font-size:0.78rem;color:#475569;">
                    <div><strong style="color:#0f172a;">Dossier Ref:</strong> <code style="background:#e2e8f0;color:#0f172a;padding:2px 6px;border-radius:4px;font-weight:700;">MOSPI/AUDIT/2026/${id}</code></div>
                    <div><strong style="color:#0f172a;">Analysis Date:</strong> ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                    <div><strong style="color:#0f172a;">Audit Engine:</strong> ${source.includes('Groq') ? 'Groq Neural (Autonomous Forensic Matrix)' : 'MoSPI Statutory Matrix'}</div>
                </div>
            </div>

            <!-- Key Metrics Strip -->
            <div class="dossier-metrics-strip" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin-bottom:20px;">
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;">
                    <div style="font-size:0.72rem;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Target Asset / Notice</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#0284c7;margin:4px 0;">${id}</div>
                    <div style="font-size:0.75rem;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${workName}">${workName}</div>
                </div>
                <div style="background:${severityBg};border:1px solid ${severityColor}40;border-radius:8px;padding:12px 16px;">
                    <div style="font-size:0.72rem;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Risk Classification</div>
                    <div style="font-size:1.1rem;font-weight:800;color:${severityColor};margin:4px 0;">● ${severity} RISK</div>
                    <div style="font-size:0.75rem;color:#475569;">Statutory SLA Active</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;">
                    <div style="font-size:0.72rem;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Jurisdiction</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#0f172a;margin:4px 0;">${district}</div>
                    <div style="font-size:0.75rem;color:#475569;">${panchayat}</div>
                </div>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;">
                    <div style="font-size:0.72rem;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:0.04em;">Expenditure / Sanction</div>
                    <div style="font-size:1.1rem;font-weight:800;color:#b91c1c;margin:4px 0;">${expenditureLakhs} / ${approvedLakhs}</div>
                    <div style="font-size:0.75rem;color:#475569;">Reported Progress: ${completionPct}</div>
                </div>
            </div>

            <!-- Formatted Content Card -->
            <div class="dossier-section-card" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:10px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                ${formattedContent}
            </div>
        </div>
    `;
}

// Markdown Parser that converts tables, headers, lists, and statutes into clean executive HTML
function parseAndFormatDossierContent(rawText) {
    if (!rawText) return '<p>No diagnostic data available.</p>';

    const lines = rawText.split('\n');
    let out = [];
    let inTable = false;
    let tableHeaders = [];
    let tableRows = [];
    let inList = false;

    function flushTable() {
        if (!inTable) return;
        if (tableHeaders.length > 0 || tableRows.length > 0) {
            let html = '<div class="dossier-table-container" style="overflow-x:auto;margin:18px 0;border-radius:8px;border:1px solid #cbd5e1;box-shadow:0 1px 3px rgba(0,0,0,0.06);background:#ffffff;">';
            html += '<table class="dossier-table" style="width:100%;border-collapse:collapse;font-size:0.86rem;font-family:\'Inter\',sans-serif;background:#ffffff;">';
            if (tableHeaders.length > 0) {
                html += '<thead><tr style="background:#0f172a;color:#ffffff;">';
                tableHeaders.forEach(h => {
                    html += `<th style="padding:12px 16px;text-align:left;font-weight:700;border-bottom:2px solid #0284c7;color:#ffffff;letter-spacing:0.02em;">${formatInlineMarkdown(h)}</th>`;
                });
                html += '</tr></thead>';
            }
            if (tableRows.length > 0) {
                html += '<tbody>';
                tableRows.forEach((row, rIdx) => {
                    const rowBg = rIdx % 2 === 0 ? '#ffffff' : '#f8fafc';
                    html += `<tr style="background:${rowBg};border-bottom:1px solid #e2e8f0;transition:background 0.15s ease;">`;
                    row.forEach((cell, cIdx) => {
                        const isFirstCol = cIdx === 0;
                        const cellStyle = isFirstCol ? 'font-weight:600;color:#0f172a;' : 'color:#334155;';
                        html += `<td style="padding:11px 16px;${cellStyle}line-height:1.55;vertical-align:top;">${formatInlineMarkdown(cell)}</td>`;
                    });
                    html += '</tr>';
                });
                html += '</tbody>';
            }
            html += '</table></div>';
            out.push(html);
        }
        inTable = false;
        tableHeaders = [];
        tableRows = [];
    }

    function flushList() {
        if (!inList) return;
        out.push('</div>');
        inList = false;
    }

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();

        // Suppress isolated VIOLATION keywords
        if (line.toUpperCase() === 'VIOLATION' || line.toUpperCase() === '**VIOLATION**') {
            continue;
        }

        // 1. Detect Markdown Table Rows (| Col 1 | Col 2 |)
        if (line.startsWith('|') && line.endsWith('|')) {
            flushList();
            const cells = line.slice(1, -1).split('|').map(c => c.trim());
            // Check if this is a separator line (|---|---|---|)
            if (cells.every(c => /^:?-+:?$/.test(c) || c === '')) {
                inTable = true;
                continue;
            }
            if (!inTable) {
                tableHeaders = cells;
                inTable = true;
            } else {
                tableRows.push(cells);
            }
            continue;
        } else {
            flushTable();
        }

        // 2. Horizontal separator (--- or ***)
        if (/^---+$/.test(line) || /^\*\*\*+$/.test(line)) {
            flushList();
            out.push('<hr class="dossier-divider" style="margin:20px 0;border:none;border-top:1px solid #e2e8f0;">');
            continue;
        }

        // 3. Headings
        if (line.startsWith('#### ')) {
            flushList();
            out.push(`<h5 style="margin:16px 0 6px;color:#0f172a;font-size:0.95rem;font-weight:700;">${formatInlineMarkdown(line.slice(5))}</h5>`);
            continue;
        }
        if (line.startsWith('### ')) {
            flushList();
            out.push(`
                <div class="dossier-section-heading" style="display:flex;align-items:center;gap:8px;font-size:1.05rem;font-weight:700;color:#0f172a;margin:22px 0 10px;padding-bottom:6px;border-bottom:2px solid #e2e8f0;">
                    <span style="font-size:1.2rem;">📌</span>
                    <span>${formatInlineMarkdown(line.slice(4))}</span>
                </div>
            `);
            continue;
        }
        if (line.startsWith('## ')) {
            flushList();
            out.push(`
                <div class="dossier-section-heading" style="display:flex;align-items:center;gap:8px;font-size:1.15rem;font-weight:800;color:#0284c7;margin:26px 0 12px;padding-bottom:8px;border-bottom:2px solid #0284c7;">
                    <span style="font-size:1.3rem;">⚖️</span>
                    <span>${formatInlineMarkdown(line.slice(3))}</span>
                </div>
            `);
            continue;
        }
        if (line.startsWith('# ')) {
            flushList();
            out.push(`<h3 style="margin:20px 0 10px;color:#0f172a;font-size:1.25rem;font-weight:800;border-bottom:2px solid #0f172a;padding-bottom:6px;">${formatInlineMarkdown(line.slice(2))}</h3>`);
            continue;
        }

        // 4. Actionable Numbered Checklist (1. Action ...)
        const numMatch = line.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
            flushTable();
            if (!inList) {
                out.push('<div class="dossier-action-checklist" style="display:flex;flex-direction:column;gap:10px;margin:14px 0;">');
                inList = true;
            }
            out.push(`
                <div class="dossier-action-step" style="display:flex;align-items:flex-start;gap:14px;padding:12px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:8px;">
                    <span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;background:#0284c7;color:#ffffff;border-radius:50%;font-size:0.75rem;font-weight:800;flex-shrink:0;margin-top:2px;">${numMatch[1]}</span>
                    <div style="font-size:0.88rem;line-height:1.55;color:#1e293b;flex:1;">${formatInlineMarkdown(numMatch[2])}</div>
                </div>
            `);
            continue;
        }

        // 5. Bullet List Items (- item or * item or • item)
        const bulletMatch = line.match(/^[-*•]\s+(.*)/);
        if (bulletMatch) {
            flushTable();
            if (!inList) {
                out.push('<div class="dossier-bullet-list" style="display:flex;flex-direction:column;gap:8px;margin:12px 0;">');
                inList = true;
            }
            const itemText = formatInlineMarkdown(bulletMatch[1]);
            const isViolation = /para\s+\d/i.test(itemText) || /violation/i.test(itemText) || /breach/i.test(itemText);
            if (isViolation) {
                out.push(`
                    <div class="dossier-violation-item" style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#fef2f2;border:1px solid #fecaca;border-radius:6px;font-size:0.86rem;color:#991b1b;line-height:1.5;">
                        <span style="background:#dc2626;color:#ffffff;padding:2px 8px;border-radius:4px;font-size:0.70rem;font-weight:700;letter-spacing:0.04em;flex-shrink:0;">BREACH</span>
                        <div style="flex:1;">${itemText}</div>
                    </div>
                `);
            } else {
                out.push(`
                    <div class="dossier-bullet-item" style="display:flex;align-items:flex-start;gap:10px;padding:8px 12px;font-size:0.86rem;color:#334155;line-height:1.5;">
                        <span style="color:#0284c7;font-size:0.9rem;line-height:1.2;flex-shrink:0;">●</span>
                        <div style="flex:1;">${itemText}</div>
                    </div>
                `);
            }
            continue;
        }

        // Close list if non-list line encountered
        if (inList) {
            out.push('</div>');
            inList = false;
        }

        // Skip blank lines
        if (!line) {
            continue;
        }

        // 6. Clean pipe metadata rows like | District | Lucknow | | Category | ...
        if (line.includes('| |') || (line.startsWith('|') && line.includes(':'))) {
            const parts = line.split(/\|\s*\||\s*\|\s*/).map(p => p.trim()).filter(p => p.length > 0);
            out.push('<div style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0;">');
            parts.forEach(p => {
                out.push(`<span class="forensic-meta-badge" style="margin:0;background:#e0f2fe;border:1px solid #bae6fd;color:#0369a1;padding:4px 10px;border-radius:6px;font-size:0.82rem;font-weight:600;">${formatInlineMarkdown(p)}</span>`);
            });
            out.push('</div>');
            continue;
        }

        // Normal paragraph
        out.push(`<p style="margin:10px 0;line-height:1.68;color:#334155;">${formatInlineMarkdown(line)}</p>`);
    }

    flushTable();
    if (inList) {
        out.push('</div>');
        inList = false;
    }

    return out.join('\n');
}

function formatInlineMarkdown(str = '') {
    if (!str) return '';
    return str
        .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:700;color:inherit;">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em style="color:#475569;">$1</em>')
        .replace(/`(.*?)`/g, '<code style="background:#e0f2fe;color:#0369a1;padding:2px 6px;border-radius:4px;font-size:0.82rem;font-weight:600;border:1px solid #bae6fd;">$1</code>')
        .replace(/\b(Para\s+\d+(?:\.\d+)?(?:\s*\([^)]+\))?)\b/gi, '<span style="background:#dbeafe;color:#1e40af;padding:2px 8px;border-radius:12px;font-weight:700;font-size:0.78rem;border:1px solid #93c5fd;white-space:nowrap;display:inline-flex;align-items:center;gap:4px;">⚖️ $1</span>');
}

// Modal Helper Utility
function initModalSystem() {
    window.openModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            modal.style.setProperty('display', 'flex', 'important');
            modal.style.setProperty('opacity', '1', 'important');
            modal.style.setProperty('visibility', 'visible', 'important');
            modal.style.setProperty('pointer-events', 'auto', 'important');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            modal.style.setProperty('display', 'none', 'important');
            modal.style.setProperty('opacity', '0', 'important');
            modal.style.setProperty('visibility', 'hidden', 'important');
            modal.style.setProperty('pointer-events', 'none', 'important');
            document.body.style.overflow = '';
        }
    };

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                window.closeModal(overlay.id);
            }
        });
    });
}

// Check Backend Connectivity
async function checkBackendConnectivity() {
    if (window.MPLADS_API) {
        const status = await window.MPLADS_API.checkHealth();
        const badge = document.getElementById('backendStatusBadge');
        if (badge) {
            if (status.connected) {
                badge.className = 'badge badge-success';
                badge.style.background = '#15803d';
                badge.style.color = '#ffffff';
                badge.style.fontWeight = '700';
                badge.style.padding = '4px 10px';
                badge.style.borderRadius = '12px';
                badge.style.cursor = 'pointer';
                badge.style.boxShadow = '0 0 10px rgba(34, 197, 94, 0.4)';
                badge.innerHTML = '🟢 Backend Live & Connected';
                badge.title = `Connected to API at ${status.baseUrl || 'port 5000'} - Click for Connection Diagnostics`;
                badge.onclick = () => {
                    const isPages = window.location.pathname.includes('/pages/');
                    window.location.href = isPages ? '../connection-test.html' : 'connection-test.html';
                };
            } else {
                badge.className = 'badge badge-warning';
                badge.innerHTML = '⚡ Client Standalone Mode';
            }
        }
    }
}

// Auto-poll connectivity every 25 seconds
setInterval(checkBackendConnectivity, 25000);

// ==============================================================================
// Global Download Storage Location Display
// Shows on-screen popup indicating where downloaded files are saved on workstation
// ==============================================================================
window.showDownloadLocationToast = function (fileName, title = 'Downloaded Report') {
    const existing = document.getElementById('globalDownloadLocationToastContainer');
    if (existing) existing.remove();

    const defaultDownloadPath = `Downloads/${fileName}`;

    const container = document.createElement('div');
    container.id = 'globalDownloadLocationToastContainer';
    container.className = 'download-location-toast-container';

    container.innerHTML = `
        <div class="download-location-toast">
            <div class="download-location-header">
                <div class="download-location-title">
                    <span>📥</span>
                    <span>Download Ready • ${title}</span>
                </div>
                <button type="button" class="download-location-close" onclick="document.getElementById('globalDownloadLocationToastContainer')?.remove()" title="Dismiss notification">✕</button>
            </div>
            <div style="font-size:0.82rem;color:#cbd5e1;line-height:1.4;">
                File has been generated and saved to your local workstation:
            </div>
            <div class="download-location-path-box">
                <div class="download-path-label">
                    <span>SYSTEM STORAGE PATH</span>
                    <span style="color:#38bdf8;font-weight:700;">Default Downloads</span>
                </div>
                <div class="download-path-text" id="dlPathText">${defaultDownloadPath}</div>
            </div>
            <div class="download-location-actions">
                <span>💡 Press <strong>Ctrl + J</strong> to open browser downloads</span>
                <button type="button" class="download-copy-btn" id="dlCopyBtn">📋 Copy Path</button>
            </div>
        </div>
    `;

    document.body.appendChild(container);

    const copyBtn = document.getElementById('dlCopyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(defaultDownloadPath).then(() => {
                    copyBtn.textContent = '✅ Copied!';
                    setTimeout(() => { copyBtn.textContent = '📋 Copy Path'; }, 2500);
                }).catch(() => {
                    copyBtn.textContent = 'Path Selected';
                });
            }
        });
    }

    // Auto dismiss after 9 seconds with smooth fade
    setTimeout(() => {
        const el = document.getElementById('globalDownloadLocationToastContainer');
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(-10px)';
            el.style.transition = 'all 0.4s ease';
            setTimeout(() => el.remove(), 400);
        }
    }, 9000);
};

