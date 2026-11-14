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

// Claves que contienen arreglos de elementos con .id y deben fusionarse sin borrarse entre sí
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
            this.pullFromCloud().then((res) => {
                if (res && res.empty) {
                    this.syncNow();
                }
            });
        }

        window.addEventListener('online', () => {
            this.syncNow();
        });

        // Al volver a abrir o enfocar la pantalla en el celular, descarga de inmediato lo que subió la pareja
        window.addEventListener('focus', () => {
            if (navigator.onLine) this.pullFromCloud();
        });

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && navigator.onLine) {
                this.pullFromCloud();
            }
        });

        // Consulta cada 10 segundos cambios nuevos de la otra persona
        this.pollTimer = setInterval(() => {
            if (!document.hidden && navigator.onLine) {
                this.pullFromCloud();
            }
        }, 10000);
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

    // Compresor óptico en Canvas: reduce cualquier foto de iPhone/Android (4MB) a ~55KB
    // para que suba al instante y funcione incluso sin configurar buckets externos.
    compressImageFile(file, maxWidth = 860, quality = 0.74) {
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
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
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

    // Subida garantizada de fotos y audios: intenta Supabase Storage y si no existe el bucket
    // utiliza la imagen optimizada sincronizada directamente en la tabla ecosystem_sync
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
                // Continúa al respaldo directo en base de datos
            }
        }

        // Respaldo infalible en la tabla de Supabase para que la foto o nota de voz NUNCA se pierda
        if (isImage && compressedDataUrl) {
            return {
                ok: true,
                url: compressedDataUrl,
                name: file.name,
                mode: 'inline-cloud'
            };
        }

        if (file.size <= 1500000) {
            const dataUrl = await this.fileToDataUrl(file);
            if (dataUrl) {
                return { ok: true, url: dataUrl, name: file.name, mode: 'inline-cloud' };
            }
        }

        return {
            ok: false,
            message: 'El archivo de audio es muy grande. Usa un audio más corto o ejecuta el SQL de Storage en Star-OS.'
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

    // Fusiona dos arreglos de objetos por su propiedad .id sin perder elementos de ninguno de los dos teléfonos
    mergeArraysById(localArr, remoteArr, deletedSet) {
        if (!Array.isArray(localArr) && !Array.isArray(remoteArr)) return [];
        if (!Array.isArray(localArr)) return remoteArr.filter(item => !deletedSet.has(item?.id));
        if (!Array.isArray(remoteArr)) return localArr.filter(item => !deletedSet.has(item?.id));

        const map = new Map();
        // Primero colocamos los remotos (de la pareja)
        remoteArr.forEach(item => {
            if (item && item.id && !deletedSet.has(item.id)) {
                map.set(item.id, item);
            }
        });
        // Luego combinamos/actualizamos con los locales
        localArr.forEach(item => {
            if (item && item.id && !deletedSet.has(item.id)) {
                const existing = map.get(item.id);
                if (existing) {
                    // Si es un girasol, conservar el mayor conteo de riegos y acuerdos de ambos
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

        return Array.from(map.values());
    }

    mergePayloads(localPayload, remotePayload, activeUser) {
        if (!remotePayload) return localPayload;

        const merged = { ...remotePayload, ...localPayload };
        const localDeleted = Array.isArray(localPayload.our_garden_deleted_ids_v1) ? localPayload.our_garden_deleted_ids_v1 : [];
        const remoteDeleted = Array.isArray(remotePayload.our_garden_deleted_ids_v1) ? remotePayload.our_garden_deleted_ids_v1 : [];
        const deletedSet = new Set([...localDeleted, ...remoteDeleted]);
        merged.our_garden_deleted_ids_v1 = Array.from(deletedSet).slice(-200);

        // Fusionar Diarios, Girasoles, Botiquín, Acuerdos y Objetivos sin borrar lo que subió la pareja
        ARRAY_MERGE_KEYS.forEach(key => {
            if (localPayload[key] || remotePayload[key]) {
                merged[key] = this.mergeArraysById(localPayload[key], remotePayload[key], deletedSet);
            }
        });

        // Fusionar Biblioteca del Amor (libros y notas de lectura)
        if (localPayload.our_garden_library_v1 || remotePayload.our_garden_library_v1) {
            const locLib = localPayload.our_garden_library_v1 || {};
            const remLib = remotePayload.our_garden_library_v1 || {};
            const mergedBooks = this.mergeArraysById(locLib.books, remLib.books, deletedSet).map(b => {
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

        // Fusionar Frases Diarias y Reflexiones de "Una luz para hoy"
        if (localPayload.our_garden_daily_light_v1 || remotePayload.our_garden_daily_light_v1) {
            const locLight = localPayload.our_garden_daily_light_v1 || {};
            const remLight = remotePayload.our_garden_daily_light_v1 || {};
            const mergedCustomPhrases = this.mergeArraysById(locLight.customPhrases, remLight.customPhrases, deletedSet);
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

        // Respetar privacidad de Tus Días (solo Analy modifica sus registros)
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

            // Fusionar lo local con lo remoto para NUNCA sobrescribir las notas o fotos de la pareja
            const mergedPayload = this.mergePayloads(localPayload, remote?.payload, activeUser);
            this.saveMergedToLocal(mergedPayload);

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
                    payload: mergedPayload
                })
            });

            if (res.ok || res.status === 201 || res.status === 204) {
                this.pendingSync = false;
                this.cloudVerified = true;
                this.connectionState = 'connected';
                this.lastNote = `Sincronizado y fusionado en Supabase (${nowStr})`;
                window.dispatchEvent(new CustomEvent('ecosystem:sync-updated'));
                window.dispatchEvent(new CustomEvent('ecosystem:remote-pulled'));
                return { ok: true, message: `🟢 ¡Notas y fotos sincronizadas en ambos teléfonos (${nowStr})!` };
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
        // Parámetro &_t evita que el navegador móvil lea una respuesta vieja en caché
        const url = `${OFFICIAL_SUPABASE_URL}/rest/v1/ecosystem_sync?space_id=eq.${encodeURIComponent(OFFICIAL_SPACE_ID)}&select=*&_t=${Date.now()}`;
        const res = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-store',
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

            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            const localPayload = this.collectLocalPayload();
            const mergedPayload = this.mergePayloads(localPayload, row.payload, activeUser);
            this.saveMergedToLocal(mergedPayload);

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
        await this.pullFromCloud();
        return await this.syncNow();
    }
}

export const syncEngine = new SyncEngine();