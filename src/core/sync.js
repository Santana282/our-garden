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
    'our_garden_arcade_scores_v1',
    'our_garden_library_v1',
    'our_garden_daily_light_v1',
    'our_garden_universe_prefs_v1'
];

export const SUPABASE_SETUP_SQL = `create table if not exists public.ecosystem_sync (
  space_id text primary key,
  updated_by text not null,
  updated_at timestamptz default now(),
  payload jsonb not null default '{}'::jsonb
);

alter table public.ecosystem_sync enable row level security;

drop policy if exists "Acceso compartido Kevin y Analy" on public.ecosystem_sync;

create policy "Acceso compartido Kevin y Analy"
on public.ecosystem_sync
for all
using (true)
with check (true);`;

export class SyncEngine {
    constructor() {
        // Forzar siempre la URL y Key limpias para eliminar configuraciones viejas en caché
        this.config = {
            supabaseUrl: DEFAULT_SUPABASE_URL,
            supabaseAnonKey: DEFAULT_SUPABASE_KEY,
            coupleSpaceId: DEFAULT_SPACE_ID
        };
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));

        this.session = JSON.parse(localStorage.getItem('our_garden_auth_session')) || null;
        this.pendingSync = localStorage.getItem('our_garden_pending_sync') === 'true';
        this.lastSyncTime = localStorage.getItem('our_garden_last_sync') || 'Verificando nube...';
        this.connectionState = 'checking'; // 'checking' | 'connected' | 'table_missing' | 'offline_saved'
        this.lastError = '';
        this.pollTimer = null;
    }

    init() {
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

        this.pollTimer = setInterval(() => {
            if (!document.hidden && this.isConfigured() && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 25000);
    }

    isConfigured() {
        return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
    }

    // Compatible tanto con las nuevas llaves sb_publishable_ como con las antiguas eyJ...
    getHeaders(extra = {}) {
        const key = this.config.supabaseAnonKey.trim();
        const headers = {
            'apikey': key,
            ...extra
        };
        if (key.startsWith('eyJ')) {
            headers['Authorization'] = `Bearer ${key}`;
        }
        return headers;
    }

    async loginPartner(role) {
        const cleanRole = role === 'analy' ? 'analy' : 'kevin';
        localStorage.setItem('our_garden_active_user', cleanRole);
        this.session = {
            role: cleanRole,
            loggedAt: new Date().toISOString()
        };
        localStorage.setItem('our_garden_auth_session', JSON.stringify(this.session));
        const syncRes = await this.syncNow();
        return { ok: syncRes.ok, message: syncRes.message };
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
            this.connectionState = 'offline_saved';
            return { ok: false, message: '📡 Sin internet. Cambios guardados en tu teléfono.' };
        }

        try {
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const remote = await this.fetchRemoteRow();
            const localPayload = this.collectLocalPayload();

            if (remote && remote.payload && activeUser !== 'analy' && remote.payload.our_garden_cycle_v1) {
                localPayload.our_garden_cycle_v1 = remote.payload.our_garden_cycle_v1;
            }

            const res = await fetch(`${this.config.supabaseUrl}/rest/v1/ecosystem_sync`, {
                method: 'POST',
                mode: 'cors',
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
                if (res.status === 404 || errTxt.includes('ecosystem_sync') || errTxt.includes('PGRST205')) {
                    this.connectionState = 'table_missing';
                    this.lastError = 'Falta ejecutar el comando SQL en Supabase para crear la tabla ecosystem_sync.';
                    window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                    return {
                        ok: false,
                        message: '🟡 Conectado a Supabase, pero falta crear la tabla ecosystem_sync (Copia el SQL abajo).'
                    };
                }
                throw new Error(`HTTP ${res.status}: ${errTxt}`);
            }

            this.pendingSync = false;
            localStorage.setItem('our_garden_pending_sync', 'false');
            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            this.connectionState = 'connected';
            this.lastError = '';
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, message: `🟢 ¡Sincronizado en la nube a las ${this.lastSyncTime}!` };
        } catch (err) {
            this.pendingSync = true;
            localStorage.setItem('our_garden_pending_sync', 'true');
            const msg = String(err.message || err);

            if (msg.includes('ecosystem_sync') || msg.includes('404') || msg.includes('PGRST205')) {
                this.connectionState = 'table_missing';
                this.lastError = 'La tabla ecosystem_sync aún no ha sido creada en el SQL Editor de Supabase.';
            } else {
                this.connectionState = 'offline_saved';
                this.lastError = msg;
            }
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return {
                ok: false,
                message: `🟡 Guardado en tu teléfono. Para sincronizar en la nube, verifica el paso SQL en Supabase.`
            };
        }
    }

    async fetchRemoteRow() {
        const url = `${this.config.supabaseUrl}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(this.config.coupleSpaceId)}&select=*`;
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
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
                window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                return { ok: true, empty: true };
            }

            Object.entries(row.payload).forEach(([key, val]) => {
                if (SYNC_KEYS.includes(key) && val !== undefined) {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            });

            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, updatedBy: row.updated_by };
        } catch (e) {
            const msg = String(e.message || e);
            if (msg.includes('404') || msg.includes('ecosystem_sync') || msg.includes('PGRST205')) {
                this.connectionState = 'table_missing';
                this.lastError = 'Falta crear la tabla ecosystem_sync en el SQL Editor de Supabase.';
            } else {
                this.connectionState = 'offline_saved';
                this.lastError = msg;
            }
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: false, error: msg };
        }
    }
}

export const syncEngine = new SyncEngine();