import { syncEngine } from '../core/sync.js';

export class StarOsView extends HTMLElement {
    constructor() {
        super();
        this.activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.visualTheme = localStorage.getItem('our_garden_visual_theme') || 'phoenix';
        this.sparklesEnabled = localStorage.getItem('our_garden_sparkles') !== 'false';
        this.statusBanner = '';
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    render() {
        const cfg = syncEngine.config;
        const session = syncEngine.session;
        const cycleData = JSON.parse(localStorage.getItem('our_garden_cycle_v1')) || {};
        const cityMode = localStorage.getItem('jardin_city_mode') || 'dual';

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">💻 Star-OS • Centro de Control</h1>
                <p class="hero-subtitle">
                    Gestión de perfiles, sincronización en tiempo real entre nuestros teléfonos, privacidad y respaldos.
                </p>
            </section>

            ${this.statusBanner ? `
                <div style="background:rgba(52,211,153,0.14);border:1px solid var(--border-green);padding:10px 14px;border-radius:12px;font-size:0.82rem;color:var(--accent-emerald);margin-bottom:14px;text-align:center;">
                    ${this.statusBanner}
                </div>
            ` : ''}

            <!-- 1. PERFILES AUTORIZADOS Y SESIÓN -->
            <div class="stage-card" style="margin-top:0;margin-bottom:14px;">
                <div class="stage-title">🔐 1. Perfiles Autorizados y Sesión Privada</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                    <div class="glass-card" style="border-color:${this.activeUser === 'kevin' ? 'var(--accent-sky)' : 'var(--border-subtle)'};text-align:left;">
                        <div style="font-size:1.3rem;">💻 Kevin Santana</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);margin:4px 0 8px;">
                            Orizaba, Ver. • Ingeniería & Desarrollo Web • Jiu-Jitsu (Morada)
                        </div>
                        <button type="button" class="loc-chip ${this.activeUser === 'kevin' ? 'active' : ''}" data-switch-user="kevin" style="width:100%;text-align:center;">
                            ${this.activeUser === 'kevin' ? '✅ Perfil Activo' : 'Activar Perfil'}
                        </button>
                    </div>

                    <div class="glass-card" style="border-color:${this.activeUser === 'analy' ? 'var(--accent-rose)' : 'var(--border-subtle)'};text-align:left;">
                        <div style="font-size:1.3rem;">👩🏻‍🍳 Analy Monserrat</div>
                        <div style="font-size:0.75rem;color:var(--text-secondary);margin:4px 0 8px;">
                            Atlixco, Pue. • Gastronomía & Enología • Chef del Ecosistema
                        </div>
                        <button type="button" class="loc-chip ${this.activeUser === 'analy' ? 'active' : ''}" data-switch-user="analy" style="width:100%;text-align:center;">
                            ${this.activeUser === 'analy' ? '✅ Perfil Activo' : 'Activar Perfil'}
                        </button>
                    </div>
                </div>

                <div style="background:rgba(255,255,255,0.03);padding:10px 12px;border-radius:10px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;font-size:0.8rem;">
                    <span>
                        Estado de sesión: <strong>${session ? `Conectado como ${session.role.toUpperCase()}` : 'Sesión local rápida'}</strong>
                    </span>
                    ${session ? `
                        <button type="button" class="loc-chip" id="btn-logout-session">🚪 Cerrar sesión</button>
                    ` : `
                        <button type="button" class="pill-action-btn" id="btn-quick-auth" style="padding:4px 12px;font-size:0.75rem;">🔑 Iniciar sesión verificada</button>
                    `}
                </div>
            </div>

            <!-- 2. SINCRONIZACIÓN EN TIEMPO REAL (SUPABASE CLOUD) -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">☁️ 2. Sincronización Bidireccional entre Teléfonos</div>
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:10px;">
                    Conecta nuestra base de datos en Supabase para que cada riego de girasol, acuerdo o diario compartido se actualice en ambos teléfonos.
                </p>

                <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(56,189,248,0.08);padding:10px 12px;border-radius:10px;margin-bottom:12px;font-size:0.8rem;flex-wrap:wrap;gap:8px;">
                    <span>📡 Última sincronización: <strong id="sync-last-time">${syncEngine.lastSyncTime}</strong></span>
                    <div style="display:flex;gap:6px;">
                        <button type="button" class="loc-chip" id="btn-pull-cloud">⬇️ Descargar de Pareja</button>
                        <button type="button" class="pill-action-btn" id="btn-push-cloud" style="padding:5px 12px;font-size:0.75rem;">🔄 Sincronizar Ahora</button>
                    </div>
                </div>

                <details style="font-size:0.8rem;color:var(--text-secondary);">
                    <summary style="cursor:pointer;color:var(--accent-sunflower-soft);font-weight:700;margin-bottom:8px;">
                        ⚙️ Configurar Credenciales Públicas de Supabase (URL y Anon Key)
                    </summary>
                    <div style="display:flex;flex-direction:column;gap:8px;padding-top:6px;">
                        <input type="url" id="sb-url-input" value="${cfg.supabaseUrl}" placeholder="https://tu-proyecto.supabase.co" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;font-size:0.8rem;">
                        <input type="text" id="sb-key-input" value="${cfg.supabaseAnonKey}" placeholder="Anon Public Key (eyJhbGci...)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;font-size:0.8rem;">
                        <input type="text" id="sb-space-input" value="${cfg.coupleSpaceId}" placeholder="Código privado de pareja (ej. kevin-analy-22072026)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;font-size:0.8rem;">
                        <button type="button" class="pill-action-btn" id="btn-save-supabase" style="align-self:flex-end;">💾 Guardar Conexión en Nube</button>
                    </div>
                </details>
            </div>

            <!-- 3. PREFERENCIAS VISUALES Y SENSORES -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">🪐 3. Modos Visuales del Agujero Negro y Sensores</div>
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:10px;">
                    Elige la atmósfera del disco de acreción central manteniendo la identidad de Nuestro Jardín:
                </p>
                <div class="cards-grid-3" style="margin-bottom:12px;">
                    <button type="button" class="element-btn-card ${this.visualTheme === 'phoenix' ? 'sun' : ''}" data-theme="phoenix">
                        <span class="card-label">🌸 MODO 1</span>
                        <div class="card-value" style="font-size:0.8rem;">Phoenix-A Rosa</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.visualTheme === 'enologia' ? 'water' : ''}" data-theme="enologia">
                        <span class="card-label">🍷 MODO 2</span>
                        <div class="card-value" style="font-size:0.8rem;">Azul / Morado</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.visualTheme === 'alba' ? 'earth' : ''}" data-theme="alba">
                        <span class="card-label">🌻 MODO 3</span>
                        <div class="card-value" style="font-size:0.8rem;">Girasol Dorado</div>
                    </button>
                </div>

                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.83rem;">
                    <label style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;cursor:pointer;">
                        <span>✨ Chispas de emojis al tocar la pantalla</span>
                        <input type="checkbox" id="chk-sparkles" ${this.sparklesEnabled ? 'checked' : ''}>
                    </label>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;">
                        <button type="button" class="loc-chip" id="staros-gyro-btn">🪐 Activar / Desactivar Giroscopio</button>
                        <button type="button" class="loc-chip" id="staros-music-btn">🎵 Activar / Pausar Música Ambiental</button>
                    </div>
                </div>
            </div>

            <!-- 4. PRIVACIDAD Y PERMISOS REVOCABLES -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">🛡️ 4. Privacidad y Permisos Revocables</div>
                <div style="display:flex;flex-direction:column;gap:8px;font-size:0.82rem;">
                    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;">
                        <span>📍 Ubicación autorizada actual: <strong>${cityMode.toUpperCase()}</strong></span>
                        <button type="button" class="loc-chip" id="btn-revoke-gps">Revocar GPS y usar manual</button>
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;">
                        <span>🌙 Visibilidad de detalles de "Tus Días" (Solo Analy):</span>
                        <button type="button" class="loc-chip" id="btn-toggle-cycle-priv">
                            ${cycleData.privacyHideDetailsFromPartner ? '🔒 Oculto (Solo cuidado)' : '🔓 Visible para ambos'}
                        </button>
                    </div>
                </div>
            </div>

            <!-- 5. INSTALACIÓN PWA Y RESPALDO DE INFORMACIÓN -->
            <div class="stage-card">
                <div class="stage-title">📦 5. Instalación en Teléfono (PWA) y Respaldos</div>
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">
                    Instala Nuestro Jardín como aplicación nativa o descarga una copia privada de todos nuestros recuerdos y acuerdos.
                </p>
                <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
                    <button type="button" class="pill-action-btn" id="btn-install-pwa">📲 Instalar App en mi Teléfono</button>
                    <button type="button" class="pill-action-btn" id="btn-export-backup" style="border-color:var(--border-gold);color:var(--accent-sunflower-soft);">⬇️ Exportar Copia (.json)</button>
                    <label class="loc-chip" style="cursor:pointer;display:inline-flex;align-items:center;">
                        ⬆️ Importar Copia (.json)
                        <input type="file" id="inp-import-backup" accept=".json" style="display:none;">
                    </label>
                </div>
                <div id="pwa-install-hint" style="font-size:0.76rem;color:var(--text-secondary);display:none;background:rgba(255,255,255,0.04);padding:10px;border-radius:8px;">
                    📱 <strong>En iPhone (Safari):</strong> Toca el botón <strong>Compartir</strong> (cuadrado con flecha hacia arriba) en la barra del navegador y selecciona <strong>"Agregar a pantalla de inicio"</strong>.<br>
                    🤖 <strong>En Android (Chrome):</strong> Toca los tres puntos arriba a la derecha y selecciona <strong>"Instalar aplicación"</strong>.
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('[data-switch-user]').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.activeUser = btn.dataset.switchUser;
                await syncEngine.loginPartner(this.activeUser);
                this.statusBanner = `✅ Perfil activo cambiado a ${this.activeUser === 'kevin' ? 'Kevin 💻' : 'Analy 👩🏻‍🍳'}`;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#btn-quick-auth')?.addEventListener('click', async () => {
            await syncEngine.loginPartner(this.activeUser);
            this.statusBanner = `🔐 Sesión verificada iniciada para ${this.activeUser === 'kevin' ? 'Kevin' : 'Analy'}.`;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-logout-session')?.addEventListener('click', () => {
            syncEngine.logout();
            this.statusBanner = '🚪 Sesión cerrada correctamente.';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-save-supabase')?.addEventListener('click', async () => {
            const url = this.querySelector('#sb-url-input')?.value || '';
            const key = this.querySelector('#sb-key-input')?.value || '';
            const space = this.querySelector('#sb-space-input')?.value || 'kevin-analy-22072026';
            syncEngine.saveCloudConfig(url, key, space);
            const res = await syncEngine.syncNow('config-saved');
            this.statusBanner = res.message;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-push-cloud')?.addEventListener('click', async () => {
            const res = await syncEngine.syncNow('manual-button');
            this.statusBanner = res.message;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-pull-cloud')?.addEventListener('click', async () => {
            const res = await syncEngine.pullFromCloud();
            this.statusBanner = res.ok
                ? `⬇️ Datos sincronizados desde la nube (último cambio por ${res.updatedBy === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}).`
                : 'ℹ️ No se encontraron cambios remotos nuevos o falta configurar Supabase.';
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-theme]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.visualTheme = btn.dataset.theme;
                localStorage.setItem('our_garden_visual_theme', this.visualTheme);
                window.dispatchEvent(new CustomEvent('ecosystem:theme-change', { detail: { theme: this.visualTheme } }));
                this.statusBanner = '🪐 Modo visual del agujero negro actualizado.';
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#chk-sparkles')?.addEventListener('change', (e) => {
            this.sparklesEnabled = e.target.checked;
            localStorage.setItem('our_garden_sparkles', String(this.sparklesEnabled));
        });

        this.querySelector('#staros-gyro-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('ecosystem:toggle-gyro'));
        });

        this.querySelector('#staros-music-btn')?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('ecosystem:toggle-music'));
        });

        this.querySelector('#btn-revoke-gps')?.addEventListener('click', () => {
            localStorage.setItem('jardin_city_mode', 'dual');
            this.statusBanner = '📍 Permiso GPS revocado. Usando ciudad manual (Orizaba / Atlixco).';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-toggle-cycle-priv')?.addEventListener('click', () => {
            if (this.activeUser !== 'analy') {
                this.statusBanner = '🔒 Solo Analy puede modificar la privacidad de su calendario personal.';
                this.render();
                this.bindEvents();
                return;
            }
            const cycleData = JSON.parse(localStorage.getItem('our_garden_cycle_v1')) || {};
            cycleData.privacyHideDetailsFromPartner = !cycleData.privacyHideDetailsFromPartner;
            localStorage.setItem('our_garden_cycle_v1', JSON.stringify(cycleData));
            this.statusBanner = '🌙 Preferencia de privacidad de "Tus Días" actualizada.';
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
            a.download = `respaldo-nuestro-jardin-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            this.statusBanner = '⬇️ Copia de seguridad descargada en tu teléfono.';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#inp-import-backup')?.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result);
                    Object.entries(data).forEach(([k, v]) => {
                        localStorage.setItem(k, JSON.stringify(v));
                    });
                    this.statusBanner = '✅ Copia de seguridad restaurada con éxito.';
                    this.render();
                    this.bindEvents();
                } catch (err) {
                    this.statusBanner = '⚠️ El archivo seleccionado no es un respaldo JSON válido.';
                    this.render();
                    this.bindEvents();
                }
            };
            reader.readAsText(file);
        });
    }
}

customElements.define('star-os-view', StarOsView);