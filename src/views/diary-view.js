import { syncEngine } from '../core/sync.js';

const INITIAL_DIARY_ENTRIES = [
    {
        id: 'entry-1',
        space: 'shared',
        author: 'kevin',
        date: '2026-09-21',
        time: '18:19',
        title: '🌻 Nuestras Flores Amarillas en Código (campo_flores.py)',
        content: '¿Creíste que me olvidaría de tus flores amarillas aunque sea virtuales, amor de mi vida? Aunque la terminal del celular nos dio batalla, tu paciencia para probar cada línea hizo que florecieran.',
        tags: ['Flores Amarillas', 'Código', 'Detalle'],
        highlighted: true,
        sharedWithPartner: true,
        privateOnly: false,
        photoUrl: '',
        audioUrl: ''
    },
    {
        id: 'entry-2',
        space: 'analy',
        author: 'analy',
        date: '2026-10-21',
        time: '22:54',
        title: '🍷 Noche de Enología y Cuenta Compartida en Revolut',
        content: 'Celebrar que somos jóvenes emprendedores con una buena copa de vino y dar el paso de abrir nuestra cuenta en Revolut juntos. Enología se volvió mi materia favorita y me ilusiona enseñarte a catar Cabernet Sauvignon y Merlot.',
        tags: ['Gastronomía', 'Enología', 'Revolut'],
        highlighted: true,
        sharedWithPartner: true,
        privateOnly: false,
        photoUrl: '',
        audioUrl: ''
    },
    {
        id: 'entry-3',
        space: 'shared',
        author: 'kevin',
        date: '2026-10-23',
        time: '21:58',
        title: '🚌 Nuestro Primer Fin de Semana Juntos en Orizaba',
        content: 'El viaje pasando entre neblina y túneles por La Esperanza y Córdoba hasta vernos por fin en la terminal ADO de Orizaba. Adelantar exámenes para caminar juntos por el mercado, disfrutar nuestro domingo de novios con frapecito y besitos el 25 de octubre, despedirnos de Nacho y Pimpon el 27 de octubre y quedarme guardando tu cobijita doblada bajo mi sudadera.',
        tags: ['Orizaba', 'Primer Encuentro', 'Cobijita'],
        highlighted: true,
        sharedWithPartner: true,
        privateOnly: false,
        photoUrl: '',
        audioUrl: ''
    },
    {
        id: 'entry-4',
        space: 'kevin',
        author: 'kevin',
        date: '2026-10-30',
        time: '19:27',
        title: '✨ Dar Luz y Ser un Buen Compañero',
        content: 'A veces me pesa cómo me perciben por mi mirada seria, pero escuchar que conmigo te sientes segura porque conoces quién soy realmente por dentro me recuerda por qué elegí vivir y construir una base sólida contigo.',
        tags: ['Reflexión', 'Confianza'],
        highlighted: true,
        sharedWithPartner: true,
        privateOnly: false,
        photoUrl: '',
        audioUrl: ''
    }
];

export class DiaryView extends HTMLElement {
    constructor() {
        super();
        this.entries = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || INITIAL_DIARY_ENTRIES;
        this.activeSpace = 'shared';
        this.activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.filterDate = '';
        this.pendingPhotoUrl = '';
        this.pendingAudioUrl = '';
        this.uploadStatus = '';

        this.boundRemotePull = () => {
            const updated = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || INITIAL_DIARY_ENTRIES;
            if (JSON.stringify(updated) !== JSON.stringify(this.entries)) {
                this.entries = updated;
                this.render();
                this.bindEvents();
            }
        };
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
        window.addEventListener('ecosystem:remote-pulled', this.boundRemotePull);
        // Descargar automáticamente las últimas notas y fotos al abrir la vista del Diario
        syncEngine.pullFromCloud();
    }

    disconnectedCallback() {
        window.removeEventListener('ecosystem:remote-pulled', this.boundRemotePull);
    }

    async saveEntries() {
        localStorage.setItem('our_garden_diary_v1', JSON.stringify(this.entries));
        await syncEngine.syncNow();
    }

