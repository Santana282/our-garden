import { syncEngine, SUPABASE_SETUP_SQL } from '../core/sync.js';
import { LIBRARY_CATEGORIES, INITIAL_BOOKS } from './library-view.js';

export const STORAGE_BUCKET_SQL = `insert into storage.buckets (id, name, public)
values ('garden-media', 'garden-media', true)
on conflict (id) do update set public = true;

drop policy if exists "Subida compartida Kevin y Analy" on storage.objects;
drop policy if exists "Lectura compartida Kevin y Analy" on storage.objects;

create policy "Subida compartida Kevin y Analy"
on storage.objects for insert
with check (bucket_id = 'garden-media');

create policy "Lectura compartida Kevin y Analy"
on storage.objects for select
using (bucket_id = 'garden-media');`;

export class StarOsView extends HTMLElement {
    constructor() {
        super();
        this.activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.visualTheme = localStorage.getItem('our_garden_visual_theme') || 'phoenix';
        this.sparklesEnabled = localStorage.getItem('our_garden_sparkles') !== 'false';
        this.prefs = JSON.parse(localStorage.getItem('our_garden_universe_prefs_v1')) || {
            gyroSensitivity: 1.2,
            motionMode: 'auto',
            constructionAnimEnabled: true
        };
        this.adminUnlocked = sessionStorage.getItem('our_garden_admin_unlocked') === 'true';
        this.adminTab = 'quotes'; // 'quotes' | 'library' | 'media' | 'special'
        this.statusBanner = '';

        this.boundSyncUpdate = () => {
            this.render();
            this.bindEvents();
        };
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
        window.addEventListener('ecosystem:sync-updated', this.boundSyncUpdate);
    }

    disconnectedCallback() {
        window.removeEventListener('ecosystem:sync-updated', this.boundSyncUpdate);
    }

    savePrefs() {
        localStorage.setItem('our_garden_universe_prefs_v1', JSON.stringify(this.prefs));
        window.dispatchEvent(new CustomEvent('ecosystem:universe-prefs', { detail: this.prefs }));
        syncEngine.syncNow();
    }

