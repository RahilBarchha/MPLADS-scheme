const http = require('http');
const fs = require('fs');
const path = require('path');

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    
    // Route root, login aliases, and unauthenticated direct index requests directly to Login Page
    const hasSessionCookie = req.headers.cookie && req.headers.cookie.includes('mplads_session=active');
    const isExplicitAuthQuery = req.url.includes('auth=') || req.url.includes('session=');

    if (reqPath === '/' || reqPath === '' || reqPath === '/login' || reqPath === '/login.html' || reqPath === '/index' || reqPath === '/website' || reqPath === '/website/' || reqPath === '/website/index.html') {
        res.writeHead(302, { 'Location': '/pages/login.html' });
        res.end();
        return;
    }

    if (reqPath === '/index.html' && !hasSessionCookie && !isExplicitAuthQuery) {
        res.writeHead(302, { 'Location': '/pages/login.html' });
        res.end();
        return;
    }

    if (reqPath === '/dashboard') {
        res.writeHead(302, { 'Location': hasSessionCookie ? '/index.html?auth=1' : '/pages/login.html' });
        res.end();
        return;
    }

    // Proxy all /api requests directly to backend Express on port 5000 (Unified Host)
    if (req.url.startsWith('/api')) {
        const proxyReq = http.request({
            host: '127.0.0.1',
            port: 5000,
            path: req.url,
            method: req.method,
            headers: req.headers
        }, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
        });

        proxyReq.on('error', (err) => {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, message: 'Backend proxy error: ' + err.message }));
        });

        req.pipe(proxyReq);
        return;
    }

    const filePath = path.join(__dirname, 'website', reqPath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found: ' + reqPath);
            return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0'
        });
        res.end(data);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`[Static Web Server] Serving on http://localhost:${PORT} (Default route -> /pages/login.html)`);
});
