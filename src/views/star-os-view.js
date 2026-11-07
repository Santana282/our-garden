import { syncEngine } from '../core/sync.js';
import { LIBRARY_CATEGORIES, INITIAL_BOOKS } from './library-view.js';
import { DEFAULT_DAILY_LIGHTS } from './home-view.js';

export class StarOsView extends HTMLElement {
    constructor() {
        super();
        this.activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.visualTheme = localStorage.getItem('our_garden_visual_theme') || 'phoenix';
        this.sparklesEnabled = localStorage.getItem('our_garden_sparkles') !== 'false';
        this.prefs = JSON.parse(localStorage.getItem('our_garden_universe_prefs_v1')) || {
            gyroSensitivity: 1.2,
            motionMode: 'auto', // 'auto' | 'manual'
            constructionAnimEnabled: true
        };
        this.statusBanner = '';
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    savePrefs() {
        localStorage.setItem('our_garden_universe_prefs_v1', JSON.stringify(this.prefs));
        window.dispatchEvent(new CustomEvent('ecosystem:universe-prefs', { detail: this.prefs }));
        syncEngine.syncNow();
    }

    getSemaphoreBadge() {
        if (syncEngine.connectionState === 'error') {
            return {
                color: '#fb7185',
                bg: 'rgba(251, 113, 133, 0.14)',
                title: '🔴 FALTA CREAR LA TABLA EN SUPABASE (PASO 4.2)',
                desc: `Detalle: ${syncEngine.lastError}. Abre el SQL Editor en Supabase, pega las 12 líneas de la guía y toca Run.`
            };
        }
        return {
            color: '#34d399',
            bg: 'rgba(52, 211, 153, 0.14)',
            title: '🟢 NUBE SUPABASE INTEGRADA Y ACTIVA',
            desc: `Proyecto: gxbuwjtiurgxtzjmwgeg • Espacio: ${syncEngine.config.coupleSpaceId} • Última sinc.: ${syncEngine.lastSyncTime}`
        };
    }

    render() {
        const sem = this.getSemaphoreBadge();

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">💻 Star-OS • Centro de Control y Administración</h1>
                <p class="hero-subtitle">
                    Sincronización en la nube, calibración del giroscopio, motor de construcción visual y administración de contenidos.
                </p>
            </section>

            <!-- SEMÁFORO DE ESTADO DE LA NUBE -->
            <div style="background:${sem.bg};border:1.5px solid ${sem.color};padding:14px;border-radius:16px;margin-bottom:14px;">
                <div style="font-weight:900;font-size:0.9rem;color:${sem.color};margin-bottom:4px;">${sem.title}</div>
                <div style="font-size:0.8rem;color:var(--text-primary);">${sem.desc}</div>
            </div>

            ${this.statusBanner ? `
                <div style="background:rgba(56,189,248,0.16);border:1px solid var(--border-cyan);padding:12px 14px;border-radius:12px;font-size:0.83rem;color:#fff;margin-bottom:14px;text-align:center;">
                    ${this.statusBanner}
                </div>
            ` : ''}

            <!-- 1. SINCRONIZACIÓN DIRECTA Y PERFIL ACTIVO -->
            <div class="stage-card" style="margin-top:0;margin-bottom:14px;">
                <div class="stage-title">☁️ 1. Perfiles y Sincronización Bidireccional</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                    <button type="button" class="element-btn-card ${this.activeUser === 'kevin' ? 'water' : ''}" data-switch-user="kevin">
                        <span class="card-label">💻 PERFIL 1</span>
                        <div class="card-value" style="font-size:0.86rem;">Kevin Santana</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.activeUser === 'analy' ? 'sun' : ''}" data-switch-user="analy">
                        <span class="card-label">👩🏻‍🍳 PERFIL 2</span>
                        <div class="card-value" style="font-size:0.86rem;">Analy Monserrat</div>
                    </button>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <button type="button" class="pill-action-btn" id="btn-push-cloud" style="justify-content:center;padding:11px;">
                        ⬆️ Subir mis cambios
                    </button>
                    <button type="button" class="pill-action-btn" id="btn-pull-cloud" style="justify-content:center;padding:11px;border-color:var(--border-gold);color:var(--accent-sunflower-soft);">
                        ⬇️ Descargar de pareja
                    </button>
                </div>
            </div>

            <!-- 2. CONTROLES AVANZADOS DE GIROSCOPIO Y CONSTRUCCIÓN VISUAL (SECCIONES 23 Y 24) -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">🪐 2. Calibración del Universo, Giroscopio y Construcción Visual</div>
                <div class="cards-grid-3" style="margin-bottom:12px;">
                    <button type="button" class="element-btn-card ${this.visualTheme === 'phoenix' ? 'sun' : ''}" data-theme="phoenix">
                        <span class="card-label">🌸 MODO 1</span>
                        <div class="card-value" style="font-size:0.8rem;">Horario Dinámico</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.visualTheme === 'enologia' ? 'water' : ''}" data-theme="enologia">
                        <span class="card-label">🍷 MODO 2</span>
                        <div class="card-value" style="font-size:0.8rem;">Nebulosa Enología</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.visualTheme === 'alba' ? 'earth' : ''}" data-theme="alba">
                        <span class="card-label">🌻 MODO 3</span>
                        <div class="card-value" style="font-size:0.8rem;">Girasol Dorado</div>
                    </button>
                </div>

                <div style="display:flex;flex-direction:column;gap:10px;font-size:0.82rem;">
                    <div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;">
                        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                            <span>🎚️ Sensibilidad del Giroscopio / Parallax:</span>
                            <strong id="lbl-gyro-sens" style="color:var(--accent-sunflower);">${this.prefs.gyroSensitivity}x</strong>
                        </div>
                        <input type="range" id="rng-gyro-sens" min="0.4" max="2.5" step="0.1" value="${this.prefs.gyroSensitivity}" style="width:100%;">
                        <div style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
                            <button type="button" class="loc-chip active" id="btn-reset-gyro-center">🎯 Restaurar Posición Inicial</button>
                            <button type="button" class="loc-chip ${this.prefs.motionMode === 'auto' ? 'active' : ''}" id="btn-toggle-motion-mode">
                                🔄 Movimiento: ${this.prefs.motionMode === 'auto' ? 'Automático Suave + Sensor' : 'Solo Manual / Sensor'}
                            </button>
                        </div>
                    </div>

                    <label style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;cursor:pointer;">
                        <span>⚡ Secuencia de Construcción Visual (Flechas y partículas al navegar)</span>
                        <input type="checkbox" id="chk-construction-anim" ${this.prefs.constructionAnimEnabled ? 'checked' : ''}>
                    </label>

                    <label style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;cursor:pointer;">
                        <span>✨ Mostrar chispas de emojis al tocar la pantalla</span>
                        <input type="checkbox" id="chk-sparkles" ${this.sparklesEnabled ? 'checked' : ''}>
                    </label>
                </div>
            </div>

            <!-- 3. ADMINISTRACIÓN DE CONTENIDOS (SECCIÓN 27) -->
            <div class="stage-card" style="margin-bottom:14px;border-color:var(--border-gold);">
                <div class="stage-title">🛠️ 3. Administración de Contenidos (Sin tocar código)</div>
                <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:10px;">
                    Agrega nuevas frases diarias a <strong>"Una luz para hoy"</strong> o publica mensajes especiales directamente en nuestro ecosistema:
                </p>

                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="adm-quote-text" placeholder="Texto del versículo o reflexión filosófica..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.83rem;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <input type="text" id="adm-quote-author" placeholder="Autor o cita (ej. Salmos 23:1)" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                        <input type="text" id="adm-quote-version" placeholder="Fuente (ej. Reina-Valera 1909)" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                    </div>
                    <select id="adm-quote-cat" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                        <option value="Versículos bíblicos">Versículos bíblicos</option>
                        <option value="Reflexiones filosóficas">Reflexiones filosóficas</option>
                        <option value="Pensamientos sobre el amor">Pensamientos sobre el amor</option>
                        <option value="Reflexiones sobre la paciencia">Reflexiones sobre la paciencia</option>
                        <option value="Frases sobre el perdón">Frases sobre el perdón</option>
                        <option value="Enseñanzas sobre humildad">Enseñanzas sobre humildad</option>
                        <option value="Reflexiones sobre responsabilidad">Reflexiones sobre responsabilidad</option>
                        <option value="Pensamientos sobre disciplina y crecimiento">Pensamientos sobre disciplina y crecimiento</option>
                        <option value="Mensajes sobre esperanza y perseverancia">Mensajes sobre esperanza y perseverancia</option>
                        <option value="Reflexiones sobre el cuidado de los demás">Reflexiones sobre el cuidado de los demás</option>
                    </select>
                    <textarea id="adm-quote-ref" rows="2" placeholder="Explicación o aplicación práctica para nosotros..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;"></textarea>
                    <button type="button" class="pill-action-btn" id="btn-adm-save-quote" style="align-self:flex-end;">
                        ✨ Publicar en "Una luz para hoy"
                    </button>
                </div>
            </div>

            <!-- 4. RESPALDO EN ARCHIVO -->
            <div class="stage-card">
                <div class="stage-title">📦 4. Copias de Seguridad Completas</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button type="button" class="pill-action-btn" id="btn-export-backup">⬇️ Exportar Todo (.json)</button>
                    <label class="loc-chip" style="cursor:pointer;">
                        ⬆️ Importar Respaldo (.json)
                        <input type="file" id="inp-import-backup" accept=".json" style="display:none;">
                    </label>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelector('#btn-push-cloud')?.addEventListener('click', async () => {
            this.statusBanner = '⏳ Subiendo datos a Supabase...';
            this.render();
            this.bindEvents();
            const res = await syncEngine.syncNow();
            this.statusBanner = res.message;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-pull-cloud')?.addEventListener('click', async () => {
            this.statusBanner = '⏳ Consultando base de datos en Supabase...';
            this.render();
            this.bindEvents();
            const res = await syncEngine.pullFromCloud();
            if (res.ok && res.empty) {
                const pushRes = await syncEngine.syncNow();
                this.statusBanner = pushRes.ok
                    ? '🟢 ¡Tabla verificada e inicializada con éxito en Supabase!'
                    : pushRes.message;
            } else if (res.ok) {
                this.statusBanner = `🟢 ¡Sincronizado! Última actualización por ${res.updatedBy === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}.`;
            } else {
                this.statusBanner = `🔴 Error: ${res.error || 'Ejecuta el Paso 4.2 en el SQL Editor de Supabase.'}`;
            }
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-switch-user]').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.activeUser = btn.dataset.switchUser;
                await syncEngine.loginPartner(this.activeUser);
                this.statusBanner = `👤 Perfil activo cambiado a ${this.activeUser === 'kevin' ? 'Kevin 💻' : 'Analy 👩🏻‍🍳'}.`;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.visualTheme = btn.dataset.theme;
                localStorage.setItem('our_garden_visual_theme', this.visualTheme);
                window.dispatchEvent(new CustomEvent('ecosystem:theme-change', { detail: { theme: this.visualTheme } }));
                this.statusBanner = '🪐 Atmósfera del universo actualizada.';
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#rng-gyro-sens')?.addEventListener('input', (e) => {
            this.prefs.gyroSensitivity = Number(e.target.value);
            const lbl = this.querySelector('#lbl-gyro-sens');
            if (lbl) lbl.textContent = `${this.prefs.gyroSensitivity}x`;
            this.savePrefs();
        });

        this.querySelector('#btn-reset-gyro-center')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('ecosystem:reset-cosmos-origin'));
            this.statusBanner = '🎯 Posición del observatorio centrada.';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-toggle-motion-mode')?.addEventListener('click', () => {
            this.prefs.motionMode = this.prefs.motionMode === 'auto' ? 'manual' : 'auto';
            this.savePrefs();
            this.render();
            this.bindEvents();
        });

        this.querySelector('#chk-construction-anim')?.addEventListener('change', (e) => {
            this.prefs.constructionAnimEnabled = e.target.checked;
            this.savePrefs();
        });

        this.querySelector('#chk-sparkles')?.addEventListener('change', (e) => {
            this.sparklesEnabled = e.target.checked;
            localStorage.setItem('our_garden_sparkles', String(this.sparklesEnabled));
        });

        this.querySelector('#btn-adm-save-quote')?.addEventListener('click', () => {
            const quote = this.querySelector('#adm-quote-text')?.value.trim();
            const author = this.querySelector('#adm-quote-author')?.value.trim();
            const sourceVersion = this.querySelector('#adm-quote-version')?.value.trim() || 'Atribución verificada';
            const category = this.querySelector('#adm-quote-cat')?.value || 'Pensamientos sobre el amor';
            const reflection = this.querySelector('#adm-quote-ref')?.value.trim() || 'Agregada desde nuestro panel de administración.';

            if (!quote || !author) return;

            const lightState = JSON.parse(localStorage.getItem('our_garden_daily_light_v1')) || {
                customPhrases: [],
                favorites: [],
                reflections: [],
                selectedCategory: 'Todas',
                manualIndex: 0
            };
            lightState.customPhrases = lightState.customPhrases || [];
            lightState.customPhrases.unshift({
                id: 'luz-' + Date.now(),
                quote,
                author,
                sourceVersion,
                category,
                date: new Date().toISOString().split('T')[0],
                reflection
            });
            lightState.manualIndex = 0;
            localStorage.setItem('our_garden_daily_light_v1', JSON.stringify(lightState));
            syncEngine.syncNow();

            this.statusBanner = '✨ Nueva frase publicada en "Una luz para hoy" y sincronizada.';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-export-backup')?.addEventListener('click', () => {
            const payload = syncEngine.collectLocalPayload();
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `respaldo-nuestro-jardin.json`;
            a.click();
            URL.revokeObjectURL(url);
        });

        this.querySelector('#inp-import-backup')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)));
                    this.statusBanner = '✅ Respaldo restaurado.';
                    this.render();
                    this.bindEvents();
                } catch (err) {
                    this.statusBanner = '⚠️ Archivo inválido.';
                    this.render();
                    this.bindEvents();
                }
            };
            reader.readAsText(file);
        });
    }
}

customElements.define('star-os-view', StarOsView);