    render() {
        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">💻 Star-OS • Control y Administración</h1>
                <p class="hero-subtitle">
                    Sincronización en tiempo real, calibración de sensores y administración protegida de contenidos.
                </p>
            </section>

            <!-- SEMÁFORO DE NUBE -->
            <div style="background:rgba(52, 211, 153, 0.14);border:1.5px solid #34d399;padding:14px;border-radius:16px;margin-bottom:14px;">
                <div style="font-weight:900;font-size:0.9rem;color:#34d399;margin-bottom:4px;">
                    🟢 ECOSISTEMA CONECTADO Y ACTIVO (.supabase.co)
                </div>
                <div style="font-size:0.8rem;color:var(--text-primary);line-height:1.45;">
                    Servidor: <strong>gxbuwjtiurgxtzjmwgeg.supabase.co</strong> • Espacio: <strong>kevin-analy-22072026</strong><br>
                    Estado: <strong>${syncEngine.lastNote}</strong>
                </div>
                <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
                    <button type="button" class="loc-chip active" id="btn-copy-storage-sql">
                        📦 Copiar SQL de Bóveda Multimedia (garden-media)
                    </button>
                    <button type="button" class="loc-chip" id="btn-clean-cache">
                        🧹 Limpiar Caché y Reconectar
                    </button>
                </div>
            </div>

            ${this.statusBanner ? `
                <div style="background:rgba(52,211,153,0.18);border:1px solid var(--border-green);padding:12px 14px;border-radius:12px;font-size:0.83rem;color:#fff;margin-bottom:14px;text-align:center;">
                    ${this.statusBanner}
                </div>
            ` : ''}

            <!-- 1. PERFILES Y SINCRONIZACIÓN -->
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

                <button type="button" class="loc-chip active" id="btn-copy-clean-link" style="width:100%;padding:10px;text-align:center;font-size:0.8rem;">
                    📲 Copiar nuestro link oficial para mandárselo a Analy
                </button>
            </div>

            <!-- 2. CALIBRACIÓN DEL UNIVERSO Y SENSORES -->
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

            <!-- 3. SECCIÓN 27: ADMINISTRACIÓN PROTEGIDA DE CONTENIDOS -->
            <div class="stage-card" style="margin-bottom:14px;border-color:var(--border-gold);">
                <div class="stage-title">🔐 3. Administración Protegida de Contenidos (Sección 27)</div>
                ${!this.adminUnlocked ? `
                    <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:10px;">
                        Ingresa nuestra clave de pareja (<strong>2207</strong> por el 22 de julio) para gestionar la Biblioteca, Frases Diarias, Categorías, Fotografías y Mensajes Especiales sin tocar el código:
                    </p>
                    <div style="display:flex;gap:8px;">
                        <input type="password" id="inp-admin-pin" placeholder="PIN (2207)" maxlength="8" style="flex:1;background:#060a17;border:1px solid var(--border-subtle);padding:9px 12px;border-radius:10px;font-size:0.86rem;">
                        <button type="button" class="pill-action-btn" id="btn-unlock-admin">🔓 Desbloquear Panel</button>
                    </div>
                ` : this.renderAdminPanel()}
            </div>

            <!-- 4. INSTALACIÓN PWA Y RESPALDO EN ARCHIVO -->
            <div class="stage-card">
                <div class="stage-title">📦 4. Instalar App en Teléfono y Copias de Seguridad</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;">
                    <button type="button" class="pill-action-btn" id="btn-install-pwa">📲 Instalar App en Pantalla de Inicio</button>
                    <button type="button" class="pill-action-btn" id="btn-export-backup" style="border-color:var(--border-gold);color:var(--accent-sunflower-soft);">⬇️ Exportar Todo (.json)</button>
                    <label class="loc-chip" style="cursor:pointer;">
                        ⬆️ Importar Respaldo (.json)
                        <input type="file" id="inp-import-backup" accept=".json" style="display:none;">
                    </label>
                </div>
                <div id="pwa-install-hint" style="display:none;font-size:0.78rem;color:var(--text-secondary);background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;margin-top:6px;">
                    📱 <strong>En iPhone (Safari):</strong> Toca el botón <strong>Compartir</strong> en la barra inferior y elige <strong>"Agregar a pantalla de inicio"</strong>.<br>
                    🤖 <strong>En Android (Chrome):</strong> Toca los 3 puntos arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong>.
                </div>
            </div>
        `;
    }

    renderAdminPanel() {
        return `
            <div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:12px;padding-bottom:4px;">
                <button type="button" class="loc-chip ${this.adminTab === 'quotes' ? 'active' : ''}" data-admtab="quotes">✨ Frases Diarias</button>
                <button type="button" class="loc-chip ${this.adminTab === 'library' ? 'active' : ''}" data-admtab="library">📚 Biblioteca y Categorías</button>
                <button type="button" class="loc-chip ${this.adminTab === 'media' ? 'active' : ''}" data-admtab="media">🖼️ Subir Fotos/Audios</button>
                <button type="button" class="loc-chip ${this.adminTab === 'lock' ? 'active' : ''}" id="btn-lock-admin">🔒 Bloquear</button>
            </div>

            ${this.adminTab === 'quotes' ? `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <strong style="font-size:0.82rem;color:var(--accent-sunflower-soft);">Publicar nueva frase en "Una luz para hoy":</strong>
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
            ` : ''}

            ${this.adminTab === 'library' ? `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <strong style="font-size:0.82rem;color:var(--accent-sunflower-soft);">Agregar Libro o Poema Rápido a la Biblioteca:</strong>
                    <input type="text" id="adm-lib-title" placeholder="Título del poema o libro" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.83rem;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <input type="text" id="adm-lib-author" placeholder="Autor(a)" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                        <select id="adm-lib-cat" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                            ${LIBRARY_CATEGORIES.filter(c => c !== 'Todas').map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    <textarea id="adm-lib-body" rows="3" placeholder="Contenido del poema o capítulo..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;"></textarea>
                    <button type="button" class="pill-action-btn" id="btn-adm-save-book" style="align-self:flex-end;">
                        📚 Publicar en Biblioteca del Amor
                    </button>
                </div>
            ` : ''}

            ${this.adminTab === 'media' ? `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <strong style="font-size:0.82rem;color:var(--accent-sunflower-soft);">Subir Fotografía o Audio directo al Diario Compartido:</strong>
                    <input type="text" id="adm-media-title" placeholder="Título del recuerdo multimedia (ej. Foto juntos)" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.83rem;">
                    <label class="loc-chip active" style="cursor:pointer;text-align:center;padding:10px;">
                        ☁️ Seleccionar Foto o Audio para subir a Supabase
                        <input type="file" id="adm-media-file" accept="image/*,audio/*" style="display:none;">
                    </label>
                </div>
            ` : ''}
        `;
    }

    bindEvents() {
        this.querySelector('#btn-copy-storage-sql')?.addEventListener('click', () => {
            navigator.clipboard?.writeText(STORAGE_BUCKET_SQL);
            this.statusBanner = '✅ SQL de Bóveda Multimedia (garden-media) copiado al portapapeles. Pégalo en el SQL Editor de Supabase y dale Run.';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-clean-cache')?.addEventListener('click', async () => {
            this.statusBanner = '🧹 Limpiando caché y verificando conexión...';
            this.render();
            this.bindEvents();
            const res = await syncEngine.clearCacheAndReconnect();
            this.statusBanner = res.message;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-push-cloud')?.addEventListener('click', async () => {
            this.statusBanner = '⏳ Subiendo cambios a Supabase...';
            this.render();
            this.bindEvents();
            const res = await syncEngine.syncNow();
            this.statusBanner = res.message;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-pull-cloud')?.addEventListener('click', async () => {
            this.statusBanner = '⏳ Consultando actualizaciones de pareja...';
            this.render();
            this.bindEvents();
            const res = await syncEngine.pullFromCloud();
            if (res.ok && res.updatedBy) {
                this.statusBanner = `🟢 ¡Sincronizado! Última actualización por ${res.updatedBy === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}.`;
            } else {
                const pushRes = await syncEngine.syncNow();
                this.statusBanner = pushRes.message;
            }
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-copy-clean-link')?.addEventListener('click', () => {
            const url = 'https://santana282.github.io/our-garden/';
            navigator.clipboard?.writeText(url);
            this.statusBanner = '✅ Link oficial copiado listo para enviárselo a Analy.';
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-switch-user]').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.activeUser = btn.dataset.switchUser;
                await syncEngine.loginPartner(this.activeUser);
                this.statusBanner = `👤 Perfil activo cambiado a ${this.activeUser === 'kevin' ? 'Kevin 💻' : 'Analy 👩🏻‍🍳'} y sincronizado en verde 🟢.`;
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

        // Desbloqueo y acciones del Panel Administrativo (Sección 27)
        this.querySelector('#btn-unlock-admin')?.addEventListener('click', () => {
            const pin = this.querySelector('#inp-admin-pin')?.value.trim();
            if (pin === '2207' || pin.toLowerCase() === 'amor') {
                this.adminUnlocked = true;
                sessionStorage.setItem('our_garden_admin_unlocked', 'true');
                this.statusBanner = '🔓 Panel de Administración de Contenidos desbloqueado.';
            } else {
                this.statusBanner = '⚠️ Clave incorrecta. Usa 2207 (por el 22 de julio).';
            }
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-lock-admin')?.addEventListener('click', () => {
            this.adminUnlocked = false;
            sessionStorage.removeItem('our_garden_admin_unlocked');
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-admtab]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.admtab === 'lock') return;
                this.adminTab = btn.dataset.admtab;
                this.render();
                this.bindEvents();
            });
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

        this.querySelector('#btn-adm-save-book')?.addEventListener('click', () => {
            const title = this.querySelector('#adm-lib-title')?.value.trim();
            const author = this.querySelector('#adm-lib-author')?.value.trim() || 'Kevin & Analy';
            const category = this.querySelector('#adm-lib-cat')?.value || 'Poesía romántica';
            const body = this.querySelector('#adm-lib-body')?.value.trim();
            if (!title || !body) return;

            const savedLib = JSON.parse(localStorage.getItem('our_garden_library_v1')) || { books: INITIAL_BOOKS };
            savedLib.books = savedLib.books || INITIAL_BOOKS;
            savedLib.books.unshift({
                id: 'book-' + Date.now(),
                title,
                author,
                category,
                coverEmoji: '🌟',
                coverGradient: 'linear-gradient(135deg, #be123c, #1e1b4b)',
                license: 'Publicado desde Administración',
                description: `Obra agregada por ${this.activeUser === 'kevin' ? 'Kevin' : 'Analy'}.`,
                recommendedBy: this.activeUser,
                favorite: true,
                progress: 0,
                bookmarkChapter: 0,
                notes: [],
                chapters: [{ title: 'Capítulo 1', body }]
            });
            localStorage.setItem('our_garden_library_v1', JSON.stringify(savedLib));
            syncEngine.syncNow();

            this.statusBanner = `📚 "${title}" publicado en la Biblioteca del Amor y sincronizado.`;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#adm-media-file')?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const title = this.querySelector('#adm-media-title')?.value.trim() || `Recuerdo multimedia (${file.name})`;
            this.statusBanner = '⏳ Subiendo archivo a Supabase Storage...';
            this.render();
            this.bindEvents();

            const isAudio = file.type.startsWith('audio/');
            const res = await syncEngine.uploadMediaFile(file, isAudio ? 'audios' : 'photos');
            if (res.ok) {
                const entries = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || [];
                const now = new Date();
                entries.unshift({
                    id: 'entry-' + Date.now(),
                    space: 'shared',
                    author: this.activeUser,
                    date: now.toISOString().split('T')[0],
                    time: now.toTimeString().slice(0, 5),
                    title,
                    content: 'Archivo subido desde el Panel de Administración de Star-OS.',
                    tags: ['Destacado', 'Multimedia'],
                    highlighted: true,
                    sharedWithPartner: true,
                    photoUrl: isAudio ? '' : res.url,
                    audioUrl: isAudio ? res.url : ''
                });
                localStorage.setItem('our_garden_diary_v1', JSON.stringify(entries));
                await syncEngine.syncNow();
                this.statusBanner = '✅ Archivo subido y publicado en Nuestro Diario Compartido.';
            } else {
                this.statusBanner = `⚠️ ${res.message}`;
            }
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-install-pwa')?.addEventListener('click', async () => {
            if (window.deferredPwaPrompt) {
                window.deferredPwaPrompt.prompt();
                await window.deferredPwaPrompt.userChoice;
                window.deferredPwaPrompt = null;
            } else {
                const hint = this.querySelector('#pwa-install-hint');
                if (hint) hint.style.display = 'block';
            }
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