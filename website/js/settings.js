/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Settings Controller
 * 
 * Manages tab switching, profile updates, notification threshold saving,
 * application preferences, and security preference validation.
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initSettingsForms();
});

window.switchSettingsTab = function (tabId, clickedBtn) {
    // Hide all panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
        pane.style.display = 'none';
    });

    // Deactivate all buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activate target pane
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('active');
        targetPane.style.display = 'block';
    }

    // Activate target button
    if (clickedBtn && clickedBtn.classList) {
        clickedBtn.classList.add('active');
    } else {
        const matchingBtn = document.querySelector(`.tab-button[onclick*="${tabId}"]`);
        if (matchingBtn) matchingBtn.classList.add('active');
    }
};

function initSettingsForms() {
    // Populate form with authenticated officer credentials
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

    if (user) {
        const nameInput = document.getElementById('profName');
        const roleInput = document.getElementById('profRole');
        const emailInput = document.getElementById('profEmail');
        const phoneInput = document.getElementById('profPhone');
        const distInput = document.getElementById('profDistrict');

        if (nameInput && user.name) nameInput.value = user.name;
        if (roleInput && user.role) roleInput.value = user.role;
        if (emailInput && user.email) emailInput.value = user.email;
        if (phoneInput && (user.contact || user.phone)) phoneInput.value = user.contact || user.phone;
        if (distInput && user.district) distInput.value = `${user.district}, ${user.state || 'Uttar Pradesh'}`;
    }

    // 1. Profile Form Submission
    const profForm = document.getElementById('profileForm');
    if (profForm) {
        profForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('profName')?.value.trim();
            const role = document.getElementById('profRole')?.value.trim();
            const email = document.getElementById('profEmail')?.value.trim();
            const phone = document.getElementById('profPhone')?.value.trim();
            
            let currentUser = null;
            try {
                const raw = localStorage.getItem('mplads_user_session') || sessionStorage.getItem('mplads_user_session');
                if (raw) currentUser = JSON.parse(raw);
            } catch (err) {}
            if (!currentUser) currentUser = window.MPLADS_DEMO_DATA?.currentUser || {};

            if (name) currentUser.name = name;
            if (role) currentUser.role = role;
            if (email) currentUser.email = email;
            if (phone) currentUser.contact = phone;

            // Persist updated session
            try {
                localStorage.setItem('mplads_user_session', JSON.stringify(currentUser));
                sessionStorage.setItem('mplads_user_session', JSON.stringify(currentUser));
                if (window.MPLADS_DEMO_DATA) {
                    window.MPLADS_DEMO_DATA.currentUser = currentUser;
                }
                if (window.MPLADS_API && typeof window.MPLADS_API.saveUserSession === 'function') {
                    window.MPLADS_API.saveUserSession(currentUser);
                }
            } catch (err) {}

            // Update UI headers
            const userNameEl = document.getElementById('headerUserName') || document.querySelector('.user-profile .user-name');
            const userRoleEl = document.getElementById('headerUserRole') || document.querySelector('.user-profile .user-role');
            if (userNameEl && name) userNameEl.textContent = name;
            if (userRoleEl && role) userRoleEl.textContent = `${role} • ${currentUser.district || 'Varanasi'}`;

            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast(`Official profile for ${currentUser.name} updated successfully!`, 'success');
            }
        });
    }

    // 2. Notification Thresholds Form
    const notifForm = document.getElementById('notificationSettingsForm');
    if (notifForm) {
        notifForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const stag = document.getElementById('stagnationThreshold')?.value;
            const exp = document.getElementById('expVelocityThreshold')?.value;
            const freq = document.getElementById('digestFreq')?.value;

            try {
                localStorage.setItem('mplads_notif_prefs', JSON.stringify({
                    stagnationDays: stag,
                    expenditureDays: exp,
                    frequency: freq,
                    smsAlerts: document.getElementById('smsAlerts')?.checked
                }));
            } catch (err) {}

            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Early warning SLA thresholds & notification triggers updated!', 'success');
            }
        });
    }

    // 3. Application Preferences Form
    const appForm = document.getElementById('appPrefsForm');
    if (appForm) {
        appForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fy = document.getElementById('prefDefaultFY')?.value;
            const density = document.getElementById('prefDensity')?.value;

            try {
                localStorage.setItem('mplads_app_prefs', JSON.stringify({ fy, density }));
            } catch (err) {}

            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Application preferences saved successfully!', 'success');
            }
        });
    }

    // 4. Security Form
    const secForm = document.getElementById('securityForm');
    if (secForm) {
        secForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const p1 = document.getElementById('secNewPwd')?.value;
            const p2 = document.getElementById('secConfirmPwd')?.value;
            if (p1 && p1 !== p2) {
                if (typeof window.showMpladsToast === 'function') {
                    window.showMpladsToast('New passwords do not match. Please re-enter.', 'error');
                }
                return;
            }

            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast('Security credentials & 2FA e-Pramaan status updated.', 'success');
            }
        });
    }

    // Prepopulate stored AI Key in masked mode
    const keyInput = document.getElementById('settingOpenAiKey');
    if (keyInput) {
        const stored = localStorage.getItem('mplads_groq_key') || localStorage.getItem('mplads_openai_key') || localStorage.getItem('mplads_api_key');
        if (stored) {
            keyInput.dataset.storedKey = stored;
            keyInput.placeholder = `Active (${stored.slice(0, 4)}••••••••••••${stored.slice(-4)}) - Enter new key to override`;
        }
    }

    // 5. Backend REST API Connection Configuration
    const backendInput = document.getElementById('backendApiUrlInput');
    if (backendInput) {
        const activeUrl = (window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl)
            ? window.MPLADS_CONFIG.getApiUrl()
            : (localStorage.getItem('mplads_api_base_url') || '/api');
        backendInput.value = activeUrl;
        setTimeout(() => {
            if (typeof window.testBackendConnectivity === 'function') {
                window.testBackendConnectivity();
            }
        }, 300);
    }

    const backendForm = document.getElementById('backendConfigForm');
    if (backendForm) {
        backendForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const url = document.getElementById('backendApiUrlInput')?.value.trim();
            if (window.MPLADS_CONFIG && typeof window.MPLADS_CONFIG.setApiUrl === 'function') {
                window.MPLADS_CONFIG.setApiUrl(url);
            } else if (url) {
                localStorage.setItem('mplads_api_base_url', url);
            }
            if (typeof window.showMpladsToast === 'function') {
                window.showMpladsToast(`Backend API target updated to: ${url || '/api'}`, 'success');
            }
            if (typeof window.testBackendConnectivity === 'function') {
                window.testBackendConnectivity();
            }
        });
    }
}

