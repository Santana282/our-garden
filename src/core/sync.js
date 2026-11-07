const DEFAULT_SUPABASE_URL = 'https://gxbuwjtiurgxtzjmwgeg.supabase.com';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_Bvhc4UImRIZ6S7i5vRxQHw_XcG0DagF';
const DEFAULT_SPACE_ID = 'kevin-analy-22072026';

const SYNC_KEYS = [
    'jardin_stages_v1',
    'our_garden_sunflowers_v2',
    'our_garden_cycle_v1',
    'our_garden_diary_v1',
    'our_garden_botiquin_v1',
    'our_garden_agreements_v1',
    'our_garden_arcade_scores_v1'
];

export class SyncEngine {
    constructor() {
        const saved = JSON.parse(localStorage.getItem('our_garden_cloud_config')) || {};
        this.config = {
            supabaseUrl: (saved.supabaseUrl || DEFAULT_SUPABASE_URL).replace(/\/rest\/v1\/?$/, '').replace(/\/$/, ''),
            supabaseAnonKey: saved.supabaseAnonKey || DEFAULT_SUPABASE_KEY,
            coupleSpaceId: saved.coupleSpaceId || DEFAULT_SPACE_ID
        };
        // Asegurar que la configuración limpia quede guardada
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));

        this.session = JSON.parse(localStorage.getItem('our_garden_auth_session')) || null;
        this.pendingSync = localStorage.getItem('our_garden_pending_sync') === 'true';
        this.lastSyncTime = localStorage.getItem('our_garden_last_sync') || 'Listo para sincronizar';
        this.connectionState = 'ready';
        this.lastError = '';
        this.pollTimer = null;
    }

    init() {
        // Al abrir la app, descarga los últimos cambios de la nube y si está vacía sube el estado inicial
        if (this.isConfigured() && navigator.onLine) {
            this.pullFromCloud().then((res) => {
                if (res && res.empty) {
                    this.syncNow();
                }
            });
        }

        window.addEventListener('online', () => {
            if (this.pendingSync) this.syncNow();
        });

        // Revisar cada 20 segundos si la otra persona hizo algún cambio
        this.pollTimer = setInterval(() => {
            if (!document.hidden && this.isConfigured() && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 20000);
    }

    isConfigured() {
        return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
    }

    saveCloudConfig(url, anonKey, spaceId = DEFAULT_SPACE_ID) {
        const cleanUrl = (url || DEFAULT_SUPABASE_URL).trim().replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
        let cleanKey = (anonKey || DEFAULT_SUPABASE_KEY).trim();
        if (cleanKey.startsWith('Sb_publishable_')) {
            cleanKey = 's' + cleanKey.slice(1);
        }

        this.config = {
            supabaseUrl: cleanUrl,
            supabaseAnonKey: cleanKey,
            coupleSpaceId: (spaceId || DEFAULT_SPACE_ID).trim()
        };
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));
        this.connectionState = 'ready';
        this.lastError = '';
    }

    getHeaders(extra = {}) {
        return {
            'apikey': this.config.supabaseAnonKey,
            'Authorization': `Bearer ${this.config.supabaseAnonKey}`,
            ...extra
        };
    }

    async loginPartner(role) {
        const cleanRole = role === 'analy' ? 'analy' : 'kevin';
        localStorage.setItem('our_garden_active_user', cleanRole);

        this.session = {
            role: cleanRole,
            loggedAt: new Date().toISOString()
        };
        localStorage.setItem('our_garden_auth_session', JSON.stringify(this.session));
        if (this.isConfigured()) {
            await this.syncNow();
        }
        return { ok: true };
    }

    collectLocalPayload() {
        const payload = {};
        SYNC_KEYS.forEach(k => {
            const raw = localStorage.getItem(k);
            if (raw) {
                try { payload[k] = JSON.parse(raw); } catch (e) { payload[k] = raw; }
            }
        });
        return payload;
    }

    async syncNow() {
        if (!navigator.onLine) {
            this.pendingSync = true;
            localStorage.setItem('our_garden_pending_sync', 'true');
            this.connectionState = 'offline';
            return { ok: false, message: '📡 Sin señal de internet. Se guardó en el teléfono y subirá al reconectar.' };
        }

        try {
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const remote = await this.fetchRemoteRow();
            const localPayload = this.collectLocalPayload();

            // Respetar privacidad de los registros de salud de Analy
            if (remote && remote.payload && activeUser !== 'analy' && remote.payload.our_garden_cycle_v1) {
                localPayload.our_garden_cycle_v1 = remote.payload.our_garden_cycle_v1;
            }

            const res = await fetch(`${this.config.supabaseUrl}/rest/v1/ecosystem_sync`, {
                method: 'POST',
                headers: this.getHeaders({
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                }),
                body: JSON.stringify({
                    space_id: this.config.coupleSpaceId,
                    updated_by: activeUser,
                    updated_at: new Date().toISOString(),
                    payload: localPayload
                })
            });

            if (!res.ok) {
                const errTxt = await res.text();
                throw new Error(`HTTP ${res.status}: ${errTxt}`);
            }

            this.pendingSync = false;
            localStorage.setItem('our_garden_pending_sync', 'false');
            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            this.connectionState = 'connected';
            this.lastError = '';
            return { ok: true, message: `🟢 ¡Sincronizado en Supabase a las ${this.lastSyncTime}!` };
        } catch (err) {
            this.connectionState = 'error';
            this.lastError = err.message || 'Error de red';
            return {
                ok: false,
                message: `🔴 Error al guardar en Supabase (${this.lastError}). Verifica haber corrido el script SQL de la tabla ecosystem_sync.`
            };
        }
    }

    async fetchRemoteRow() {
        const url = `${this.config.supabaseUrl}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(this.config.coupleSpaceId)}&select=*`;
        const res = await fetch(url, {
            headers: this.getHeaders()
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(`HTTP ${res.status}: ${txt}`);
        }
        const rows = await res.json();
        return rows && rows.length > 0 ? rows[0] : null;
    }

    async pullFromCloud() {
        if (!this.isConfigured() || !navigator.onLine) return { ok: false };
        try {
            const row = await this.fetchRemoteRow();
            this.connectionState = 'connected';
            this.lastError = '';
            if (!row || !row.payload) {
                return { ok: true, empty: true };
            }

            Object.entries(row.payload).forEach(([key, val]) => {
                if (SYNC_KEYS.includes(key) && val !== undefined) {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            });

            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            return { ok: true, updatedBy: row.updated_by };
        } catch (e) {
            this.connectionState = 'error';
            this.lastError = e.message;
            return { ok: false, error: e.message };
        }
    }
}

export const syncEngine = new SyncEngine();