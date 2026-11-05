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
        this.config = JSON.parse(localStorage.getItem('our_garden_cloud_config')) || {
            supabaseUrl: '',
            supabaseAnonKey: '',
            coupleSpaceId: 'kevin-analy-22072026'
        };
        this.session = JSON.parse(localStorage.getItem('our_garden_auth_session')) || null;
        this.pendingSync = localStorage.getItem('our_garden_pending_sync') === 'true';
        this.lastSyncTime = localStorage.getItem('our_garden_last_sync') || 'Sin sincronizar aún';
        this.pollTimer = null;
    }

    init() {
        window.addEventListener('online', () => {
            if (this.pendingSync) this.syncNow('auto-reconnect');
        });

        // Sincronización periódica ligera cuando la app está visible y conectada
        this.pollTimer = setInterval(() => {
            if (!document.hidden && this.isConfigured() && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 25000);
    }

    isConfigured() {
        return Boolean(this.config.supabaseUrl && this.config.supabaseAnonKey);
    }

    saveCloudConfig(url, anonKey, spaceId = 'kevin-analy-22072026') {
        this.config = {
            supabaseUrl: url.trim().replace(/\/$/, ''),
            supabaseAnonKey: anonKey.trim(),
            coupleSpaceId: spaceId.trim() || 'kevin-analy-22072026'
        };
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));
        this.emitStatus('Configuración de nube guardada');
    }

    async loginPartner(role, email, password) {
        const cleanRole = role === 'analy' ? 'analy' : 'kevin';
        localStorage.setItem('our_garden_active_user', cleanRole);

        // Si Supabase Auth está configurado con email y password, autentica contra Supabase
        if (this.isConfigured() && email && password) {
            try {
                const res = await fetch(`${this.config.supabaseUrl}/auth/v1/token?grant_type=password`, {
                    method: 'POST',
                    headers: {
                        'apikey': this.config.supabaseAnonKey,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                if (res.ok) {
                    const authData = await res.json();
                    this.session = {
                        role: cleanRole,
                        email: email,
                        accessToken: authData.access_token,
                        loggedAt: new Date().toISOString()
                    };
                    localStorage.setItem('our_garden_auth_session', JSON.stringify(this.session));
                    await this.syncNow('login');
                    return { ok: true, mode: 'cloud-auth' };
                }
            } catch (err) {
                console.warn('Fallo login remoto, activando sesión autorizada de pareja:', err);
            }
        }

        // Sesión autorizada de pareja (funciona con clave Anon + RLS por coupleSpaceId)
        this.session = {
            role: cleanRole,
            email: email || (cleanRole === 'kevin' ? 'kevin@nuestrojardin.app' : 'analy@nuestrojardin.app'),
            accessToken: this.config.supabaseAnonKey || 'local-session',
            loggedAt: new Date().toISOString()
        };
        localStorage.setItem('our_garden_auth_session', JSON.stringify(this.session));
        if (this.isConfigured()) {
            await this.syncNow('login');
        }
        return { ok: true, mode: this.isConfigured() ? 'cloud-shared' : 'local' };
    }

    logout() {
        this.session = null;
        localStorage.removeItem('our_garden_auth_session');
        this.emitStatus('Sesión cerrada');
    }

    collectLocalPayload() {
        const payload = {};
        SYNC_KEYS.forEach(k => {
            const raw = localStorage.getItem(k);
            if (raw) {
                try {
                    payload[k] = JSON.parse(raw);
                } catch (e) {
                    payload[k] = raw;
                }
            }
        });
        return payload;
    }

    async syncNow(reason = 'manual') {
        if (!this.isConfigured()) {
            this.pendingSync = true;
            localStorage.setItem('our_garden_pending_sync', 'true');
            this.emitStatus('Modo Local (Falta conectar URL de Supabase)');
            return { ok: false, message: 'Configura la URL y Anon Key de Supabase en Star-OS.' };
        }

        if (!navigator.onLine) {
            this.pendingSync = true;
            localStorage.setItem('our_garden_pending_sync', 'true');
            this.emitStatus('Sin conexión • Cambios guardados en cola');
            return { ok: false, message: 'Sin internet. Se sincronizará automáticamente al reconectar.' };
        }

        try {
            this.emitStatus('Sincronizando con la nube...');
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';

            // 1. Primero consultamos el estado remoto para no sobrescribir datos privados de la otra persona
            const remote = await this.fetchRemoteRow();
            const localPayload = this.collectLocalPayload();

            if (remote && remote.payload) {
                // Regla de privacidad estricta: solo Analy puede modificar sus registros de salud en la nube
                if (activeUser !== 'analy' && remote.payload.our_garden_cycle_v1) {
                    localPayload.our_garden_cycle_v1 = remote.payload.our_garden_cycle_v1;
                }
            }

            // 2. Enviamos el estado combinado (Upsert en tabla ecosystem_sync)
            const token = (this.session && this.session.accessToken && this.session.accessToken !== 'local-session')
                ? this.session.accessToken
                : this.config.supabaseAnonKey;

            const res = await fetch(`${this.config.supabaseUrl}/rest/v1/ecosystem_sync`, {
                method: 'POST',
                headers: {
                    'apikey': this.config.supabaseAnonKey,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'resolution=merge-duplicates,return=representation'
                },
                body: JSON.stringify({
                    space_id: this.config.coupleSpaceId,
                    updated_by: activeUser,
                    updated_at: new Date().toISOString(),
                    payload: localPayload
                })
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            this.pendingSync = false;
            localStorage.setItem('our_garden_pending_sync', 'false');
            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            this.emitStatus(`Sincronizado (${this.lastSyncTime})`);
            return { ok: true, message: `Sincronización exitosa (${this.lastSyncTime})` };
        } catch (err) {
            this.pendingSync = true;
            localStorage.setItem('our_garden_pending_sync', 'true');
            this.emitStatus('Error de red • Reintento en cola');
            return { ok: false, message: 'No se pudo conectar con la tabla remota. Verifica las credenciales o el SQL.' };
        }
    }

    async fetchRemoteRow() {
        const url = `${this.config.supabaseUrl}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(this.config.coupleSpaceId)}&select=*`;
        const res = await fetch(url, {
            headers: {
                'apikey': this.config.supabaseAnonKey,
                'Authorization': `Bearer ${this.config.supabaseAnonKey}`
            }
        });
        if (!res.ok) return null;
        const rows = await res.json();
        return rows && rows.length > 0 ? rows[0] : null;
    }

    async pullFromCloud() {
        if (!this.isConfigured() || !navigator.onLine) return { ok: false };
        try {
            const row = await this.fetchRemoteRow();
            if (!row || !row.payload) return { ok: false };

            Object.entries(row.payload).forEach(([key, val]) => {
                if (SYNC_KEYS.includes(key) && val !== undefined) {
                    localStorage.setItem(key, JSON.stringify(val));
                }
            });

            this.lastSyncTime = new Date().toLocaleTimeString('es-MX');
            localStorage.setItem('our_garden_last_sync', this.lastSyncTime);
            this.emitStatus(`Actualizado desde ${row.updated_by === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'} (${this.lastSyncTime})`);
            return { ok: true, updatedBy: row.updated_by };
        } catch (e) {
            return { ok: false };
        }
    }

    emitStatus(text) {
        window.dispatchEvent(new CustomEvent('ecosystem:sync-status', { detail: { text } }));
    }
}

export const syncEngine = new SyncEngine();