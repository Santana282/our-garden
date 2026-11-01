import { CONFIG } from './core/config.js';
import { StorageService } from './core/storage.js';
import { Store } from './core/store.js';
import { Router } from './core/router.js';

// Componentes de Layout y Vistas Actuales
import './components/layout/app-header.js';
import './components/layout/bottom-nav.js';
import './views/home-view.js';
import './views/garden-view.js';
import './views/arcade-view.js';

// Vistas modulares de las 7 secciones (Placeholders funcionales para Fases 4-6)
class SectionPlaceholder extends HTMLElement {
    renderSection(icon, title, subtitle, desc) {
        this.innerHTML = `
            <div class="stage-card" style="text-align:center;margin-top:24px;">
                <div style="font-size:3rem;margin-bottom:10px;">${icon}</div>
                <h2 style="color:var(--accent-sunflower);margin-bottom:6px;">${title}</h2>
                <p style="color:var(--accent-sky);font-size:0.85rem;font-weight:700;margin-bottom:12px;">${subtitle}</p>
                <p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:18px;">${desc}</p>
                <a href="#/" class="pill-action-btn" style="text-decoration:none;display:inline-flex;">⬅️ Volver al Ecosistema</a>
            </div>
        `;
    }
}

customElements.define('days-view', class extends SectionPlaceholder {
    connectedCallback() {
        this.renderSection('🌙', 'Tus Días • Calendario Lunar', 'Privacidad y Cuidado Biológico', 'Módulo preparado para Fase 4: Registro de ciclo controlado por Analy y recordatorios de apapacho.');
    }
});
customElements.define('diary-view', class extends SectionPlaceholder {
    connectedCallback() {
        this.renderSection('📖', 'Nuestros Diarios', 'Mi Diario • Su Diario • Nuestro Diario', 'Módulo preparado para Fase 4: Historias personales y recuerdos compartidos sincronizados.');
    }
});
customElements.define('star-os-view', class extends SectionPlaceholder {
    connectedCallback() {
        this.renderSection('💻', 'Star-OS • Configuración', 'Perfiles, Sensores y Sincronización', 'Módulo preparado para Fase 6: Control de cuentas (Kevin y Analy), permisos y respaldos.');
    }
});
customElements.define('botiquin-view', class extends SectionPlaceholder {
    connectedCallback() {
        this.renderSection('🛠️', 'Botiquín Emocional', 'Protocolos de Apoyo y Calma', 'Módulo preparado para Fase 4: Mensajes de contención y señal 🌻 para pausar discusiones lógicas.');
    }
});
customElements.define('agreements-view', class extends SectionPlaceholder {
    connectedCallback() {
        this.renderSection('🤝', 'Invernadero de Acuerdos', 'Compromisos Explícitos en Pareja', 'Módulo preparado para Fase 4: Seguimiento bilateral de acuerdos sin presión emocional.');
    }
});

/* =========================================================================
   MOTOR ESPACIAL PHOENIX-A + GIROSCOPIO CONTROLADO
   ========================================================================= */
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

    // Alternativa táctil suave
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
                console.warn('Permiso de giroscopio rechazado o no disponible:', err);
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

            // Dibujar estrellas con parallax
            for (const s of stars) {
                const sx = (s.x + currentOffsetX * s.depth + width) % width;
                const sy = (s.y + currentOffsetY * s.depth + height) % height;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
                ctx.fill();
            }

            // Agujero Negro Central Phoenix-A (Anillo Rosa/Dorado como en la referencia móvil)
            const cx = width * 0.5 + currentOffsetX * 0.45;
            const cy = Math.min(height * 0.48, 390) + currentOffsetY * 0.45;
            const outerRadius = Math.min(width, height) * 0.34;
            const innerRadius = outerRadius * 0.54;

            // Resplandor exterior
            const glow = ctx.createRadialGradient(cx, cy, innerRadius * 0.8, cx, cy, outerRadius * 1.35);
            glow.addColorStop(0, 'rgba(244, 114, 182, 0.95)');
            glow.addColorStop(0.55, 'rgba(244, 114, 182, 0.85)');
            glow.addColorStop(0.8, 'rgba(251, 113, 133, 0.25)');
            glow.addColorStop(1, 'rgba(4, 6, 14, 0)');

            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(cx, cy, outerRadius * 1.35, 0, Math.PI * 2);
            ctx.fill();

            // Horizonte de sucesos oscuro central
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

/* =========================================================================
   REPRODUCTOR OFICIAL YOUTUBE (https://youtu.be/PEM0Vs8jf1w)
   ========================================================================= */
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

/* =========================================================================
   INICIALIZACIÓN DE LA APLICACIÓN SPA
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const publicStorage = new StorageService(CONFIG.publicStorageKey);
    const savedState = publicStorage.get() || { initialized: true };
    const appStore = new Store(savedState);

    appStore.subscribe((newState) => {
        publicStorage.save(newState);
    });

    // Mapa único de rutas para las 7 secciones
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

    const router = new Router(routes, 'app-root');
    router.resolveRoute();

    initPhoenixCosmosEngine();
    initYouTubeAudioEngine();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('[App] SW Registrado en scope:', reg.scope))
            .catch(err => console.error('[App] SW Error de registro:', err));
    }
});