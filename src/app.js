import './components/layout/app-header.js';
import './components/layout/bottom-nav.js';
import './views/home-view.js';
import './views/garden-view.js';
import './views/days-view.js';
import './views/diary-view.js';
import './views/library-view.js';
import './views/arcade-view.js';
import './views/star-os-view.js';
import './views/botiquin-view.js';
import './views/agreements-view.js';
import { syncEngine } from './core/sync.js';

window.deferredPwaPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    window.deferredPwaPrompt = e;
});

/* =========================================================================
   SECCIÓN 24: SISTEMA DE CONSTRUCCIÓN VISUAL INTERACTIVA (4 ETAPAS)
   ========================================================================= */
const SECTION_PALETTES = {
    '#/': { primary: '#fbbf24', secondary: '#34d399' },
    '#/jardin': { primary: '#34d399', secondary: '#fbbf24' },
    '#/tus-dias': { primary: '#f472b6', secondary: '#c084fc' },
    '#/diario': { primary: '#fde68a', secondary: '#38bdf8' },
    '#/biblioteca': { primary: '#f59e0b', secondary: '#a855f7' },
    '#/arcade': { primary: '#38bdf8', secondary: '#fb7185' },
    '#/star-os': { primary: '#38bdf8', secondary: '#818cf8' },
    '#/botiquin': { primary: '#fb7185', secondary: '#fde68a' },
    '#/acuerdos': { primary: '#34d399', secondary: '#38bdf8' }
};

class VisualConstructionEngine {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'construction-fx-canvas';
        this.canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:85;';
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.rafId = null;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    trigger(route = '#/', originX = window.innerWidth / 2, originY = window.innerHeight - 40) {
        const prefs = JSON.parse(localStorage.getItem('our_garden_universe_prefs_v1')) || {};
        if (prefs.constructionAnimEnabled === false) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        if (this.rafId) cancelAnimationFrame(this.rafId);

        const palette = SECTION_PALETTES[route] || SECTION_PALETTES['#/'];
        const w = this.canvas.width;
        const h = this.canvas.height;

        const cards = Array.from(document.querySelectorAll('#app-root .glass-card, #app-root .stage-card, #app-root .element-btn-card'));
        cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(12px) scale(0.97)';
            card.style.transition = 'opacity 0.32s ease, transform 0.32s ease';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }, 140 + i * 55);
        });

        const arrows = Array.from({ length: Math.min(14, Math.max(8, cards.length * 2)) }, (_, i) => {
            const targetCard = cards[i % Math.max(1, cards.length)];
            let tx = w * (0.2 + Math.random() * 0.6);
            let ty = h * (0.18 + Math.random() * 0.55);
            if (targetCard) {
                const r = targetCard.getBoundingClientRect();
                tx = r.left + r.width / 2;
                ty = r.top + r.height / 2;
            }
            return {
                sx: originX,
                sy: originY,
                cx: (originX + tx) / 2 + (Math.random() - 0.5) * 180,
                cy: Math.min(originY, ty) - 60 - Math.random() * 90,
                tx,
                ty,
                color: i % 2 === 0 ? palette.primary : palette.secondary
            };
        });

        const startTime = performance.now();
        const duration = 680;

        const animate = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            this.ctx.clearRect(0, 0, w, h);

            if (t < 0.45) {
                const pulseProgress = t / 0.45;
                this.ctx.strokeStyle = palette.primary;
                this.ctx.lineWidth = 2.5 * (1 - pulseProgress);
                this.ctx.beginPath();
                this.ctx.arc(originX, originY, pulseProgress * 75, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            arrows.forEach(a => {
                const p = Math.min(1, t * 1.25);
                const inv = 1 - p;
                const x = inv * inv * a.sx + 2 * inv * p * a.cx + p * p * a.tx;
                const y = inv * inv * a.sy + 2 * inv * p * a.cy + p * p * a.ty;

                this.ctx.strokeStyle = a.color;
                this.ctx.globalAlpha = (1 - t) * 0.75;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(a.sx, a.sy);
                this.ctx.quadraticCurveTo(a.cx, a.cy, x, y);
                this.ctx.stroke();

                this.ctx.fillStyle = '#ffffff';
                this.ctx.globalAlpha = 1 - t * 0.5;
                this.ctx.beginPath();
                this.ctx.arc(x, y, 3.2, 0, Math.PI * 2);
                this.ctx.fill();

                if (p >= 0.95) {
                    const ringR = (t - 0.7) * 90;
                    if (ringR > 0) {
                        this.ctx.strokeStyle = a.color;
                        this.ctx.globalAlpha = (1 - t) * 0.9;
                        this.ctx.beginPath();
                        this.ctx.arc(a.tx, a.ty, ringR, 0, Math.PI * 2);
                        this.ctx.stroke();
                    }
                }
            });

            this.ctx.globalAlpha = 1;
            if (t < 1) {
                this.rafId = requestAnimationFrame(animate);
            } else {
                this.ctx.clearRect(0, 0, w, h);
            }
        };

        this.rafId = requestAnimationFrame(animate);
    }
}

