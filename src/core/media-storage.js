import { syncEngine } from './sync.js';

const BUCKET_NAME = 'garden_media';

export const STORAGE_BUCKET_SQL = `insert into storage.buckets (id, name, public)
values ('garden_media', 'garden_media', true)
on conflict (id) do update set public = true;

drop policy if exists "Lectura multimedia Kevin y Analy" on storage.objects;
create policy "Lectura multimedia Kevin y Analy"
on storage.objects for select
using (bucket_id = 'garden_media');

drop policy if exists "Subida multimedia Kevin y Analy" on storage.objects;
create policy "Subida multimedia Kevin y Analy"
on storage.objects for insert
with check (bucket_id = 'garden_media');

drop policy if exists "Borrado multimedia Kevin y Analy" on storage.objects;
create policy "Borrado multimedia Kevin y Analy"
on storage.objects for delete
using (bucket_id = 'garden_media');`;

export class MediaStorageService {
    constructor() {
        this.baseUrl = syncEngine.config.supabaseUrl;
        this.apiKey = syncEngine.config.supabaseAnonKey;
    }

    sanitizeFileName(name = 'archivo') {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .toLowerCase();
    }

    async uploadFile(fileOrBlob, folder = 'general', customName = '') {
        const rawName = customName || fileOrBlob.name || `media_${Date.now()}.bin`;
        const cleanName = `${Date.now()}_${this.sanitizeFileName(rawName)}`;
        const objectPath = `${folder}/${cleanName}`;
        const uploadEndpoint = `${this.baseUrl}/storage/v1/object/${BUCKET_NAME}/${objectPath}`;

        try {
            const headers = {
                'apikey': this.apiKey,
                'Content-Type': fileOrBlob.type || 'application/octet-stream',
                'x-upsert': 'true'
            };
            if (this.apiKey.startsWith('eyJ')) {
                headers['Authorization'] = `Bearer ${this.apiKey}`;
            }

            const res = await fetch(uploadEndpoint, {
                method: 'POST',
                mode: 'cors',
                credentials: 'omit',
                headers,
                body: fileOrBlob
            });

            if (res.ok) {
                const publicUrl = `${this.baseUrl}/storage/v1/object/public/${BUCKET_NAME}/${objectPath}`;
                return {
                    ok: true,
                    url: publicUrl,
                    path: objectPath,
                    mimeType: fileOrBlob.type || 'application/octet-stream',
                    sizeKB: Math.max(1, Math.round((fileOrBlob.size || 1024) / 1024))
                };
            }

            const errTxt = await res.text();
            return {
                ok: false,
                error: `HTTP ${res.status}: ${errTxt}`,
                needsBucketSql: res.status === 400 || res.status === 404 || errTxt.includes('Bucket not found')
            };
        } catch (err) {
            return {
                ok: false,
                error: err.message || 'Sin conexión para subir archivo',
                needsBucketSql: false
            };
        }
    }
}

export const mediaStorage = new MediaStorageService();