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
        mediaUrl: ''
    },
    {
        id: 'entry-2',
        space: 'analy',
        author: 'analy',
        date: '2026-10-21',
        time: '22:54',
        title: '🍷 Noche de Enología: Cabernet Sauvignon y Merlot',
        content: 'Celebrar que somos jóvenes emprendedores con una buena copa de vino. Enología se volvió mi materia favorita desde que la conocí y me ilusiona enseñarte a catar mis favoritos: Cabernet Sauvignon y Merlot.',
        tags: ['Gastronomía', 'Enología', 'Metas'],
        highlighted: true,
        sharedWithPartner: true,
        mediaUrl: ''
    },
    {
        id: 'entry-3',
        space: 'shared',
        author: 'kevin',
        date: '2026-10-23',
        time: '21:58',
        title: '🚌 Nuestro Primer Fin de Semana Juntos en Orizaba',
        content: 'El viaje pasando entre neblina y túneles por La Esperanza y Córdoba hasta vernos por fin en la terminal ADO de Orizaba. Adelantar exámenes para caminar juntos por el mercado, despedirnos de Nacho y Pimpon el 27 de octubre y quedarme guardando tu cobijita doblada bajo mi sudadera.',
        tags: ['Orizaba', 'Primer Encuentro', 'Cobijita'],
        highlighted: true,
        sharedWithPartner: true,
        mediaUrl: ''
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
        mediaUrl: ''
    }
];

