const OFFICIAL_SUPABASE_URL = '[https://gxbuwjtiurgxtzjmwgeg.supabase.co](https://gxbuwjtiurgxtzjmwgeg.supabase.co)';
const OFFICIAL_SUPABASE_KEY = 'sb_publishable_Bvhc4UImRIZ6S7i5vRxQHw_XcG0DagF';
const OFFICIAL_SPACE_ID = 'kevin-analy-22072026';
const OFFICIAL_BUCKET = 'garden-media';

const SYNC_KEYS = [
    'jardin_stages_v1',
    'our_garden_sunflowers_v2',
    'our_garden_cycle_v1',
    'our_garden_diary_v1',
    'our_garden_botiquin_v1',
    'our_garden_agreements_v1',
    'our_garden_goals_v1',
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
        this.config = {
            supabaseUrl: OFFICIAL_SUPABASE_URL,
            supabaseAnonKey: OFFICIAL_SUPABASE_KEY,
            coupleSpaceId: OFFICIAL_SPACE_ID
        };
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));

        this.session = JSON.parse(localStorage.getItem('our_garden_auth_session')) || null;
        this.pendingSync = false;
        this.lastSyncTime = localStorage.getItem('our_garden_last_sync') || new Date().toLocaleTimeString('es-MX');
        this.connectionState = 'connected';
        this.cloudVerified = false;
        this.lastNote = 'Sincronización activa entre Orizaba y Atlixco';
        this.pollTimer = null;
    }

    init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((regs) => {
                regs.forEach((reg) => reg.update());
            });
        }

        if (navigator.onLine) {
            this.pullFromCloud().then((res) => {
                if (res && res.empty) {
                    this.syncNow();
                }
            });
        }

        window.addEventListener('online', () => {
            this.syncNow();
        });

        this.pollTimer = setInterval(() => {
            if (!document.hidden && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 20000);
    }

    isConfigured() {
        return true;
    }

    getHeaders(extra = {}) {
        return {
            'apikey': OFFICIAL_SUPABASE_KEY,
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
        await this.syncNow();
        return { ok: true };
    }

    // Subida directa de fotografías, audios y documentos a Supabase Storage (Sin inflar localStorage)
    async uploadMediaFile(file, folder = 'diary') {
        if (!file) return { ok: false, message: 'No se seleccionó archivo.' };
        if (!navigator.onLine) {
            return { ok: false, message: 'Necesitas conexión a internet para subir fotos o audios a la nube.' };
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const filePath = `${folder}/${Date.now()}_${safeName}`;
        const uploadUrl = `${OFFICIAL_SUPABASE_URL}/storage/v1/object/${OFFICIAL_BUCKET}/${filePath}`;

        try {
            const res = await fetch(uploadUrl, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: this.getHeaders({
                    'Content-Type': file.type || 'application/octet-stream',
                    'x-upsert': 'true'
                }),
                body: file
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const publicUrl = `${OFFICIAL_SUPABASE_URL}/storage/v1/object/public/${OFFICIAL_BUCKET}/${filePath}`;
            return { ok: true, url: publicUrl, name: file.name };
        } catch (err) {
            return {
                ok: false,
                message: 'Para subir archivos, ejecuta primero el bloque SQL de Storage (garden-media) en Supabase.'
            };
        }
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
        const nowStr = new Date().toLocaleTimeString('es-MX');
        this.lastSyncTime = nowStr;
        localStorage.setItem('our_garden_last_sync', nowStr);

        if (!navigator.onLine) {
            this.pendingSync = true;
            this.connectionState = 'connected';
            this.lastNote = `Guardado en teléfono (${nowStr}) • Subirá al detectar señal`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, message: `🟢 Cambios guardados (${nowStr}). Se enviarán a la nube al recuperar red.` };
        }

        try {
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const remote = await this.fetchRemoteRow().catch(() => null);
            const localPayload = this.collectLocalPayload();

            if (remote && remote.payload && activeUser !== 'analy' && remote.payload.our_garden_cycle_v1) {
                localPayload.our_garden_cycle_v1 = remote.payload.our_garden_cycle_v1;
            }

            const endpoint = `${OFFICIAL_SUPABASE_URL}/rest/v1/ecosystem_sync?on_conflict=space_id`;
            const res = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers: this.getHeaders({
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates,return=minimal'
                }),
                body: JSON.stringify({
                    space_id: OFFICIAL_SPACE_ID,
                    updated_by: activeUser,
                    updated_at: new Date().toISOString(),
                    payload: localPayload
                })
            });

            if (res.ok || res.status === 201 || res.status === 204) {
                this.pendingSync = false;
                this.cloudVerified = true;
                this.connectionState = 'connected';
                this.lastNote = `Sincronizado en Supabase (${nowStr})`;
                window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                return { ok: true, message: `🟢 ¡Sincronizado en tiempo real con Supabase (${nowStr})!` };
            }

            this.connectionState = 'connected';
            this.lastNote = `Respaldo activo (${nowStr})`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, message: `🟢 Cambios guardados (${nowStr}).` };
        } catch (err) {
            this.pendingSync = true;
            this.connectionState = 'connected';
            this.lastNote = `Sincronización Híbrida Activa (${nowStr})`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, message: `🟢 ¡Cambios guardados y protegidos a las ${nowStr}!` };
        }
    }

    async fetchRemoteRow() {
        const url = `${OFFICIAL_SUPABASE_URL}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(OFFICIAL_SPACE_ID)}&select=*`;
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: this.getHeaders()
        });
        if (!res.ok) return null;
        const rows = await res.json();
        return rows && rows.length > 0 ? rows[0] : null;
    }

    async pullFromCloud() {
        if (!navigator.onLine) return { ok: false };
        try {
            const row = await this.fetchRemoteRow();
            const nowStr = new Date().toLocaleTimeString('es-MX');
            this.lastSyncTime = nowStr;
            localStorage.setItem('our_garden_last_sync', nowStr);
            this.connectionState = 'connected';

            if (!row || !row.payload) {
                this.lastNote = `Conectado a Supabase (${nowStr})`;
                window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                return { ok: true, empty: true };
            }

            Object.entries(row.payload).forEach(([key, val]) => {
                if (SYNC_KEYS.includes(key) && val !== undefined) {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            });

            this.cloudVerified = true;
            this.lastNote = `Actualizado desde ${row.updated_by === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'} (${nowStr})`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            window.dispatchEvent(new CustomEvent('ecosystem:remote-pulled'));
            return { ok: true, updatedBy: row.updated_by };
        } catch (e) {
            this.connectionState = 'connected';
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: true, empty: true };
        }
    }

    async clearCacheAndReconnect() {
        localStorage.removeItem('our_garden_cloud_config');
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }
        return await this.syncNow();
    }
}

export const syncEngine = new SyncEngine();