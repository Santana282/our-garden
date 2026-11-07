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

    getSemaphoreBadge() {
        if (syncEngine.connectionState === 'error') {
            return {
                color: '#fb7185',
                bg: 'rgba(251, 113, 133, 0.14)',
                title: '🔴 ATENCIÓN EN LA TABLA DE SUPABASE',
                desc: `Detalle técnico: ${syncEngine.lastError}. Si dice "relation ecosystem_sync does not exist", solo falta correr el bloque SQL en SQL Editor.`
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
                <h1 class="hero-title" style="font-size:1.75rem;">💻 Star-OS • Centro de Control</h1>
                <p class="hero-subtitle">
                    Sincronización automática en la nube entre Orizaba y Atlixco, perfiles y atmósfera visual.
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

            <!-- 1. SINCRONIZACIÓN DIRECTA EN UN TOQUE -->
            <div class="stage-card" style="margin-top:0;margin-bottom:14px;">
                <div class="stage-title">☁️ 1. Sincronización en Tiempo Real (Kevin & Analy)</div>
                <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:12px;">
                    Tus credenciales de Supabase ya están integradas en el código. Cualquier teléfono que abra nuestro link se conecta automáticamente.
                </p>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                    <button type="button" class="pill-action-btn" id="btn-push-cloud" style="justify-content:center;padding:12px;">
                        ⬆️ Subir mis cambios ahora
                    </button>
                    <button type="button" class="pill-action-btn" id="btn-pull-cloud" style="justify-content:center;padding:12px;border-color:var(--border-gold);color:var(--accent-sunflower-soft);">
                        ⬇️ Descargar cambios de pareja
                    </button>
                </div>

                <button type="button" class="loc-chip active" id="btn-copy-clean-link" style="width:100%;padding:10px;text-align:center;font-size:0.8rem;">
                    📲 Copiar nuestro link oficial para mandárselo a Analy
                </button>
            </div>

            <!-- 2. ¿QUIÉN ESTÁ USANDO ESTE TELÉFONO? -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">🔐 2. ¿Quién está usando este teléfono?</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <button type="button" class="element-btn-card ${this.activeUser === 'kevin' ? 'water' : ''}" data-switch-user="kevin">
                        <span class="card-label">💻 PERFIL 1</span>
                        <div class="card-value" style="font-size:0.86rem;">Kevin Santana</div>
                    </button>
                    <button type="button" class="element-btn-card ${this.activeUser === 'analy' ? 'sun' : ''}" data-switch-user="analy">
                        <span class="card-label">👩🏻‍🍳 PERFIL 2</span>
                        <div class="card-value" style="font-size:0.86rem;">Analy Monserrat</div>
                    </button>
                </div>
            </div>

            <!-- 3. ATMÓSFERA DEL AGUJERO NEGRO -->
            <div class="stage-card" style="margin-bottom:14px;">
                <div class="stage-title">🪐 3. Modo Visual del Agujero Negro</div>
                <div class="cards-grid-3" style="margin-bottom:10px;">
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

                <label style="display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,0.03);padding:10px;border-radius:10px;cursor:pointer;font-size:0.82rem;">
                    <span>✨ Mostrar chispas de emojis al tocar la pantalla</span>
                    <input type="checkbox" id="chk-sparkles" ${this.sparklesEnabled ? 'checked' : ''}>
                </label>
            </div>

            <!-- 4. RESPALDO EN ARCHIVO -->
            <div class="stage-card">
                <div class="stage-title">📦 4. Copias de Seguridad Locales</div>
                <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    <button type="button" class="pill-action-btn" id="btn-export-backup">⬇️ Exportar Respaldo (.json)</button>
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
                    ? '🟢 ¡Base de datos inicializada con éxito! Ya se guardó el primer paquete en Supabase.'
                    : pushRes.message;
            } else if (res.ok) {
                this.statusBanner = `🟢 ¡Sincronizado! Última actualización hecha por ${res.updatedBy === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}.`;
            } else {
                this.statusBanner = `🔴 Error: ${res.error || 'Verifica que hayas ejecutado el código SQL en Supabase.'}`;
            }
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-copy-clean-link')?.addEventListener('click', () => {
            const url = 'https://santana282.github.io/our-garden/';
            navigator.clipboard?.writeText(url);
            this.statusBanner = '✅ Link copiado: https://santana282.github.io/our-garden/ (Ya tiene Supabase integrado para Analy).';
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-switch-user]').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.activeUser = btn.dataset.switchUser;
                await syncEngine.loginPartner(this.activeUser);
                this.statusBanner = `👤 Perfil activo cambiado a ${this.activeUser === 'kevin' ? 'Kevin 💻' : 'Analy 👩🏻‍🍳'} y sincronizado.`;
                this.render();
                this.bindEvents();
            });
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