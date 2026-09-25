/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Authentication & Succession Controller
 * 
 * Handles multi-district authentication, confidential credential validation,
 * officer induction & succession registration, and governance directory viewer.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initGhostFibersBackground();
    populatePanIndiaDistricts();
    initAuthForm();
    initRegisterForm();
    checkExistingSession();
});

// Initialize GhostFibers dynamic WebGL2 background
function initGhostFibersBackground() {
    const canvas = document.getElementById('ghostFibersCanvas');
    if (canvas && window.GhostFibers && typeof window.GhostFibers.init === 'function') {
        try {
            window.GhostFibers.init(canvas, {
                speed: 0.42,
                lineColor: [0.0, 0.72, 1.0], // Azure/Cyan
                glowColor: [0.15, 0.38, 0.95] // Electric Royal Blue
            });
        } catch (e) {
            console.warn('[Auth] GhostFibers canvas initialization error:', e.message);
        }
    }
}

// Populate Pan-India Districts & States
function populatePanIndiaDistricts() {
    const regDistrict = document.getElementById('regDistrict');
    const rosterFilter = document.getElementById('rosterDistrictFilter');

    if (regDistrict && window.renderDistrictOptions) {
        window.renderDistrictOptions(regDistrict, '', {
            promptOption: '-- Select Assigned District --'
        });
    }

    if (rosterFilter) {
        initRosterDistrictFilter();
    }
}

// Initialize Roster District Filter with authorities and divisions
function initRosterDistrictFilter(totalCount = 34) {
    const rosterFilter = document.getElementById('rosterDistrictFilter');
    if (!rosterFilter) return;

    const districtsList = window.PILOT_DISTRICTS || [
        "Varanasi", "Gorakhpur", "Prayagraj", "Lucknow", "Ayodhya", "Kanpur Nagar", "Mirzapur", "Jaunpur"
    ];

    let filterHtml = `<option value="">All Districts & Authorities (${totalCount} Officers)</option>`;
    filterHtml += `<optgroup label="Central & State Authorities">`;
    filterHtml += `<option value="National (All Districts)">🇮🇳 National Central Admin (MoSPI)</option>`;
    filterHtml += `<option value="Uttar Pradesh (State)">🏛️ Uttar Pradesh State Nodal (SNA)</option>`;
    filterHtml += `</optgroup>`;

    filterHtml += `<optgroup label="Uttar Pradesh Districts">`;
    districtsList.forEach(d => {
        filterHtml += `<option value="${d}">${d}</option>`;
    });
    filterHtml += `</optgroup>`;

    rosterFilter.innerHTML = filterHtml;
}

// Switch between Login and Registration Tabs
window.switchAuthTab = function (tab) {
    hideAlerts();
    const loginBtn = document.getElementById('tabBtnLogin');
    const regBtn = document.getElementById('tabBtnRegister');
    const panelLogin = document.getElementById('panelLogin');
    const panelRegister = document.getElementById('panelRegister');

    if (tab === 'register') {
        loginBtn?.classList.remove('active');
        regBtn?.classList.add('active');
        panelLogin?.classList.remove('active');
        panelRegister?.classList.add('active');
    } else {
        regBtn?.classList.remove('active');
        loginBtn?.classList.add('active');
        panelRegister?.classList.remove('active');
        panelLogin?.classList.add('active');

        // Pre-fill last registered email if login email field is empty
        const emailInput = document.getElementById('loginEmail');
        if (emailInput && !emailInput.value) {
            try {
                const lastEmail = localStorage.getItem('mplads_last_registered_email');
                if (lastEmail) emailInput.value = lastEmail;
            } catch (e) {}
        }
    }
};

// Password Toggle
window.togglePwdVisibility = function (inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isPwd = input.type === 'password';
    input.type = isPwd ? 'text' : 'password';
    if (btn) btn.textContent = isPwd ? '🙈' : '👁️';
};

