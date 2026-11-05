import './components/layout/app-header.js';
import './components/layout/bottom-nav.js';
import './views/home-view.js';
import './views/garden-view.js';
import './views/days-view.js';
import './views/diary-view.js';
import './views/arcade-view.js';
import './views/star-os-view.js';
import './views/botiquin-view.js';
import './views/agreements-view.js';
import { syncEngine } from './core/sync.js';

// Capturar evento nativo de instalación PWA en móviles
window.deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
});

class SafeRouter {
    constructor(routes, rootId) {
        this.routes = routes;
        this.root = document.getElementById(rootId);
        window.addEventListener('hashchange', () => this.resolveRoute());
    }

    resolveRoute() {
        if (!this.root) return;
        const hash = window.location.hash || '#/';
        const componentName = this.routes[hash] || 'home-view';
        this.root.innerHTML = `<${componentName}></${componentName}>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function initTouchEmojiSparkles() {
    const emojis = ['🌻', '✨', '💖', '🍷', '🌙', '👩🏻‍🍳', '💻'];
    window.addEventListener('pointerdown', (e) => {
        if (localStorage.getItem('our_garden_sparkles') === 'false') return;
        const span = document.createElement('span');
        span.className = 'touch-emoji';
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = `${e.clientX}px`;
        span.style.top = `${e.clientY}px`;
        document.body.appendChild(span);
        setTimeout(() => span.remove(), 950);
    }, { passive: true });
}

function initPhoenixCosmosEngine() {
    const canvas = document.getElementById('phoenix-cosmos-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let gyroEnabled = false;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let currentOffsetX = 0;
    let currentOffsetY = 0;
    let currentTheme = localStorage.getItem('our_garden_visual_theme') || 'phoenix';

    window.addEventListener('ecosystem:theme-change', (e) => {
        currentTheme = e.detail.theme || 'phoenix';
    });

    const stars = Array.from({ length: 140 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.4,
        depth: Math.random() * 0.8 + 0.2,
        color: ['#ffffff', '#fde68a', '#38bdf8', '#fb7185'][Math.floor(Math.random() * 4)]
    }));

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('pointermove', (e) => {
        if (gyroEnabled || prefersReducedMotion) return;
        targetOffsetX = ((e.clientX / width) - 0.5) * 28;
        targetOffsetY = ((e.clientY / height) - 0.5) * 28;
    }, { passive: true });

    const handleOrientation = (e) => {
        if (!gyroEnabled || prefersReducedMotion) return;
        const gamma = Math.max(-35, Math.min(35, e.gamma || 0));
        const beta = Math.max(-35, Math.min(35, (e.beta || 0) - 40));
        targetOffsetX = gamma * 1.1;
        targetOffsetY = beta * 1.1;
    };

    window.addEventListener('ecosystem:toggle-gyro', async () => {
        if (gyroEnabled) {
            gyroEnabled = false;
            targetOffsetX = 0;
            targetOffsetY = 0;
            window.removeEventListener('deviceorientation', handleOrientation);
            window.dispatchEvent(new CustomEvent('ecosystem:gyro-state', { detail: { active: false } }));
            return;
        }

        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    gyroEnabled = true;
                    window.addEventListener('deviceorientation', handleOrientation, true);
                }
            } catch (err) {
                console.warn('Permiso de giroscopio no concedido:', err);
            }
        } else if ('DeviceOrientationEvent' in window) {
            gyroEnabled = true;
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
        window.dispatchEvent(new CustomEvent('ecosystem:gyro-state', { detail: { active: gyroEnabled } }));
    });

    function renderFrame() {
        if (!document.hidden) {
            ctx.fillStyle = '#04060e';
            ctx.fillRect(0, 0, width, height);

            currentOffsetX += (targetOffsetX - currentOffsetX) * 0.08;
            currentOffsetY += (targetOffsetY - currentOffsetY) * 0.08;

            for (const s of stars) {
                const sx = (s.x + currentOffsetX * s.depth + width) % width;
                const sy = (s.y + currentOffsetY * s.depth + height) % height;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
                ctx.fill();
            }

            const cx = width * 0.5 + currentOffsetX * 0.45;
            const cy = Math.min(height * 0.48, 390) + currentOffsetY * 0.45;
            const outerRadius = Math.min(width, height) * 0.34;
            const innerRadius = outerRadius * 0.54;

            const glow = ctx.createRadialGradient(cx, cy, innerRadius * 0.8, cx, cy, outerRadius * 1.35);
            if (currentTheme === 'enologia') {
                glow.addColorStop(0, 'rgba(192, 132, 252, 0.95)');
                glow.addColorStop(0.55, 'rgba(56, 189, 248, 0.85)');
                glow.addColorStop(0.8, 'rgba(129, 140, 248, 0.25)');
                glow.addColorStop(1, 'rgba(4, 6, 14, 0)');
            } else if (currentTheme === 'alba') {
                glow.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
                glow.addColorStop(0.55, 'rgba(245, 158, 11, 0.85)');
                glow.addColorStop(0.8, 'rgba(52, 211, 153, 0.25)');
                glow.addColorStop(1, 'rgba(4, 6, 14, 0)');
            } else {
                glow.addColorStop(0, 'rgba(244, 114, 182, 0.95)');
                glow.addColorStop(0.55, 'rgba(244, 114, 182, 0.85)');
                glow.addColorStop(0.8, 'rgba(251, 113, 133, 0.25)');
                glow.addColorStop(1, 'rgba(4, 6, 14, 0)');
            }

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, outerRadius * 1.35, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#04060e';
            ctx.beginPath();
            ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        if (!prefersReducedMotion) {
            requestAnimationFrame(renderFrame);
        }
    }

    renderFrame();
}

function initYouTubeAudioEngine() {
    let ytPlayer = null;
    let isReady = false;
    let isPlaying = false;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        ytPlayer = new window.YT.Player('yt-player-instance', {
            height: '1',
            width: '1',
            videoId: 'PEM0Vs8jf1w',
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: 'PEM0Vs8jf1w',
                playsinline: 1
            },
            events: {
                onReady: () => {
                    isReady = true;
                    ytPlayer.setVolume(60);
                },
                onStateChange: (e) => {
                    isPlaying = (e.data === window.YT.PlayerState.PLAYING);
                    window.dispatchEvent(new CustomEvent('ecosystem:music-state', { detail: { playing: isPlaying } }));
                }
            }
        });
    };

    window.addEventListener('ecosystem:toggle-music', () => {
        if (!isReady || !ytPlayer) return;
        if (isPlaying) {
            ytPlayer.pauseVideo();
        } else {
            ytPlayer.playVideo();
        }
    });

    window.addEventListener('ecosystem:volume-change', (e) => {
        if (isReady && ytPlayer) {
            ytPlayer.setVolume(e.detail);
        }
    });
}

function bootEcosystem() {
    syncEngine.init();

    const routes = {
        '#/': 'home-view',
        '#/jardin': 'garden-view',
        '#/tus-dias': 'days-view',
        '#/diario': 'diary-view',
        '#/arcade': 'arcade-view',
        '#/star-os': 'star-os-view',
        '#/botiquin': 'botiquin-view',
        '#/acuerdos': 'agreements-view'
    };

    const router = new SafeRouter(routes, 'app-root');
    router.resolveRoute();

    initPhoenixCosmosEngine();
    initYouTubeAudioEngine();
    initTouchEmojiSparkles();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[Our-Garden] SW activo:', reg.scope))
            .catch(err => console.warn('[Our-Garden] SW omitido:', err));
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEcosystem);
} else {
    bootEcosystem();
}