// AI Settings Handlers (Supports Groq Cloud and OpenAI)
window.toggleKeyVisibility = function () {
    const input = document.getElementById('settingOpenAiKey');
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
};

window.testOpenAiKey = async function () {
    const keyInput = document.getElementById('settingOpenAiKey');
    const resultEl = document.getElementById('keyTestResult');
    const key = keyInput?.value.trim() || keyInput?.dataset?.storedKey;

    if (!key) {
        if (resultEl) {
            resultEl.style.color = '#ef4444';
            resultEl.textContent = '❌ Please enter an API key to test.';
        }
        return;
    }

    const isGroq = key.startsWith('gsk_');
    const endpoint = isGroq 
        ? 'https://api.groq.com/openai/v1/chat/completions' 
        : 'https://api.openai.com/v1/chat/completions';
    const model = isGroq ? 'openai/gpt-oss-120b' : 'gpt-4o-mini';
    const providerName = isGroq ? 'Groq Cloud LPU' : 'OpenAI';

    if (resultEl) {
        resultEl.style.color = '#0284c7';
        resultEl.textContent = `⏳ Testing key with ${providerName} endpoint (${model})...`;
    }

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: 'hello' }],
                max_tokens: 10
            })
        });

        if (res.ok) {
            const data = await res.json();
            const reply = data?.choices?.[0]?.message?.content || 'OK';
            if (resultEl) {
                resultEl.style.color = '#16a34a';
                resultEl.innerHTML = `✅ <strong>${providerName} Connected!</strong> Model responded: "<em>${reply.trim()}</em>". Live AI features active.`;
            }
            // Auto-persist tested key
            localStorage.setItem('mplads_api_key', key);
            if (isGroq) localStorage.setItem('mplads_groq_key', key);
            else localStorage.setItem('mplads_openai_key', key);
        } else {
            const err = await res.json().catch(() => ({}));
            const msg = err.error?.message || `HTTP ${res.status}`;
            if (resultEl) {
                resultEl.style.color = '#ea580c';
                resultEl.textContent = `⚠️ ${providerName} returned error: ${msg}. Falling back to Autonomous MoSPI Engine.`;
            }
        }
    } catch (e) {
        if (resultEl) {
            resultEl.style.color = '#ea580c';
            resultEl.textContent = `⚠️ Network error reaching ${providerName}: ${e.message}. Autonomous MoSPI Engine active.`;
        }
    }
};