// Check Existing Active Incumbent when selecting District and Role in Registration
window.checkIncumbent = async function () {
    const district = document.getElementById('regDistrict')?.value;
    const role = document.getElementById('regRole')?.value;
    const banner = document.getElementById('incumbentBanner');

    if (!district || !role) {
        if (banner) banner.style.display = 'none';
        return;
    }

    let officers = [];
    if (window.MPLADS_API) {
        officers = await window.MPLADS_API.getOfficers(district);
    } else {
        officers = (window.MPLADS_DEMO_DATA?.officers || []).filter(o => o.district.toLowerCase() === district.toLowerCase());
    }

    const incumbent = officers.find(o => 
        o.district.toLowerCase() === district.toLowerCase() && 
        o.role.toLowerCase() === role.toLowerCase() && 
        o.status === 'ACTIVE'
    );

    if (banner) {
        if (incumbent) {
            banner.innerHTML = `
                <strong>⚠️ Active Incumbent Identified:</strong><br>
                Current <strong>${incumbent.role}</strong> of <strong>${incumbent.district}</strong> is <strong>${incumbent.name}</strong> (ID: <code>${incumbent.id}</code>).<br>
                <span style="font-size:0.74rem;color:#1e3a8a;margin-top:2px;display:inline-block;">
                    Registering will record your official appointment and formally mark ${incumbent.name} as relieved due to resignation or transfer.
                </span>
            `;
            banner.style.display = 'block';
        } else {
            banner.innerHTML = `
                <strong>ℹ️ Vacancy / Open Charge:</strong> No active incumbent currently registered for ${role} in ${district}. You will be inducted as the primary nodal officer.
            `;
            banner.style.display = 'block';
        }
    }
};