    getVisibleEntries() {
        return this.entries.filter(e => {
            if (this.filterDate && e.date !== this.filterDate) return false;
            // Si una nota fue marcada explícitamente como solo privada, solo su autor la ve
            if (e.privateOnly === true && e.author !== this.activeUser) return false;

            // En "Nuestro Diario" aparecen todas las entradas compartidas de ambos
            if (this.activeSpace === 'shared') {
                return e.privateOnly !== true;
            }
            if (this.activeSpace === 'kevin') {
                return e.author === 'kevin' || e.space === 'kevin';
            }
            if (this.activeSpace === 'analy') {
                return e.author === 'analy' || e.space === 'analy';
            }
            return true;
        });
    }

    render() {
        const list = this.getVisibleEntries();

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">📖 Nuestros Diarios e Historia</h1>
                <p class="hero-subtitle">
                    Tres espacios sincronizados con fotografías optimizadas y notas de voz en tiempo real.
                </p>
            </section>

            <!-- Barra Superior: Autor, Botón de Sincronización Directa y Filtro -->
            <div class="glass-card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;text-align:left;">
                <div>
                    <span class="card-label">👤 ESCRIBIENDO COMO:</span>
                    <div style="display:flex;gap:6px;margin-top:4px;">
                        <button type="button" class="loc-chip ${this.activeUser === 'kevin' ? 'active' : ''}" data-author="kevin">💻 Kevin</button>
                        <button type="button" class="loc-chip ${this.activeUser === 'analy' ? 'active' : ''}" data-author="analy">👩🏻‍🍳 Analy</button>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                    <button type="button" class="pill-action-btn" id="btn-refresh-diary" style="padding:5px 11px;font-size:0.75rem;">
                        🔄 Actualizar notas y fotos ahora
                    </button>
                    <div style="display:flex;gap:4px;">
                        <input type="date" id="diary-date-filter" value="${this.filterDate}" style="background:#060a17;border:1px solid var(--border-subtle);padding:4px 8px;border-radius:8px;font-size:0.74rem;">
                        ${this.filterDate ? `<button type="button" class="loc-chip" id="clear-date-filter">Todas</button>` : ''}
                    </div>
                </div>
            </div>

            <!-- Pestañas de los 3 Espacios -->
            <div class="cards-grid-3" style="margin-bottom:14px;">
                <button type="button" class="element-btn-card ${this.activeSpace === 'kevin' ? 'water' : ''}" data-space="kevin">
                    <span class="card-label">💻 ESPACIO 1</span>
                    <div class="card-value" style="font-size:0.84rem;">Notas de Kevin</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeSpace === 'analy' ? 'sun' : ''}" data-space="analy">
                    <span class="card-label">👩🏻‍🍳 ESPACIO 2</span>
                    <div class="card-value" style="font-size:0.84rem;">Notas de Analy</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeSpace === 'shared' ? 'earth' : ''}" data-space="shared">
                    <span class="card-label">🌻 ESPACIO 3</span>
                    <div class="card-value" style="font-size:0.84rem;">Todo Nuestro Diario</div>
                </button>
            </div>

            <!-- Formulario para Nueva Nota o Foto -->
            <div class="stage-card" style="margin-bottom:16px;">
                <h3 style="color:var(--accent-sunflower);font-size:0.98rem;margin-bottom:10px;">
                    ✍️ Subir nueva nota o foto como ${this.activeUser === 'kevin' ? '💻 Kevin' : '👩🏻‍🍳 Analy'}
                </h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="entry-title" placeholder="Título del recuerdo o nota..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px 12px;border-radius:10px;font-size:0.86rem;">
                    <textarea id="entry-content" rows="3" placeholder="Escribe aquí tu nota (o solo adjunta una foto abajo)..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px 12px;border-radius:10px;font-size:0.85rem;"></textarea>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <label class="loc-chip active" style="cursor:pointer;text-align:center;padding:9px;">
                            📷 Adjuntar Fotografía
                            <input type="file" id="inp-diary-photo" accept="image/*" style="display:none;">
                        </label>
                        <label class="loc-chip active" style="cursor:pointer;text-align:center;padding:9px;">
                            🎙️ Adjuntar Audio / Voz
                            <input type="file" id="inp-diary-audio" accept="audio/*" style="display:none;">
                        </label>
                    </div>

                    ${this.pendingPhotoUrl ? `
                        <div style="margin-top:4px;text-align:center;">
                            <img src="${this.pendingPhotoUrl}" alt="Vista previa" style="max-height:160px;border-radius:10px;border:1px solid var(--border-gold);">
                        </div>
                    ` : ''}

                    ${this.uploadStatus ? `
                        <div style="font-size:0.78rem;color:var(--accent-emerald);padding:4px 6px;text-align:center;">${this.uploadStatus}</div>
                    ` : ''}

                    <input type="text" id="entry-tags" placeholder="Etiquetas separadas por coma (ej. Orizaba, Vinos, Foto)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.8rem;">

                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:4px;">
                        <label style="font-size:0.78rem;color:var(--accent-emerald);display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <input type="checkbox" id="entry-share-chk" checked>
                            <span>🔓 Compartir con mi pareja (visible en ambos teléfonos)</span>
                        </label>
                        <button type="button" class="pill-action-btn" id="btn-save-entry">📖 Publicar y Sincronizar</button>
                    </div>
                </div>
            </div>

            <!-- Lista Cronológica de Entradas -->
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${list.length === 0 ? `
                    <div class="glass-card" style="padding:24px;color:var(--text-secondary);">
                        No hay entradas en este filtro. Toca "🔄 Actualizar notas y fotos ahora" arriba.
                    </div>
                ` : list.map(item => `
                    <article class="stage-card" style="margin-top:0;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div>
                                <span style="font-size:0.72rem;color:var(--accent-sky);font-weight:700;">
                                    📅 ${item.date} • ${item.time || ''} • Subido por ${item.author === 'analy' ? '👩🏻‍🍳 Analy' : '💻 Kevin'}
                                </span>
                                <h3 style="color:var(--accent-sunflower-soft);font-size:1.02rem;margin:4px 0 8px;">
                                    ${item.highlighted ? '⭐ ' : ''}${item.title}
                                </h3>
                            </div>
                            ${item.author === this.activeUser ? `
                                <button type="button" class="loc-chip" data-delete-entry="${item.id}" title="Eliminar mi entrada">🗑️</button>
                            ` : ''}
                        </div>
                        <p style="font-size:0.86rem;color:var(--text-primary);white-space:pre-line;margin-bottom:10px;">${item.content}</p>
                        
                        ${item.photoUrl ? `
                            <div style="margin-bottom:10px;">
                                <img src="${item.photoUrl}" alt="${item.title}" loading="lazy" style="width:100%;max-height:380px;object-fit:contain;background:#04060e;border-radius:12px;border:1px solid var(--border-gold);">
                            </div>
                        ` : ''}

                        ${item.audioUrl ? `
                            <div style="margin-bottom:10px;">
                                <audio controls src="${item.audioUrl}" style="width:100%;height:38px;"></audio>
                            </div>
                        ` : ''}

                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                ${(item.tags || []).map(t => `<span class="loc-chip" style="font-size:0.68rem;">#${t}</span>`).join('')}
                            </div>
                            ${item.author === this.activeUser ? `
                                <button type="button" class="loc-chip ${item.privateOnly ? '' : 'active'}" data-toggle-share="${item.id}">
                                    ${item.privateOnly ? '🔒 Solo para mí (Toca para compartir)' : '🔓 Visible para ambos'}
                                </button>
                            ` : ''}
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('[data-author]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeUser = btn.dataset.author;
                localStorage.setItem('our_garden_active_user', this.activeUser);
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#btn-refresh-diary')?.addEventListener('click', async () => {
            this.uploadStatus = '⏳ Sincronizando notas y fotos con el teléfono de tu pareja...';
            this.render();
            this.bindEvents();
            await syncEngine.pullFromCloud();
            await syncEngine.syncNow();
            this.entries = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || INITIAL_DIARY_ENTRIES;
            this.uploadStatus = `🟢 ¡Diario actualizado a las ${new Date().toLocaleTimeString('es-MX')}!`;
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-space]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeSpace = btn.dataset.space;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#diary-date-filter')?.addEventListener('change', (e) => {
            this.filterDate = e.target.value;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#clear-date-filter')?.addEventListener('click', () => {
            this.filterDate = '';
            this.render();
            this.bindEvents();
        });

        this.querySelector('#inp-diary-photo')?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const currentTitle = this.querySelector('#entry-title')?.value || '';
            const currentContent = this.querySelector('#entry-content')?.value || '';

            this.uploadStatus = '⏳ Optimizando y subiendo fotografía...';
            this.render();
            this.bindEvents();

            const res = await syncEngine.uploadMediaFile(file, 'photos');
            if (res.ok) {
                this.pendingPhotoUrl = res.url;
                this.uploadStatus = `✅ Fotografía lista. Ahora toca "📖 Publicar y Sincronizar".`;
            } else {
                this.uploadStatus = `⚠️ ${res.message}`;
            }
            this.render();
            this.bindEvents();
            if (this.querySelector('#entry-title')) this.querySelector('#entry-title').value = currentTitle;
            if (this.querySelector('#entry-content')) this.querySelector('#entry-content').value = currentContent;
        });

        this.querySelector('#inp-diary-audio')?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const currentTitle = this.querySelector('#entry-title')?.value || '';
            const currentContent = this.querySelector('#entry-content')?.value || '';

            this.uploadStatus = '⏳ Subiendo nota de voz...';
            this.render();
            this.bindEvents();

            const res = await syncEngine.uploadMediaFile(file, 'audios');
            if (res.ok) {
                this.pendingAudioUrl = res.url;
                this.uploadStatus = `✅ Audio "${res.name}" listo. Toca "📖 Publicar y Sincronizar".`;
            } else {
                this.uploadStatus = `⚠️ ${res.message}`;
            }
            this.render();
            this.bindEvents();
            if (this.querySelector('#entry-title')) this.querySelector('#entry-title').value = currentTitle;
            if (this.querySelector('#entry-content')) this.querySelector('#entry-content').value = currentContent;
        });

        this.querySelector('#btn-save-entry')?.addEventListener('click', async () => {
            let title = this.querySelector('#entry-title')?.value.trim();
            let content = this.querySelector('#entry-content')?.value.trim();
            const tagsRaw = this.querySelector('#entry-tags')?.value.trim();
            const shareChk = this.querySelector('#entry-share-chk')?.checked;

            // Permitir que suban una foto rápida aunque no hayan escrito título o texto largo
            if (!title && !content && !this.pendingPhotoUrl && !this.pendingAudioUrl) return;
            if (!title) {
                title = this.pendingPhotoUrl ? '📸 Fotografía compartida' : '💌 Nota del día';
            }
            if (!content) {
                content = `Recuerdo compartido por ${this.activeUser === 'analy' ? 'Analy 👩🏻‍🍳' : 'Kevin 💻'}.`;
            }

            const now = new Date();
            const newEntry = {
                id: 'entry-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
                space: this.activeSpace,
                author: this.activeUser,
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().slice(0, 5),
                title,
                content,
                tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Recuerdo'],
                highlighted: Boolean(this.pendingPhotoUrl),
                sharedWithPartner: Boolean(shareChk),
                privateOnly: !shareChk,
                photoUrl: this.pendingPhotoUrl || '',
                audioUrl: this.pendingAudioUrl || ''
            };

            this.entries.unshift(newEntry);
            this.pendingPhotoUrl = '';
            this.pendingAudioUrl = '';
            this.uploadStatus = '⏳ Guardando y enviando al teléfono de tu pareja...';
            this.render();
            this.bindEvents();

            await this.saveEntries();
            this.entries = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || this.entries;
            this.uploadStatus = '🟢 ¡Publicado y sincronizado en ambos teléfonos!';
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-delete-entry]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.deleteEntry;
                syncEngine.registerDeletedId(id);
                this.entries = this.entries.filter(e => e.id !== id);
                await this.saveEntries();
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-toggle-share]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.toggleShare;
                const entry = this.entries.find(e => e.id === id);
                if (entry && entry.author === this.activeUser) {
                    entry.privateOnly = !entry.privateOnly;
                    entry.sharedWithPartner = !entry.privateOnly;
                    await this.saveEntries();
                    this.render();
                    this.bindEvents();
                }
            });
        });
    }
}

customElements.define('diary-view', DiaryView);