window.saveAiSettings = function () {
    const key = document.getElementById('settingOpenAiKey')?.value.trim();
    if (key) {
        localStorage.setItem('mplads_api_key', key);
        sessionStorage.setItem('mplads_api_key', key);
        if (key.startsWith('gsk_')) {
            localStorage.setItem('mplads_groq_key', key);
            sessionStorage.setItem('mplads_groq_key', key);
        } else {
            localStorage.setItem('mplads_openai_key', key);
            sessionStorage.setItem('mplads_openai_key', key);
        }
    }
    const model = document.getElementById('settingAiModel')?.value;
    if (model) {
        localStorage.setItem('mplads_ai_model', model);
    }
    if (typeof window.showMpladsToast === 'function') {
        window.showMpladsToast('AI & LLM Configuration saved successfully! Live AI active.', 'success');
    }
};

window.testBackendConnectivity = async function () {
    const resultEl = document.getElementById('backendPingResult');
    const input = document.getElementById('backendApiUrlInput');
    const targetUrl = (input?.value.trim()) || ((window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl) ? window.MPLADS_CONFIG.getApiUrl() : '/api');
    
    if (resultEl) {
        resultEl.innerHTML = `<span style="color:#0284c7;">⏳ Pinging ${targetUrl}/health...</span>`;
    }

    const t0 = performance.now();
    try {
        const res = await fetch(`${targetUrl.replace(/\/+$/, '')}/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const latency = Math.round(performance.now() - t0);
        if (res.ok) {
            const data = await res.json();
            if (resultEl) {
                resultEl.innerHTML = `<span style="color:#16a34a;font-weight:600;">✅ Connected! (HTTP ${res.status} in ${latency}ms)</span> — Database: ${data.database || 'Active'}, AI: ${data.aiEngine || 'Groq Active'}`;
            }
        } else {
            if (resultEl) {
                resultEl.innerHTML = `<span style="color:#ea580c;font-weight:600;">⚠️ Server returned HTTP ${res.status} (${latency}ms)</span>`;
            }
        }
    } catch (e) {
        if (resultEl) {
            resultEl.innerHTML = `<span style="color:#ef4444;font-weight:600;">❌ Connection Failed:</span> ${e.message}. Ensure backend is running or deploy to Render/Railway.`;
        }
    }
};

window.setPresetUrl = function (preset) {
    const input = document.getElementById('backendApiUrlInput');
    if (input) {
        input.value = preset;
    }
    if (window.MPLADS_CONFIG && typeof window.MPLADS_CONFIG.setApiUrl === 'function') {
        window.MPLADS_CONFIG.setApiUrl(preset);
    }
    window.testBackendConnectivity();
};

window.resetBackendUrl = function () {
    if (window.MPLADS_CONFIG && typeof window.MPLADS_CONFIG.resetApiUrl === 'function') {
        window.MPLADS_CONFIG.resetApiUrl();
    } else {
        localStorage.removeItem('mplads_api_base_url');
    }
    const input = document.getElementById('backendApiUrlInput');
    if (input) {
        input.value = (window.MPLADS_CONFIG && window.MPLADS_CONFIG.getApiUrl) ? window.MPLADS_CONFIG.getApiUrl() : '/api';
    }
    window.testBackendConnectivity();
};