// Alert Helpers
function showError(msg) {
    const errEl = document.getElementById('authErrorMessage');
    const succEl = document.getElementById('authSuccessMessage');
    if (succEl) succEl.style.display = 'none';
    if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
        errEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function showSuccess(msg) {
    const errEl = document.getElementById('authErrorMessage');
    const succEl = document.getElementById('authSuccessMessage');
    if (errEl) errEl.style.display = 'none';
    if (succEl) {
        succEl.innerHTML = msg;
        succEl.style.display = 'block';
        succEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function hideAlerts() {
    const errEl = document.getElementById('authErrorMessage');
    const succEl = document.getElementById('authSuccessMessage');
    if (errEl) errEl.style.display = 'none';
    if (succEl) succEl.style.display = 'none';
}

// Initialize Login Form
function initAuthForm() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlerts();

        const email = emailInput?.value.trim();
        const password = passwordInput?.value;

        if (!email || !password) {
            showError('Please enter both your official NIC/Gov email (or Officer ID) and password.');
            return;
        }

        // Set Loading State
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner" style="display:inline-block;width:15px;height:15px;border:2px solid #ffffff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></span> Verifying Official Credentials...`;
        }

        try {
            let res;
            if (window.MPLADS_API && typeof window.MPLADS_API.login === 'function') {
                res = await window.MPLADS_API.login(email, password);
            } else {
                // Direct fetch fallback using dynamic API Base URL
                const apiBase = (window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl) ? window.MPLADS_CONFIG.getApiUrl() : (window.getApiBaseUrl ? window.getApiBaseUrl() : '/api');
                const raw = await fetch(`${apiBase}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                res = await raw.json();
            }

            if (res && res.success) {
                if (res.user) {
                    const sessionObj = {
                        id: res.user.id,
                        name: res.user.name,
                        email: res.user.email,
                        role: res.user.role,
                        roleCode: res.user.roleCode || 'DM',
                        district: res.user.district,
                        state: res.user.state || 'Uttar Pradesh',
                        contact: res.user.contact,
                        avatar: res.user.avatar || (window.generateOfficerAvatar ? window.generateOfficerAvatar(res.user.name, res.user.role) : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&h=160&q=80"),
                        token: res.token || `MPLADS-AUTH-${Date.now()}`,
                        loginTime: new Date().toISOString()
                    };
                    try {
                        localStorage.setItem('mplads_user_session', JSON.stringify(sessionObj));
                        sessionStorage.setItem('mplads_user_session', JSON.stringify(sessionObj));
                        document.cookie = "mplads_session=active; path=/; max-age=86400; SameSite=Lax";
                        if (window.MPLADS_DEMO_DATA) {
                            window.MPLADS_DEMO_DATA.currentUser = sessionObj;
                        }
                    } catch (err) {}
                }
                showSuccess(`✓ Verified: Welcome, <strong>${res.user?.name || 'Officer'}</strong> (${res.user?.role} • ${res.user?.district}). Redirecting...`);
                setTimeout(() => {
                    const targetUrl = window.location.pathname.includes('/pages/') ? '../index.html?auth=1' : 'index.html?auth=1';
                    window.location.href = targetUrl;
                }, 900);
            } else {
                showError(res?.message || 'Authentication failed. Please check your credentials or review the Incumbent Roster.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Sign In to Secure Portal';
                }
            }
        } catch (error) {
            showError(`Unable to complete authentication: ${error.message}`);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Sign In to Secure Portal';
            }
        }
    });
}

// Initialize Registration Form
function initRegisterForm() {
    const regForm = document.getElementById('registerForm');
    const submitBtn = document.getElementById('regSubmitBtn');

    if (!regForm) return;

    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideAlerts();

        const district = document.getElementById('regDistrict')?.value;
        const role = document.getElementById('regRole')?.value;
        const name = document.getElementById('regName')?.value.trim();
        const email = document.getElementById('regEmail')?.value.trim();
        const contact = document.getElementById('regContact')?.value.trim();
        const officerId = document.getElementById('regOfficerId')?.value.trim();
        const joiningOrder = document.getElementById('regJoiningOrder')?.value.trim();
        const successionType = document.getElementById('regSuccessionType')?.value;
        const password = document.getElementById('regPassword')?.value;
        const confirmPassword = document.getElementById('regConfirmPassword')?.value;

        if (!district || !role || !name || !email || !password) {
            showError('Please fill out all mandatory fields marked with an asterisk (*).');
            return;
        }

        if (password !== confirmPassword) {
            showError('Security validation error: Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters in length.');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="spinner" style="display:inline-block;width:15px;height:15px;border:2px solid #ffffff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></span> Registering Cadre Induction...`;
        }

        try {
            const resolvedState = window.getStateForDistrict ? window.getStateForDistrict(district) : 'Uttar Pradesh';
            const payload = {
                name,
                email,
                role,
                district,
                state: resolvedState,
                contact,
                officerId,
                joiningOrder,
                successionType,
                password
            };

            let res;
            if (window.MPLADS_API && typeof window.MPLADS_API.register === 'function') {
                res = await window.MPLADS_API.register(payload);
            } else {
                const apiBase = (window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl) ? window.MPLADS_CONFIG.getApiUrl() : (window.getApiBaseUrl ? window.getApiBaseUrl() : '/api');
                const raw = await fetch(`${apiBase}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                res = await raw.json();
            }

            if (res && res.success) {
                try {
                    localStorage.setItem('mplads_last_registered_email', email);
                } catch (err) {}

                // Switch to Login tab and prompt officer to log in with their credentials (no shortcuts)
                switchAuthTab('login');

                const loginEmailInput = document.getElementById('loginEmail');
                const loginPwdInput = document.getElementById('loginPassword');
                if (loginEmailInput) loginEmailInput.value = email;
                if (loginPwdInput) {
                    loginPwdInput.value = '';
                    loginPwdInput.focus();
                }

                let successHtml = `🎉 <strong>Cadre Registration Successful!</strong><br>`;
                successHtml += `Officer <strong>${res.user?.name || name}</strong> (${role} • ${district}) is now registered in the official directory.<br>`;
                if (res.succession) {
                    successHtml += `Former incumbent <strong>${res.succession.name}</strong> was marked as relieved.<br>`;
                }
                successHtml += `<strong>Next Step:</strong> Please enter your password below and click <em>Sign In</em> to access the portal.`;
                showSuccess(successHtml);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Complete Induction & Access Portal';
                }
            } else {
                showError(res?.message || 'Induction registration could not be processed.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Complete Induction & Access Portal';
                }
            }
        } catch (error) {
            showError(`Registration error: ${error.message}`);
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Complete Induction & Access Portal';
            }
        }
    });
}

// Check Existing Session (Pre-fill remember email without exposing direct bypass)
function checkExistingSession() {
    const emailInput = document.getElementById('loginEmail');
    if (!emailInput) return;

    try {
        const lastRegistered = localStorage.getItem('mplads_last_registered_email');
        if (lastRegistered && !emailInput.value) {
            emailInput.value = lastRegistered;
            return;
        }

        const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
        if (raw) {
            const session = JSON.parse(raw);
            if (session.email && !emailInput.value) {
                emailInput.value = session.email;
            }
        }
    } catch (e) {}
}

// =============================================================================
// Governance Roster Modal (Credentials Confidential)
// =============================================================================
window.openRosterModal = async function () {
    const modal = document.getElementById('rosterModal');
    if (modal) modal.classList.add('active');
    await renderRosterTable();
};

window.closeRosterModal = function () {
    const modal = document.getElementById('rosterModal');
    if (modal) modal.classList.remove('active');
};

window.renderRosterTable = async function () {
    const tbody = document.getElementById('rosterTableBody');
    const filterDistrict = document.getElementById('rosterDistrictFilter')?.value || '';

    if (!tbody) return;
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:#64748b;">Loading official roster...</td></tr>`;

    let officers = [];
    if (window.MPLADS_API) {
        officers = await window.MPLADS_API.getOfficers(filterDistrict);
    } else {
        officers = window.MPLADS_DEMO_DATA?.officers || [];
        if (filterDistrict) {
            officers = officers.filter(o => o.district.toLowerCase() === filterDistrict.toLowerCase());
        }
    }

    if (!filterDistrict && officers && officers.length > 0) {
        // Sync filter options count dynamically
        const rosterFilter = document.getElementById('rosterDistrictFilter');
        if (rosterFilter && rosterFilter.options.length > 0) {
            rosterFilter.options[0].textContent = `All Districts & Authorities (${officers.length} Officers)`;
        }
    }

    if (!officers || officers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;color:#94a3b8;">No registered officers found for this district.</td></tr>`;
        return;
    }

    tbody.innerHTML = officers.map(o => {
        let districtBadge = '';
        if (o.district === 'National (All Districts)' || o.roleCode === 'MINISTRY') {
            districtBadge = `<span class="badge" style="background:#e0f2fe;color:#0369a1;border:1px solid #bae6fd;padding:3px 8px;font-size:0.75rem;font-weight:600;display:inline-block;">🇮🇳 National (All Districts)</span>`;
        } else if (o.district === 'Uttar Pradesh (State)' || o.roleCode === 'SNA') {
            districtBadge = `<span class="badge" style="background:#fef3c7;color:#92400e;border:1px solid #fde68a;padding:3px 8px;font-size:0.75rem;font-weight:600;display:inline-block;">🏛️ All Districts (UP State)</span>`;
        } else {
            const st = o.state || (window.getStateForDistrict ? window.getStateForDistrict(o.district) : 'Uttar Pradesh');
            districtBadge = `<div><strong style="color:#0f172a;">${o.district}</strong><span style="font-size:0.73rem;color:#64748b;display:block;">${st}</span></div>`;
        }

        return `
            <tr>
                <td>${districtBadge}</td>
                <td>
                    <span class="badge ${o.roleCode === 'DM' ? 'badge-info' : (o.roleCode === 'MP' ? 'badge-warning' : 'badge-status-ongoing')}" style="font-size:0.72rem;">
                        ${o.role}
                    </span>
                </td>
                <td><strong>${o.name}</strong></td>
                <td><code style="font-size:0.75rem;">${o.id}</code></td>
                <td><a href="javascript:void(0)" onclick="selectRosterOfficer('${o.email}')" style="color:#0284c7;text-decoration:none;">${o.email}</a></td>
                <td>
                    <button type="button" class="btn btn-secondary btn-sm" onclick="selectRosterOfficer('${o.email}')" style="padding:2px 8px;font-size:0.75rem;">
                        Select
                    </button>
                </td>
            </tr>
        `;
    }).join('');
};

window.selectRosterOfficer = function (email) {
    closeRosterModal();
    switchAuthTab('login');
    const emailInput = document.getElementById('loginEmail');
    const pwdInput = document.getElementById('loginPassword');
    if (emailInput) {
        emailInput.value = email;
        if (pwdInput) pwdInput.focus();
    }
};