export class DiaryView extends HTMLElement {
    constructor() {
        super();
        this.entries = JSON.parse(localStorage.getItem('our_garden_diary_v1')) || INITIAL_DIARY_ENTRIES;
        this.activeSpace = 'shared'; // 'kevin' | 'analy' | 'shared'
        this.activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.filterDate = '';
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    saveEntries() {
        localStorage.setItem('our_garden_diary_v1', JSON.stringify(this.entries));
    }

    getVisibleEntries() {
        return this.entries.filter(e => {
            if (this.filterDate && e.date !== this.filterDate) return false;
            if (this.activeSpace === 'shared') return e.space === 'shared' || e.sharedWithPartner;
            if (this.activeSpace === 'kevin') {
                return e.space === 'kevin' && (this.activeUser === 'kevin' || e.sharedWithPartner);
            }
            if (this.activeSpace === 'analy') {
                return e.space === 'analy' && (this.activeUser === 'analy' || e.sharedWithPartner);
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
                    Tres espacios para guardar reflexiones personales y recuerdos compartidos respetando nuestra privacidad.
                </p>
            </section>

            <!-- Selector de Autor Activo y Filtro de Fecha -->
            <div class="glass-card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;text-align:left;">
                <div>
                    <span class="card-label">👤 ESCRIBIENDO COMO:</span>
                    <div style="display:flex;gap:6px;margin-top:4px;">
                        <button type="button" class="loc-chip ${this.activeUser === 'kevin' ? 'active' : ''}" data-author="kevin">💻 Kevin</button>
                        <button type="button" class="loc-chip ${this.activeUser === 'analy' ? 'active' : ''}" data-author="analy">👩🏻‍🍳 Analy</button>
                    </div>
                </div>
                <div>
                    <span class="card-label">📅 BUSCAR POR FECHA:</span>
                    <div style="display:flex;gap:4px;margin-top:4px;">
                        <input type="date" id="diary-date-filter" value="${this.filterDate}" style="background:#060a17;border:1px solid var(--border-subtle);padding:4px 8px;border-radius:8px;font-size:0.76rem;">
                        ${this.filterDate ? `<button type="button" class="loc-chip" id="clear-date-filter">Ver todas</button>` : ''}
                    </div>
                </div>
            </div>

            <!-- Pestañas de los 3 Espacios del Diario -->
            <div class="cards-grid-3" style="margin-bottom:14px;">
                <button type="button" class="element-btn-card ${this.activeSpace === 'kevin' ? 'water' : ''}" data-space="kevin">
                    <span class="card-label">💻 ESPACIO 1</span>
                    <div class="card-value" style="font-size:0.84rem;">Mi Diario (Kevin)</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeSpace === 'analy' ? 'sun' : ''}" data-space="analy">
                    <span class="card-label">👩🏻‍🍳 ESPACIO 2</span>
                    <div class="card-value" style="font-size:0.84rem;">Su Diario (Analy)</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeSpace === 'shared' ? 'earth' : ''}" data-space="shared">
                    <span class="card-label">🌻 ESPACIO 3</span>
                    <div class="card-value" style="font-size:0.84rem;">Nuestro Diario</div>
                </button>
            </div>

            <!-- Formulario para Nueva Entrada -->
            <div class="stage-card" style="margin-bottom:16px;">
                <h3 style="color:var(--accent-sunflower);font-size:0.98rem;margin-bottom:10px;">
                    ✍️ Nueva entrada en ${this.activeSpace === 'shared' ? 'Nuestro Diario Compartido' : (this.activeSpace === 'kevin' ? 'el Diario de Kevin' : 'el Diario de Analy')}
                </h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="entry-title" placeholder="Título del recuerdo o reflexión..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px 12px;border-radius:10px;font-size:0.86rem;">
                    <textarea id="entry-content" rows="3" placeholder="Escribe aquí tu entrada..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px 12px;border-radius:10px;font-size:0.85rem;"></textarea>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <input type="text" id="entry-tags" placeholder="Etiquetas (ej. Orizaba, Vinos)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.8rem;">
                        <input type="url" id="entry-media" placeholder="Link a foto/audio externo (opcional)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.8rem;">
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-top:4px;">
                        <label style="font-size:0.78rem;color:var(--text-secondary);display:flex;align-items:center;gap:6px;cursor:pointer;">
                            <input type="checkbox" id="entry-share-chk" ${this.activeSpace === 'shared' ? 'checked disabled' : ''}>
                            <span>Compartir esta entrada con mi pareja</span>
                        </label>
                        <button type="button" class="pill-action-btn" id="btn-save-entry">📖 Guardar Recuerdo</button>
                    </div>
                </div>
            </div>

            <!-- Lista Cronológica de Entradas -->
            <div style="display:flex;flex-direction:column;gap:12px;">
                ${list.length === 0 ? `
                    <div class="glass-card" style="padding:24px;color:var(--text-secondary);">
                        No hay entradas visibles en este espacio o fecha seleccionada.
                    </div>
                ` : list.map(item => `
                    <article class="stage-card" style="margin-top:0;">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                            <div>
                                <span style="font-size:0.72rem;color:var(--accent-sky);font-weight:700;">
                                    📅 ${item.date} • ${item.time || ''} • Por ${item.author === 'kevin' ? '💻 Kevin' : '👩🏻‍🍳 Analy'}
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
                        ${item.mediaUrl ? `
                            <div style="margin-bottom:10px;">
                                <a href="${item.mediaUrl}" target="_blank" rel="noopener" class="loc-chip active" style="text-decoration:none;display:inline-block;">🔗 Ver multimedia vinculada</a>
                            </div>
                        ` : ''}
                        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;border-top:1px solid var(--border-subtle);padding-top:8px;">
                            <div style="display:flex;gap:6px;flex-wrap:wrap;">
                                ${(item.tags || []).map(t => `<span class="loc-chip" style="font-size:0.68rem;">#${t}</span>`).join('')}
                            </div>
                            ${item.author === this.activeUser && item.space !== 'shared' ? `
                                <button type="button" class="loc-chip ${item.sharedWithPartner ? 'active' : ''}" data-toggle-share="${item.id}">
                                    ${item.sharedWithPartner ? '🔓 Compartida con pareja' : '🔒 Privada (Toca para compartir)'}
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

        this.querySelector('#btn-save-entry')?.addEventListener('click', () => {
            const title = this.querySelector('#entry-title')?.value.trim();
            const content = this.querySelector('#entry-content')?.value.trim();
            const tagsRaw = this.querySelector('#entry-tags')?.value.trim();
            const mediaUrl = this.querySelector('#entry-media')?.value.trim();
            const shareChk = this.querySelector('#entry-share-chk')?.checked;

            if (!title || !content) return;

            const now = new Date();
            const newEntry = {
                id: 'entry-' + Date.now(),
                space: this.activeSpace,
                author: this.activeUser,
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().slice(0, 5),
                title,
                content,
                tags: tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : ['Recuerdo'],
                highlighted: false,
                sharedWithPartner: this.activeSpace === 'shared' ? true : Boolean(shareChk),
                mediaUrl: mediaUrl || ''
            };

            this.entries.unshift(newEntry);
            this.saveEntries();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-delete-entry]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.deleteEntry;
                this.entries = this.entries.filter(e => e.id !== id);
                this.saveEntries();
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-toggle-share]').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.toggleShare;
                const entry = this.entries.find(e => e.id === id);
                if (entry && entry.author === this.activeUser) {
                    entry.sharedWithPartner = !entry.sharedWithPartner;
                    this.saveEntries();
                    this.render();
                    this.bindEvents();
                }
            });
        });
    }
}

customElements.define('diary-view', DiaryView);