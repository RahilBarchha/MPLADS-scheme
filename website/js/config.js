/**
 * ==============================================================================
 * MPLADS Monitoring & Analytics Platform - Client Environment Configuration
 * 
 * Configures the REST API Gateway endpoint dynamically across:
 * 1. Local Development (localhost:8080 / localhost:5000) -> uses relative '/api'
 * 2. Cloud Deployment (Vercel, Netlify, Render, Railway, Cloudflare)
 * 3. User-defined custom backend via localStorage ('mplads_api_base_url')
 * ==============================================================================
 */

(function () {
    // 1. Check if user configured a custom backend in localStorage or window
    const customUrl = (typeof localStorage !== 'undefined' && localStorage.getItem('mplads_api_base_url')) ||
                      (typeof window !== 'undefined' && window.MPLADS_CUSTOM_API_URL);

    function resolveDefaultApiUrl() {
        if (typeof window === 'undefined' || !window.location) {
            return 'http://127.0.0.1:5000/api';
        }

        const hostname = window.location.hostname || 'localhost';
        const port = window.location.port;
        const protocol = window.location.protocol;

        // Local development on port 5000 (Express) or 8080 (Static Proxy)
        if (port === '5000' || port === '8080') {
            return '/api';
        }

        // Direct file:/// inspection
        if (protocol === 'file:') {
            return 'http://127.0.0.1:5000/api';
        }

        // Deployed to cloud (Vercel, Netlify, Render, Railway)
        // If deployed with Vercel/Netlify proxy rewrites, relative '/api' works automatically.
        // Otherwise fallback to user-configured URL or same-origin /api.
        return '/api';
    }

    const resolvedUrl = customUrl ? customUrl.replace(/\/+$/, '') : resolveDefaultApiUrl();

    window.MPLADS_CONFIG = {
        API_URL: resolvedUrl,
        DEFAULT_PORT: 5000,
        PROXY_PORT: 8080,
        ENVIRONMENT: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'development' : 'production',
        VERSION: '2.4.0',
        getApiUrl: function () {
            const custom = (typeof localStorage !== 'undefined' && localStorage.getItem('mplads_api_base_url')) ||
                           (typeof window !== 'undefined' && window.MPLADS_CUSTOM_API_URL);
            return custom ? custom.replace(/\/+$/, '') : (window.MPLADS_CONFIG.API_URL || resolveDefaultApiUrl());
        },
        setApiUrl: function (newUrl) {
            if (newUrl) {
                const clean = newUrl.trim().replace(/\/+$/, '');
                localStorage.setItem('mplads_api_base_url', clean);
                window.MPLADS_CONFIG.API_URL = clean;
                if (window.MPLADS_API && typeof window.MPLADS_API.setBaseUrl === 'function') {
                    window.MPLADS_API.setBaseUrl(clean);
                }
            } else {
                localStorage.removeItem('mplads_api_base_url');
                window.MPLADS_CONFIG.API_URL = resolveDefaultApiUrl();
            }
        },
        resetApiUrl: function () {
            localStorage.removeItem('mplads_api_base_url');
            window.MPLADS_CONFIG.API_URL = resolveDefaultApiUrl();
        }
    };

    window.getApiBaseUrl = function () {
        return window.MPLADS_CONFIG ? window.MPLADS_CONFIG.getApiUrl() : '/api';
    };
})();
