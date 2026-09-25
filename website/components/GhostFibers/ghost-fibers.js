/**
 * GhostFibers - Vanilla WebGL2 / Canvas Interactive Animated Background
 * Based on React Bits @react-bits/GhostFibers-JS-CSS
 * Features deep-blue luminous recursive fiber field with radial twisting and atmospheric glow.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.GhostFibers = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    function initGhostFibers(canvasId, options = {}) {
        const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        if (!canvas) return null;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            console.warn('[GhostFibers] WebGL2 not supported, falling back to 2D canvas simulation.');
            return initCanvasFallback(canvas, options);
        }

        const vsSource = `#version 300 es
        in vec2 position;
        void main() {
            gl_Position = vec4(position, 0.0, 1.0);
        }`;

        const fsSource = `#version 300 es
        precision highp float;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform vec3 uLineColor;
        uniform vec3 uGlowColor;
        out vec4 fragColor;

        mat2 rot(float a) {
            float s = sin(a), c = cos(a);
            return mat2(c, -s, s, c);
        }

        void main() {
            vec2 uv = (2.0 * gl_FragCoord.xy - uResolution.xy) / uResolution.y;
            float t = uTime * 0.4;
            uv = rot(t * 0.15) * uv;
            
            vec3 col = vec3(0.02, 0.05, 0.12); // deep blue space
            float field = 0.0;

            for (int i = 1; i <= 6; i++) {
                float fi = float(i);
                vec2 p = uv * (1.0 + fi * 0.25);
                p += vec2(sin(t * 0.6 + fi * 1.5), cos(t * 0.5 + fi * 1.2)) * 0.35;
                float d = length(p);
                float wave = sin(d * 8.0 - t * 2.0 + fi);
                float line = smoothstep(0.08, 0.0, abs(wave));
                col += uLineColor * line * (0.6 / fi);
                field += exp(-d * 2.5) * (0.15 / fi);
            }

            col += uGlowColor * field * 1.4;
            fragColor = vec4(col, 0.85);
        }`;

        function compileShader(src, type) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, src);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vs = compileShader(vsSource, gl.VERTEX_SHADER);
        const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
        if (!vs || !fs) {
            console.warn('[GhostFibers] Shader compilation failed, falling back to 2D canvas simulation.');
            return initCanvasFallback(canvas, options);
        }

        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return initCanvasFallback(canvas, options);
        }

        const posBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
            -1, -1,
             1, -1,
            -1,  1,
            -1,  1,
             1, -1,
             1,  1
        ]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'position');
        const resLoc = gl.getUniformLocation(program, 'uResolution');
        const timeLoc = gl.getUniformLocation(program, 'uTime');
        const lineLoc = gl.getUniformLocation(program, 'uLineColor');
        const glowLoc = gl.getUniformLocation(program, 'uGlowColor');

        const lineColor = options.lineColor || [0.0, 0.72, 1.0]; // Cyan/Azure
        const glowColor = options.glowColor || [0.15, 0.35, 0.9]; // Royal blue glow
        const speed = typeof options.speed === 'number' ? options.speed : 0.45;

        let animationFrameId;
        let startTime = performance.now();

        function resize() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
            const h = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            gl.viewport(0, 0, canvas.width, canvas.height);
        }
        window.addEventListener('resize', resize);
        resize();

        function render(now) {
            const elapsed = (now - startTime) * 0.001 * (speed / 0.4);
            gl.useProgram(program);

            gl.enableVertexAttribArray(posLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, elapsed);
            gl.uniform3f(lineLoc, lineColor[0], lineColor[1], lineColor[2]);
            gl.uniform3f(glowLoc, glowColor[0], glowColor[1], glowColor[2]);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
            animationFrameId = requestAnimationFrame(render);
        }

        render(performance.now());

        return {
            destroy: () => {
                cancelAnimationFrame(animationFrameId);
                window.removeEventListener('resize', resize);
            }
        };
    }

    function initCanvasFallback(canvas) {
        const ctx = canvas.getContext('2d');
        let animId;
        let t = 0;
        function resize() {
            canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
            canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        function draw() {
            ctx.fillStyle = '#06101e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(2, 132, 199, 0.3)';
            ctx.lineWidth = 1.5;

            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 15) {
                    const y = (canvas.height / 2) + Math.sin(x * 0.008 + t + i) * 60 + Math.cos(x * 0.003 - t) * 40;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            t += 0.02;
            animId = requestAnimationFrame(draw);
        }
        draw();

        return {
            destroy: () => {
                cancelAnimationFrame(animId);
                window.removeEventListener('resize', resize);
            }
        };
    }

    return {
        init: initGhostFibers
    };
}));