class SafeRouter {
    constructor(routes, rootId, constructionEngine) {
        this.routes = routes;
        this.root = document.getElementById(rootId);
        this.constructionEngine = constructionEngine;
        this.lastOrigin = { x: window.innerWidth / 2, y: window.innerHeight - 40 };

        window.addEventListener('ecosystem:trigger-construction', (e) => {
            this.lastOrigin = { x: e.detail.originX, y: e.detail.originY };
        });

        window.addEventListener('hashchange', () => this.resolveRoute(true));
    }

    resolveRoute(animate = false) {
        if (!this.root) return;
        const hash = window.location.hash || '#/';
        const componentName = this.routes[hash] || 'home-view';
        this.root.innerHTML = `<${componentName}></${componentName}>`;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (animate && this.constructionEngine) {
            this.constructionEngine.trigger(hash, this.lastOrigin.x, this.lastOrigin.y);
        }
    }
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
    let prefs = JSON.parse(localStorage.getItem('our_garden_universe_prefs_v1')) || {
        gyroSensitivity: 1.2,
        motionMode: 'auto'
    };

    window.addEventListener('ecosystem:theme-change', (e) => {
        currentTheme = e.detail.theme || 'phoenix';
    });

    window.addEventListener('ecosystem:universe-prefs', (e) => {
        prefs = { ...prefs, ...e.detail };
    });

    window.addEventListener('ecosystem:reset-cosmos-origin', () => {
        targetOffsetX = 0;
        targetOffsetY = 0;
        currentOffsetX = 0;
        currentOffsetY = 0;
    });

