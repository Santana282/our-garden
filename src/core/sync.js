const OFFICIAL_SUPABASE_URL = 'https://gxbuwjtiurgxtzjmwgeg.supabase.co';
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
    'our_garden_universe_prefs_v1',
    'our_garden_deleted_ids_v1'
];

const ARRAY_MERGE_KEYS = [
    'our_garden_diary_v1',
    'our_garden_sunflowers_v2',
    'our_garden_botiquin_v1',
    'our_garden_agreements_v1',
    'our_garden_goals_v1'
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
        this.lastNote = 'Sincronización bidireccional activa';
        this.pollTimer = null;
    }

    init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((regs) => {
                regs.forEach((reg) => reg.update());
            });
        }

        if (navigator.onLine) {
            this.pullFromCloud();
        }

        window.addEventListener('online', () => {
            this.syncNow();
        });

        window.addEventListener('focus', () => {
            if (navigator.onLine) this.pullFromCloud();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && navigator.onLine) {
                this.pullFromCloud();
            }
        });

        // Descarga automática cada 8 segundos mientras la pantalla está activa
        this.pollTimer = setInterval(() => {
            if (!document.hidden && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 8000);
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

    registerDeletedId(id) {
        if (!id) return;
        const deleted = JSON.parse(localStorage.getItem('our_garden_deleted_ids_v1')) || [];
        if (!deleted.includes(id)) {
            deleted.push(id);
            localStorage.setItem('our_garden_deleted_ids_v1', JSON.stringify(deleted.slice(-200)));
        }
    }

    async loginPartner(role) {
        const cleanRole = role === 'analy' ? 'analy' : 'kevin';
        localStorage.setItem('our_garden_active_user', cleanRole);
        this.session = {
            role: cleanRole,
            loggedAt: new Date().toISOString()
        };
        localStorage.setItem('our_garden_auth_session', JSON.stringify(this.session));
        await this.pullFromCloud();
        await this.syncNow();
        return { ok: true };
    }

    compressImageFile(file, maxWidth = 820, quality = 0.72) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    let w = img.width;
                    let h = img.height;
                    if (w > maxWidth) {
                        h = Math.round((h * maxWidth) / w);
                        w = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => resolve(ev.target.result);
                img.src = ev.target.result;
            };
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    fileToDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result || ''));
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    async uploadMediaFile(file, folder = 'diary') {
        if (!file) return { ok: false, message: 'No se seleccionó archivo.' };

        const isImage = file.type.startsWith('image/');
        let compressedDataUrl = '';
        if (isImage) {
            compressedDataUrl = await this.compressImageFile(file);
        }

        if (navigator.onLine) {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const filePath = `${folder}/${Date.now()}_${safeName}`;
            const uploadUrl = `${OFFICIAL_SUPABASE_URL}/storage/v1/object/${OFFICIAL_BUCKET}/${filePath}`;

            try {
                let bodyToUpload = file;
                let contentType = file.type || 'application/octet-stream';

                if (isImage && compressedDataUrl) {
                    const resBlob = await fetch(compressedDataUrl);
                    bodyToUpload = await resBlob.blob();
                    contentType = 'image/jpeg';
                }

                const res = await fetch(uploadUrl, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'omit',
                    headers: this.getHeaders({
                        'Content-Type': contentType,
                        'x-upsert': 'true'
                    }),
                    body: bodyToUpload
                });

                if (res.ok) {
                    const publicUrl = `${OFFICIAL_SUPABASE_URL}/storage/v1/object/public/${OFFICIAL_BUCKET}/${filePath}`;
                    return { ok: true, url: publicUrl, name: file.name, mode: 'storage' };
                }
            } catch (err) {
                // Usa respaldo directo en la tabla ecosystem_sync
            }
        }

        if (isImage && compressedDataUrl) {
            return { ok: true, url: compressedDataUrl, name: file.name, mode: 'inline-cloud' };
        }

        if (file.size <= 1500000) {
            const dataUrl = await this.fileToDataUrl(file);
            if (dataUrl) {
                return { ok: true, url: dataUrl, name: file.name, mode: 'inline-cloud' };
            }
        }

        return {
            ok: false,
            message: 'Archivo demasiado grande. Usa un audio más corto o activa el SQL de Storage en Star-OS.'
        };
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

    mergeArraysById(localArr, remoteArr, deletedSet, sortChronologically = false) {
        if (!Array.isArray(localArr) && !Array.isArray(remoteArr)) return [];
        if (!Array.isArray(localArr)) return remoteArr.filter(item => !deletedSet.has(item?.id));
        if (!Array.isArray(remoteArr)) return localArr.filter(item => !deletedSet.has(item?.id));

        const map = new Map();
        remoteArr.forEach(item => {
            if (item && item.id && !deletedSet.has(item.id)) {
                map.set(item.id, item);
            }
        });

        localArr.forEach(item => {
            if (item && item.id && !deletedSet.has(item.id)) {
                const existing = map.get(item.id);
                if (existing) {
                    if (typeof item.waterCount === 'number' || typeof existing.waterCount === 'number') {
                        map.set(item.id, {
                            ...existing,
                            ...item,
                            waterCount: Math.max(item.waterCount || 0, existing.waterCount || 0),
                            kevinResolved: Boolean(item.kevinResolved || existing.kevinResolved),
                            analyResolved: Boolean(item.analyResolved || existing.analyResolved),
                            history: Array.from(new Set([...(item.history || []), ...(existing.history || [])]))
                        });
                    } else {
                        map.set(item.id, { ...existing, ...item });
                    }
                } else {
                    map.set(item.id, item);
                }
            }
        });

        const result = Array.from(map.values());

        // Ordenar el Diario del más reciente al más antiguo para que las fotos nuevas salgan arriba
        if (sortChronologically) {
            result.sort((a, b) => {
                const dateA = `${a.date || '0000-00-00'} ${a.time || '00:00'}`;
                const dateB = `${b.date || '0000-00-00'} ${b.time || '00:00'}`;
                return dateB.localeCompare(dateA);
            });
        }

        return result;
    }

    mergePayloads(localPayload, remotePayload, activeUser) {
        if (!remotePayload) return localPayload;

        const merged = { ...remotePayload, ...localPayload };
        const localDeleted = Array.isArray(localPayload.our_garden_deleted_ids_v1) ? localPayload.our_garden_deleted_ids_v1 : [];
        const remoteDeleted = Array.isArray(remotePayload.our_garden_deleted_ids_v1) ? remotePayload.our_garden_deleted_ids_v1 : [];
        const deletedSet = new Set([...localDeleted, ...remoteDeleted]);
        merged.our_garden_deleted_ids_v1 = Array.from(deletedSet).slice(-200);

        ARRAY_MERGE_KEYS.forEach(key => {
            if (localPayload[key] || remotePayload[key]) {
                const isDiary = key === 'our_garden_diary_v1';
                merged[key] = this.mergeArraysById(localPayload[key], remotePayload[key], deletedSet, isDiary);
            }
        });

        if (localPayload.our_garden_library_v1 || remotePayload.our_garden_library_v1) {
            const locLib = localPayload.our_garden_library_v1 || {};
            const remLib = remotePayload.our_garden_library_v1 || {};
            const mergedBooks = this.mergeArraysById(locLib.books, remLib.books, deletedSet, false).map(b => {
                const lb = (locLib.books || []).find(x => x.id === b.id);
                const rb = (remLib.books || []).find(x => x.id === b.id);
                if (lb && rb) {
                    const combinedNotes = [...(lb.notes || []), ...(rb.notes || [])];
                    const uniqueNotes = Array.from(new Map(combinedNotes.map(n => [`${n.author}-${n.text}`, n])).values());
                    return { ...rb, ...lb, notes: uniqueNotes };
                }
                return b;
            });
            merged.our_garden_library_v1 = {
                ...remLib,
                ...locLib,
                books: mergedBooks
            };
        }

        if (localPayload.our_garden_daily_light_v1 || remotePayload.our_garden_daily_light_v1) {
            const locLight = localPayload.our_garden_daily_light_v1 || {};
            const remLight = remotePayload.our_garden_daily_light_v1 || {};
            const mergedCustomPhrases = this.mergeArraysById(locLight.customPhrases, remLight.customPhrases, deletedSet, false);
            const combinedRefs = [...(locLight.reflections || []), ...(remLight.reflections || [])];
            const uniqueRefs = Array.from(new Map(combinedRefs.map(r => [`${r.author}-${r.text}-${r.date}`, r])).values());
            merged.our_garden_daily_light_v1 = {
                ...remLight,
                ...locLight,
                customPhrases: mergedCustomPhrases,
                reflections: uniqueRefs,
                favorites: Array.from(new Set([...(locLight.favorites || []), ...(remLight.favorites || [])]))
            };
        }

        if (activeUser !== 'analy' && remotePayload.our_garden_cycle_v1) {
            merged.our_garden_cycle_v1 = remotePayload.our_garden_cycle_v1;
        }

        return merged;
    }

    saveMergedToLocal(mergedPayload) {
        Object.entries(mergedPayload).forEach(([key, val]) => {
            if (SYNC_KEYS.includes(key) && val !== undefined) {
                localStorage.setItem(key, JSON.stringify(val));
            }
        });
    }

    async pushPayloadToSupabase(payloadToPush, activeUser) {
        const endpoint = `${OFFICIAL_SUPABASE_URL}/rest/v1/ecosystem_sync?on_conflict=space_id`;
        const res = await fetch(endpoint, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-store',
            credentials: 'omit',
            headers: this.getHeaders({
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates,return=minimal'
            }),
            body: JSON.stringify({
                space_id: OFFICIAL_SPACE_ID,
                updated_by: activeUser,
                updated_at: new Date().toISOString(),
                payload: payloadToPush
            })
        });
        return res;
    }

    async syncNow() {
        const nowStr = new Date().toLocaleTimeString('es-MX');
        this.lastSyncTime = nowStr;
        localStorage.setItem('our_garden_last_sync', nowStr);

        if (!navigator.onLine) {
            this.pendingSync = true;
            this.lastNote = `Guardado en teléfono (${nowStr}) • Subirá al detectar señal`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: false, message: `📡 Sin señal. Guardado en el teléfono (${nowStr}).` };
        }

        try {
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const remoteResult = await this.fetchRemoteRow();
            const localPayload = this.collectLocalPayload();

            const mergedPayload = this.mergePayloads(localPayload, remoteResult.row?.payload, activeUser);
            this.saveMergedToLocal(mergedPayload);

            const res = await this.pushPayloadToSupabase(mergedPayload, activeUser);

            if (res.ok || res.status === 201 || res.status === 204) {
                this.pendingSync = false;
                this.cloudVerified = true;
                this.connectionState = 'connected';
                const totalDiary = (mergedPayload.our_garden_diary_v1 || []).length;
                this.lastNote = `Sincronizado (${nowStr}) • ${totalDiary} recuerdos en la nube`;
                window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                window.dispatchEvent(new CustomEvent('ecosystem:remote-pulled'));
                return { ok: true, message: `🟢 ¡Sincronizado en ambos teléfonos (${totalDiary} recuerdos en común)!` };
            }

            const errText = await res.text();
            this.lastNote = `Aviso HTTP ${res.status}: ${errText.slice(0, 60)}`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: false, message: `⚠️ Respuesta de nube (${res.status}): ${errText.slice(0, 80)}` };
        } catch (err) {
            this.pendingSync = true;
            this.lastNote = `Reintentando conexión (${nowStr})`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            return { ok: false, message: `⚠️ Error de red al subir: verifica tu conexión a internet.` };
        }
    }

    // URL limpia compatible al 100% con PostgREST (SIN &_t= que causaba HTTP 400)
    async fetchRemoteRow() {
        const url = `${OFFICIAL_SUPABASE_URL}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(OFFICIAL_SPACE_ID)}&select=*`;
        try {
            const res = await fetch(url, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-store',
                credentials: 'omit',
                headers: this.getHeaders()
            });
            if (!res.ok) {
                return { status: 'error', row: null, code: res.status };
            }
            const rows = await res.json();
            if (!rows || rows.length === 0) {
                return { status: 'empty', row: null };
            }
            return { status: 'ok', row: rows[0] };
        } catch (e) {
            return { status: 'error', row: null };
        }
    }

    async pullFromCloud() {
        if (!navigator.onLine) return { ok: false };
        try {
            const remoteResult = await this.fetchRemoteRow();
            const nowStr = new Date().toLocaleTimeString('es-MX');
            this.lastSyncTime = nowStr;
            localStorage.setItem('our_garden_last_sync', nowStr);

            if (remoteResult.status === 'error') {
                return { ok: false };
            }

            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const localPayload = this.collectLocalPayload();

            // Si la tabla en Supabase está verdaderamente vacía, subimos el paquete inicial
            if (remoteResult.status === 'empty' || !remoteResult.row?.payload) {
                await this.pushPayloadToSupabase(localPayload, activeUser);
                return { ok: true, empty: true };
            }

            const remotePayload = remoteResult.row.payload;
            const mergedPayload = this.mergePayloads(localPayload, remotePayload, activeUser);
            this.saveMergedToLocal(mergedPayload);

            // Si este teléfono tenía fotos o notas (como "Yo" y "Primer beso" de Analy) que aún no estaban
            // en la nube, las sube automáticamente después de fusionarlas
            const remoteDiaryCount = (remotePayload.our_garden_diary_v1 || []).length;
            const mergedDiaryCount = (mergedPayload.our_garden_diary_v1 || []).length;
            if (mergedDiaryCount > remoteDiaryCount) {
                await this.pushPayloadToSupabase(mergedPayload, activeUser);
            }

            this.cloudVerified = true;
            this.lastNote = `Nube al día (${nowStr}) • ${mergedDiaryCount} recuerdos • Último: ${remoteResult.row.updated_by === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}`;
            window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
            window.dispatchEvent(new CustomEvent('ecosystem:remote-pulled'));
            return { ok: true, updatedBy: remoteResult.row.updated_by, count: mergedDiaryCount };
        } catch (e) {
            return { ok: false };
        }
    }

    async clearCacheAndReconnect() {
        localStorage.removeItem('our_garden_cloud_config');
        localStorage.setItem('our_garden_cloud_config', JSON.stringify(this.config));
        if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
        }
        await this.pullFromCloud();
        return await this.syncNow();
    }
}

export const syncEngine = new SyncEngine();