    const stars = Array.from({ length: 165 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.9 + 0.35,
        depth: Math.random() * 0.85 + 0.15,
        twinklePhase: Math.random() * Math.PI * 2,
        color: ['#ffffff', '#fde68a', '#38bdf8', '#fb7185', '#c084fc'][Math.floor(Math.random() * 5)]
    }));

    let shootingStar = null;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('pointermove', (e) => {
        if (gyroEnabled || prefersReducedMotion) return;
        const sens = Number(prefs.gyroSensitivity) || 1.2;
        targetOffsetX = ((e.clientX / width) - 0.5) * 30 * sens;
        targetOffsetY = ((e.clientY / height) - 0.5) * 30 * sens;
    }, { passive: true });

    const handleOrientation = (e) => {
        if (!gyroEnabled || prefersReducedMotion) return;
        const sens = Number(prefs.gyroSensitivity) || 1.2;
        const gamma = Math.max(-35, Math.min(35, e.gamma || 0));
        const beta = Math.max(-35, Math.min(35, (e.beta || 0) - 40));
        targetOffsetX = gamma * 1.15 * sens;
        targetOffsetY = beta * 1.15 * sens;
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

    function getTimeScenarioPalette() {
        const hour = new Date().getHours();
        if (currentTheme === 'enologia') {
            return { bgTop: '#08051a', bgBot: '#04060e', starAlpha: 0.9, ringInner: 'rgba(192,132,252,0.95)', ringMid: 'rgba(56,189,248,0.8)', ringOuter: 'rgba(129,140,248,0.22)' };
        }
        if (currentTheme === 'alba') {
            return { bgTop: '#140c04', bgBot: '#04060e', starAlpha: 0.85, ringInner: 'rgba(251,191,36,0.95)', ringMid: 'rgba(245,158,11,0.82)', ringOuter: 'rgba(52,211,153,0.22)' };
        }

        if (hour >= 6 && hour < 9) {
            return { bgTop: '#1c1026', bgBot: '#090714', starAlpha: 0.45, ringInner: 'rgba(253,230,138,0.95)', ringMid: 'rgba(244,114,182,0.82)', ringOuter: 'rgba(251,191,36,0.25)' };
        } else if (hour >= 9 && hour < 17) {
            return { bgTop: '#081c38', bgBot: '#040b1a', starAlpha: 0.35, ringInner: 'rgba(254,240,138,0.92)', ringMid: 'rgba(56,189,248,0.75)', ringOuter: 'rgba(244,114,182,0.22)' };
        } else if (hour >= 17 && hour < 20) {
            return { bgTop: '#1f0d29', bgBot: '#060512', starAlpha: 0.72, ringInner: 'rgba(251,113,133,0.95)', ringMid: 'rgba(192,132,252,0.82)', ringOuter: 'rgba(245,158,11,0.25)' };
        } else if (hour >= 0 && hour < 6) {
            return { bgTop: '#020308', bgBot: '#04060e', starAlpha: 0.95, ringInner: 'rgba(244,114,182,0.85)', ringMid: 'rgba(129,140,248,0.68)', ringOuter: 'rgba(56,189,248,0.18)' };
        }
        return { bgTop: '#04060e', bgBot: '#020308', starAlpha: 1, ringInner: 'rgba(244,114,182,0.96)', ringMid: 'rgba(244,114,182,0.85)', ringOuter: 'rgba(251,113,133,0.26)' };
    }

    let tick = 0;

    function renderFrame() {
        if (!document.hidden) {
            tick += 0.015;
            const pal = getTimeScenarioPalette();

            const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
            bgGrad.addColorStop(0, pal.bgTop);
            bgGrad.addColorStop(1, pal.bgBot);
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            const autoX = (prefs.motionMode === 'auto' && !gyroEnabled) ? Math.cos(tick * 0.7) * 10 : 0;
            const autoY = (prefs.motionMode === 'auto' && !gyroEnabled) ? Math.sin(tick * 0.5) * 8 : 0;

            currentOffsetX += ((targetOffsetX + autoX) - currentOffsetX) * 0.08;
            currentOffsetY += ((targetOffsetY + autoY) - currentOffsetY) * 0.08;

            ctx.globalAlpha = pal.starAlpha;
            for (const s of stars) {
                const sx = (s.x + currentOffsetX * s.depth + width) % width;
                const sy = (s.y + currentOffsetY * s.depth + height) % height;
                const twinkle = 0.65 + 0.35 * Math.sin(tick * 2 + s.twinklePhase);
                ctx.fillStyle = s.color;
                ctx.globalAlpha = pal.starAlpha * twinkle;
                ctx.beginPath();
                ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;

            if (!shootingStar && Math.random() < 0.006) {
                shootingStar = {
                    x: Math.random() * width * 0.8 + width * 0.1,
                    y: Math.random() * height * 0.35,
                    vx: -6 - Math.random() * 4,
                    vy: 3 + Math.random() * 3,
                    life: 1
                };
            }
            if (shootingStar) {
                ctx.strokeStyle = 'rgba(254, 240, 138, ' + shootingStar.life + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(shootingStar.x - shootingStar.vx * 5, shootingStar.y - shootingStar.vy * 5);
                ctx.stroke();
                shootingStar.x += shootingStar.vx;
                shootingStar.y += shootingStar.vy;
                shootingStar.life -= 0.04;
                if (shootingStar.life <= 0) shootingStar = null;
            }

            const cx = width * 0.5 + currentOffsetX * 0.45;
            const cy = Math.min(height * 0.48, 390) + currentOffsetY * 0.45;
            const outerRadius = Math.min(width, height) * 0.34;
            const innerRadius = outerRadius * 0.54;

            const glow = ctx.createRadialGradient(cx, cy, innerRadius * 0.8, cx, cy, outerRadius * 1.38);
            glow.addColorStop(0, pal.ringInner);
            glow.addColorStop(0.55, pal.ringMid);
            glow.addColorStop(0.82, pal.ringOuter);
            glow.addColorStop(1, 'rgba(4, 6, 14, 0)');

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, outerRadius * 1.38, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = 'rgba(254, 243, 199, 0.35)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(cx, cy, innerRadius * 1.04, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = '#03050c';
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

function initYouTubeAudioEngine() {
    let ytPlayer = null;
    let isReady = false;
    let isPlaying = false;
    const savedTrack = localStorage.getItem('our_garden_music_track') || 'PEM0Vs8jf1w';

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
        ytPlayer = new window.YT.Player('yt-player-instance', {
            height: '1',
            width: '1',
            videoId: savedTrack,
            playerVars: {
                autoplay: 0,
                controls: 0,
                loop: 1,
                playlist: savedTrack,
                playsinline: 1
            },
            events: {
                onReady: () => {
                    isReady = true;
                    ytPlayer.setVolume(65);
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

    window.addEventListener('ecosystem:change-track', (e) => {
        if (!isReady || !ytPlayer) return;
        const videoId = e.detail.videoId;
        ytPlayer.loadVideoById({ videoId });
    });

    window.addEventListener('ecosystem:volume-change', (e) => {
        if (isReady && ytPlayer) {
            ytPlayer.setVolume(e.detail);
        }
    });
}

function bootEcosystem() {
    syncEngine.init();
    const constructionEngine = new VisualConstructionEngine();

    const routes = {
        '#/': 'home-view',
        '#/jardin': 'garden-view',
        '#/tus-dias': 'days-view',
        '#/diario': 'diary-view',
        '#/biblioteca': 'library-view',
        '#/arcade': 'arcade-view',
        '#/star-os': 'star-os-view',
        '#/botiquin': 'botiquin-view',
        '#/acuerdos': 'agreements-view'
    };

    const router = new SafeRouter(routes, 'app-root', constructionEngine);
    router.resolveRoute(false);

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