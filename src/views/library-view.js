import { syncEngine } from '../core/sync.js';

export const LIBRARY_CATEGORIES = [
    'Todas',
    'Poesía romántica',
    'Cartas de amor',
    'Literatura clásica',
    'Amor y filosofía',
    'Poemas de esperanza',
    'Amor a distancia',
    'Relaciones y crecimiento personal',
    'Literatura hispanoamericana',
    'Reflexiones espirituales',
    'Escritos personales'
];

export const INITIAL_BOOKS = [
    {
        id: 'book-menu-4-meses',
        title: 'Menú de Degustación: Nuestros Primeros 4 Meses (22 Jul – 22 Nov)',
        author: 'Kevin Santana (Para mi Chef favorita, Analy Monserrat)',
        category: 'Cartas de amor',
        coverEmoji: '🍷',
        coverGradient: 'linear-gradient(135deg, #9f1239, #3b0764)',
        license: 'Edición Especial de 4° Mesiversario',
        description: 'Un recorrido gastronómico y enológico en 4 tiempos por cada mes que hemos construido juntos desde el 22 de julio.',
        recommendedBy: 'kevin',
        favorite: true,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: '1° Tiempo (Julio - Agosto) • El Origen y el Entrelazamiento',
                body: `Empezamos el 22 de julio descubriendo que dos almas a distancia pueden latir en el mismo presente.\n\nComo en la ecuación de Dirac que te entregué aquel día, interactuar contigo transformó mi mundo por completo. Gracias por aceptar caminar conmigo en las buenas y en las pruebas, enseñándome que soy solo para ti y que contigo puedo abrir mi corazón sin miedo.`
            },
            {
                title: '2° Tiempo (Septiembre) • Flores Amarillas y Doble Festejo',
                body: `Entre líneas de Python el 21 de septiembre para que no te faltaran tus flores amarillas, y el doble festejo del 22 de septiembre por tu cumpleaños y nuestro segundo mes ("Mi Ponanita preciosa"), me enseñaste que el amor no es un proyecto universitario, sino abrazarnos con palabras cálidas, olor a pancito recién hecho y elegirnos cada noche.`
            },
            {
                title: '3° Tiempo (Octubre) • Cosecha de Orizaba (Maridaje con Cabernet Sauvignon y Merlot)',
                body: `El mes en que abrimos juntos nuestra cuenta en Revolut, descubrimos tu pasión por la Enología y vivimos nuestro primer fin de semana juntos del 23 al 27 de octubre.\n\nDesde verte sentada esperándome en el ADO de Orizaba a las 10:01 PM, nuestro primer beso, tus masajitos, nuestro domingo de novios con frapecito y la despedida de Nacho y Pimpon, hasta tu cobijita doblada bajo mi sudadera. Me encantas en cuerpo y alma.`
            },
            {
                title: '4° Tiempo (Noviembre y Nuestro Horizonte) • Pinky Promise',
                body: `Cuatro meses construyendo nuestro jardín vivo y viendo nuestras fotos sincronizadas en el Diario.\n\nBrindo con una copa de tu vino favorito por nuestra lista de objetivos, por la taquiza navideña con tu familia, por el día en que dejemos atrás las colegiaturas para armar nuestro hogar de clima fresco y por todo lo que vamos a cocinar y vivir juntos. ¡Felices 4 meses, Mi Reina hermosa!`
            }
        ]
    },
    {
        id: 'book-becquer',
        title: 'Rimas Selectas del Amor y la Luz',
        author: 'Gustavo Adolfo Bécquer',
        category: 'Poesía romántica',
        coverEmoji: '🌹',
        coverGradient: 'linear-gradient(135deg, #be123c, #4c0519)',
        license: 'Dominio Público',
        description: 'Versos inmortales sobre la poesía, la mirada y el encuentro de dos almas que laten al mismo compás.',
        recommendedBy: 'kevin',
        favorite: true,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: 'Rima XXI • ¿Qué es poesía?',
                body: `¿Qué es poesía?, dices mientras clavas\nen mi pupila tu pupila azul.\n¿Qué es poesía? ¿Y tú me lo preguntas?\nPoesía... eres tú.`
            },
            {
                title: 'Rima XXIII • Por una mirada, un mundo',
                body: `Por una mirada, un mundo;\npor una sonrisa, un cielo;\npor un beso... ¡yo no sé\nqué te diera por un beso!`
            },
            {
                title: 'Rima XXIV • Dos rojas lenguas de fuego',
                body: `Dos rojas lenguas de fuego\nque a un mismo tronco enlazadas\nse aproximan y, al besarse,\nforman una sola llama;\n\ndos notas que del laúd\na un tiempo la mano arranca,\ny en el espacio se encuentran\ny armoniosas se abrazan...\neso son nuestras dos almas.`
            }
        ]
    },
    {
        id: 'book-sorjuana',
        title: 'Sonetos de Amor y Discreción',
        author: 'Sor Juana Inés de la Cruz',
        category: 'Literatura clásica',
        coverEmoji: '🪶',
        coverGradient: 'linear-gradient(135deg, #b45309, #451a03)',
        license: 'Dominio Público',
        description: 'La joya del Siglo de Oro mexicano sobre la constancia del afecto verdadero y la entrega sincera.',
        recommendedBy: 'analy',
        favorite: true,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: 'Esta tarde, mi bien, cuando te hablaba',
                body: `Esta tarde, mi bien, cuando te hablaba,\ncomo en tu rostro y tus acciones vía\nque con palabras no te persuadía,\nque el corazón me vieses deseaba;\n\ny Amor, que mis intentos ayudaba,\nvenció lo que imposible parecía:\npues entre el llanto, que el dolor vertía,\nel corazón deshecho destilaba.`
            }
        ]
    },
    {
        id: 'book-nervo',
        title: 'En Paz y Poemas del Alma',
        author: 'Amado Nervo',
        category: 'Literatura hispanoamericana',
        coverEmoji: '🕯️',
        coverGradient: 'linear-gradient(135deg, #1d4ed8, #1e1b4b)',
        license: 'Dominio Público',
        description: 'Poesía modernista mexicana sobre la gratitud vital, la serenidad espiritual y la arquitectura del propio destino.',
        recommendedBy: 'kevin',
        favorite: false,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: 'En Paz (Elevación)',
                body: `Muy cerca de mi ocaso, yo te bendigo, Vida,\nporque nunca me diste ni esperanza fallida,\nni trabajos injustos, ni pena inmerecida;\n\nporque veo al final de mi rudo camino\nque yo fui el arquitecto de mi propio destino;\n\nque si extraje las mieles o la hiel de las cosas,\nfue porque en ellas puse hiel o mieles sabrosas:\ncuando planté rosales, coseché siempre rosas.`
            }
        ]
    },
    {
        id: 'book-dirac-distance',
        title: 'El Entrelazamiento y el Presente a Distancia',
        author: 'Kevin Santana & Analy Monserrat',
        category: 'Amor a distancia',
        coverEmoji: '🪐',
        coverGradient: 'linear-gradient(135deg, #7e22ce, #0f172a)',
        license: 'Escrito Original de Pareja',
        description: 'Nuestra reflexión sobre cómo Orizaba y Atlixco se unen en el mismo presente cuando elegimos escucharnos con ternura.',
        recommendedBy: 'kevin',
        favorite: true,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: 'Capítulo 1 • La Ecuación de nuestro Vínculo',
                body: `(∂ + m) ψ = 0\n\nSi dos sistemas interactúan entre sí durante cierto periodo y luego se separan en el espacio, ya no pueden describirse como dos sistemas distintos, sino que se convierten en un único sistema entrelazado.\n\nLo que le ocurre a tu corazón en Atlixco resuena en el mío en Orizaba. La distancia física nunca es ausencia cuando habitamos el presente con amor activo.`
            },
            {
                title: 'Capítulo 2 • Flores Amarillas en Código (21 de Septiembre)',
                body: `¿Creíste que me olvidaría de tus flores amarillas aunque sea virtuales, amor de mi vida? 🌻💛✨\n\nAquel día, entre comandos de Python y capturas de pantalla en tu iPhone, descubrimos que el mejor código no es el que nunca falla, sino el que construimos juntos con paciencia, risas y cariño.`
            }
        ]
    },
    {
        id: 'book-cartas',
        title: 'Cartas entre la Receta y el Código',
        author: 'Kevin & Analy',
        category: 'Cartas de amor',
        coverEmoji: '💌',
        coverGradient: 'linear-gradient(135deg, #047857, #022c22)',
        license: 'Escrito Personal Privado',
        description: 'Cartas y dedicatorias nacidas entre prácticas de Gastronomía, Enología, desvelos de estudio y nuestro viaje a Orizaba.',
        recommendedBy: 'analy',
        favorite: true,
        progress: 0,
        bookmarkChapter: 0,
        notes: [],
        chapters: [
            {
                title: 'Carta 1 • La Cobijita en Orizaba',
                body: `Desde el momento en que bajaste del autobús en el ADO de Orizaba hasta caminar juntos por el mercado y despedirnos de Nacho y Pimpon, cada minuto confirmó que nuestro lugar seguro somos nosotros.\n\nTu cobijita doblada bajo mi sudadera se quedó guardando tu aroma hasta nuestro próximo abrazo.`
            }
        ]
    }
];

function ensureLibrarySeeds(savedBooks) {
    if (!Array.isArray(savedBooks) || savedBooks.length === 0) return INITIAL_BOOKS;
    const map = new Map();
    savedBooks.forEach(b => { if (b && b.id) map.set(b.id, b); });
    INITIAL_BOOKS.forEach(seed => {
        if (!map.has(seed.id)) {
            map.set(seed.id, seed);
        }
    });
    // Garantizar que el libro de los 4 meses aparezca en primer lugar
    const list = Array.from(map.values());
    list.sort((a, b) => (a.id === 'book-menu-4-meses' ? -1 : b.id === 'book-menu-4-meses' ? 1 : 0));
    return list;
}

export class LibraryView extends HTMLElement {
    constructor() {
        super();
        const saved = JSON.parse(localStorage.getItem('our_garden_library_v1')) || {};
        this.books = ensureLibrarySeeds(saved.books);
        this.readingHistory = saved.readingHistory || [];
        this.selectedCategory = 'Todas';
        this.activeBookId = null;
        this.activeChapterIndex = 0;
        this.readerFontSize = saved.readerFontSize || 1.02;
        this.readerTheme = saved.readerTheme || 'night';
        this.showUploadForm = false;
        this.pendingCloudFileUrl = '';
        this.uploadStatusText = '';

        this.boundRemotePull = () => {
            const refreshed = JSON.parse(localStorage.getItem('our_garden_library_v1')) || {};
            if (refreshed.books) {
                this.books = ensureLibrarySeeds(refreshed.books);
                this.render();
                this.bindEvents();
            }
        };
    }

    connectedCallback() {
        this.saveLibrary();
        this.render();
        this.bindEvents();
        window.addEventListener('ecosystem:remote-pulled', this.boundRemotePull);
    }

    disconnectedCallback() {
        window.removeEventListener('ecosystem:remote-pulled', this.boundRemotePull);
    }

    async saveLibrary() {
        localStorage.setItem('our_garden_library_v1', JSON.stringify({
            books: this.books,
            readingHistory: this.readingHistory,
            readerFontSize: this.readerFontSize,
            readerTheme: this.readerTheme
        }));
        await syncEngine.syncNow();
    }

    getFilteredBooks() {
        if (this.selectedCategory === 'Todas') return this.books;
        return this.books.filter(b => b.category === this.selectedCategory);
    }

    render() {
        const filtered = this.getFilteredBooks();
        const activeBook = this.books.find(b => b.id === this.activeBookId);

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">📚 Biblioteca del Amor</h1>
                <p class="hero-subtitle">
                    Nuestra estantería nocturna de poesía, cartas, filosofía y obras compartidas para leer juntos.
                </p>
            </section>

            <div class="glass-card" style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;text-align:left;">
                <div>
                    <span class="card-label" style="margin-bottom:2px;">🕯️ ESTANTERÍA NOCTURNA</span>
                    <div style="font-size:0.84rem;color:var(--accent-sunflower-soft);font-weight:700;">
                        ${this.books.length} obras disponibles • Incluye nuestro Menú de 4 Meses 🍷
                    </div>
                </div>
                <button type="button" class="pill-action-btn" id="btn-toggle-upload-book">
                    ➕ Adjuntar Libro / Poema / Foto
                </button>
            </div>

            <div class="stage-card" id="upload-book-panel" style="display:${this.showUploadForm ? 'block' : 'none'};margin-top:0;margin-bottom:14px;border-color:var(--border-gold);">
                <h3 style="color:var(--accent-sunflower);font-size:0.98rem;margin-bottom:8px;">📎 Adjuntar Obra, Poema o Fotografía de Página</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="up-book-title" placeholder="Título del libro o poema" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.84rem;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <input type="text" id="up-book-author" placeholder="Autor(a)" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.84rem;">
                        <select id="up-book-cat" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.82rem;">
                            ${LIBRARY_CATEGORIES.filter(c => c !== 'Todas').map(c => `<option value="${c}">${c}</option>`).join('')}
                        </select>
                    </div>
                    <input type="text" id="up-book-desc" placeholder="Breve descripción o dedicatoria" style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.84rem;">
                    <textarea id="up-book-body" rows="4" placeholder="Escribe o pega aquí el poema/capítulo, o sube una foto/archivo abajo..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px;border-radius:10px;font-size:0.84rem;"></textarea>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;align-items:center;">
                        <label class="loc-chip active" style="cursor:pointer;text-align:center;padding:8px;">
                            📄 Subir archivo (.txt, foto de página, .pdf)
                            <input type="file" id="up-book-file" accept=".txt,.md,.pdf,.epub,image/*" style="display:none;">
                        </label>
                        <input type="url" id="up-book-url" value="${this.pendingCloudFileUrl}" placeholder="O enlace externo (opcional)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:10px;font-size:0.8rem;">
                    </div>
                    <div id="up-file-status" style="font-size:0.76rem;color:var(--accent-emerald);">${this.uploadStatusText}</div>

                    <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:4px;">
                        <button type="button" class="loc-chip" id="btn-cancel-upload-book">Cancelar</button>
                        <button type="button" class="pill-action-btn" id="btn-save-upload-book">📚 Guardar y Sincronizar</button>
                    </div>
                </div>
            </div>

            <div class="location-bar" style="display:flex;margin-bottom:14px;padding-bottom:6px;">
                ${LIBRARY_CATEGORIES.map(cat => `
                    <button type="button" class="loc-chip ${this.selectedCategory === cat ? 'active' : ''}" data-lib-cat="${cat}">
                        ${cat}
                    </button>
                `).join('')}
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;">
                ${filtered.map(book => `
                    <article class="stage-card" style="margin-top:0;display:flex;gap:12px;align-items:stretch;border-color:${book.id === 'book-menu-4-meses' ? 'var(--border-gold)' : 'var(--border-subtle)'};">
                        <div style="width:78px;flex-shrink:0;background:${book.coverGradient || 'linear-gradient(135deg,#f59e0b,#78350f)'};border-radius:12px;border:1px solid rgba(255,255,255,0.28);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px;text-align:center;box-shadow:0 6px 18px rgba(0,0,0,0.6);">
                            <div style="font-size:2.1rem;">${book.coverEmoji || '📖'}</div>
                            <span style="font-size:0.62rem;font-weight:800;color:#fff;margin-top:6px;line-height:1.2;">${book.category}</span>
                        </div>

                        <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
                            <div>
                                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:4px;">
                                    <span style="font-size:0.7rem;color:var(--accent-sky);font-weight:700;">${book.author}</span>
                                    <button type="button" class="loc-chip ${book.favorite ? 'active' : ''}" data-fav-book="${book.id}" style="padding:2px 7px;font-size:0.7rem;">
                                        ${book.favorite ? '⭐' : '☆'}
                                    </button>
                                </div>
                                <h3 style="color:var(--accent-sunflower-soft);font-size:0.98rem;margin:3px 0 5px;">${book.title}</h3>
                                <p style="font-size:0.78rem;color:var(--text-secondary);line-height:1.4;margin-bottom:8px;">${book.description}</p>
                            </div>

                            <div>
                                <div style="display:flex;justify-content:space-between;font-size:0.7rem;color:var(--text-secondary);margin-bottom:6px;">
                                    <span>Notas: ${(book.notes || []).length}</span>
                                    <span>💖 Rec. por ${book.recommendedBy === 'analy' ? 'Analy' : 'Kevin'}</span>
                                </div>
                                <div style="display:flex;gap:6px;">
                                    <button type="button" class="pill-action-btn" data-open-book="${book.id}" style="flex:1;justify-content:center;padding:6px 10px;font-size:0.76rem;">
                                        📖 Abrir Lector
                                    </button>
                                    <button type="button" class="loc-chip" data-rec-book="${book.id}" title="Recomendar a mi pareja">
                                        💌 Recomendar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>

            <div class="eco-modal-backdrop ${activeBook ? 'open' : ''}" id="library-reader-modal">
                ${activeBook ? this.renderReaderModal(activeBook) : ''}
            </div>
        `;
    }

    renderReaderModal(book) {
        const chapters = book.chapters || [{ title: 'Texto Completo', body: '' }];
        const currentChap = chapters[this.activeChapterIndex] || chapters[0];
        const isImageAttachment = book.externalUrl && (book.externalUrl.startsWith('data:image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(book.externalUrl));

        const themeStyles = {
            night: 'background:#070b18;color:#f8fafc;border:1px solid rgba(251,191,36,0.35);',
            sepia: 'background:#292014;color:#fef3c7;border:1px solid #d97706;'
        };

        return `
            <div class="eco-modal-box" style="max-width:560px;max-height:90vh;overflow-y:auto;${themeStyles[this.readerTheme] || themeStyles.night}">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;border-bottom:1px solid rgba(255,255,255,0.12);padding-bottom:10px;margin-bottom:12px;">
                    <div>
                        <span style="font-size:0.7rem;color:var(--accent-sky);font-weight:700;">${book.author} • ${book.license || 'Atribución conservada'}</span>
                        <h3 style="color:var(--accent-sunflower);font-size:1.08rem;">${book.title}</h3>
                    </div>
                    <button type="button" class="loc-chip" id="btn-close-reader">✕ Cerrar</button>
                </div>

                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:12px;background:rgba(0,0,0,0.3);padding:8px 10px;border-radius:10px;">
                    <div style="display:flex;gap:4px;">
                        <button type="button" class="loc-chip" id="btn-font-dec">A-</button>
                        <button type="button" class="loc-chip" id="btn-font-inc">A+</button>
                        <button type="button" class="loc-chip ${this.readerTheme === 'night' ? 'active' : ''}" data-rtheme="night">🌙 Noche</button>
                        <button type="button" class="loc-chip ${this.readerTheme === 'sepia' ? 'active' : ''}" data-rtheme="sepia">📜 Sepia</button>
                    </div>
                    <button type="button" class="loc-chip active" id="btn-bookmark-chap">
                        🔖 Cap. ${this.activeChapterIndex + 1}/${chapters.length}
                    </button>
                </div>

                ${chapters.length > 1 ? `
                    <div style="display:flex;gap:6px;overflow-x:auto;margin-bottom:12px;padding-bottom:4px;">
                        ${chapters.map((ch, idx) => `
                            <button type="button" class="loc-chip ${idx === this.activeChapterIndex ? 'active' : ''}" data-chap-idx="${idx}">
                                ${idx + 1}. ${ch.title}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}

                <div style="padding:14px 12px;border-radius:12px;background:rgba(0,0,0,0.25);margin-bottom:14px;">
                    <h4 style="color:var(--accent-sunflower-soft);margin-bottom:10px;font-size:1rem;">${currentChap.title}</h4>
                    <div style="font-size:${this.readerFontSize}rem;line-height:1.85;white-space:pre-line;font-family:Georgia, 'Times New Roman', serif;">${currentChap.body}</div>
                    ${isImageAttachment ? `
                        <div style="margin-top:12px;">
                            <img src="${book.externalUrl}" alt="${book.title}" style="width:100%;border-radius:10px;border:1px solid var(--border-gold);">
                        </div>
                    ` : book.externalUrl ? `
                        <div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.12);">
                            <a href="${book.externalUrl}" target="_blank" rel="noopener" class="pill-action-btn" style="text-decoration:none;display:inline-flex;">
                                🔗 Abrir Documento Adjunto
                            </a>
                        </div>
                    ` : ''}
                </div>

                <div style="margin-bottom:10px;">
                    <div style="display:flex;gap:6px;margin-bottom:8px;">
                        <input type="text" id="inp-book-note" placeholder="Agregar nota personal para que la lea mi pareja..." style="flex:1;background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;font-size:0.8rem;color:#fff;">
                        <button type="button" class="pill-action-btn" id="btn-add-book-note" style="padding:6px 12px;font-size:0.76rem;">📝 Guardar Nota</button>
                    </div>
                    ${(book.notes || []).length > 0 ? `
                        <div style="background:rgba(255,255,255,0.04);padding:8px 10px;border-radius:8px;font-size:0.78rem;">
                            <strong style="color:var(--accent-rose);">💭 Nuestras notas compartidas en este libro:</strong>
                            ${book.notes.map(n => `<div style="margin-top:4px;">• <strong>${n.author}:</strong> ${n.text}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelector('#btn-toggle-upload-book')?.addEventListener('click', () => {
            this.showUploadForm = !this.showUploadForm;
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-cancel-upload-book')?.addEventListener('click', () => {
            this.showUploadForm = false;
            this.pendingCloudFileUrl = '';
            this.uploadStatusText = '';
            this.render();
            this.bindEvents();
        });

        const fileInput = this.querySelector('#up-book-file');
        fileInput?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const ext = file.name.split('.').pop().toLowerCase();

            if (ext === 'txt' || ext === 'md') {
                const reader = new FileReader();
                reader.onload = () => {
                    const bodyArea = this.querySelector('#up-book-body');
                    if (bodyArea) bodyArea.value = String(reader.result);
                    const statusEl = this.querySelector('#up-file-status');
                    if (statusEl) statusEl.textContent = `✅ Texto extraído de "${file.name}".`;
                };
                reader.readAsText(file);
                return;
            }

            this.uploadStatusText = `⏳ Optimizando y subiendo "${file.name}"...`;
            const statusEl = this.querySelector('#up-file-status');
            if (statusEl) statusEl.textContent = this.uploadStatusText;

            const res = await syncEngine.uploadMediaFile(file, 'library');
            if (res.ok) {
                this.pendingCloudFileUrl = res.url;
                this.uploadStatusText = `✅ Archivo "${file.name}" listo para guardar.`;
            } else {
                this.uploadStatusText = `⚠️ ${res.message}`;
            }
            if (statusEl) statusEl.textContent = this.uploadStatusText;
        });

        this.querySelector('#btn-save-upload-book')?.addEventListener('click', async () => {
            const title = this.querySelector('#up-book-title')?.value.trim() || 'Obra compartida';
            const author = this.querySelector('#up-book-author')?.value.trim() || 'Kevin & Analy';
            const category = this.querySelector('#up-book-cat')?.value || 'Escritos personales';
            const description = this.querySelector('#up-book-desc')?.value.trim() || 'Obra adjuntada a nuestra Biblioteca del Amor.';
            const body = this.querySelector('#up-book-body')?.value.trim();
            const externalUrl = this.pendingCloudFileUrl || this.querySelector('#up-book-url')?.value.trim() || '';

            if (!body && !externalUrl) return;
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';

            this.books.unshift({
                id: 'book-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5),
                title,
                author,
                category,
                coverEmoji: '📘',
                coverGradient: 'linear-gradient(135deg, #4338ca, #0f172a)',
                license: 'Subido por ' + (activeUser === 'analy' ? 'Analy' : 'Kevin'),
                description,
                recommendedBy: activeUser,
                favorite: true,
                progress: 0,
                bookmarkChapter: 0,
                externalUrl,
                notes: [],
                chapters: [
                    { title: 'Capítulo 1', body: body || 'Página o documento adjunto abajo.' }
                ]
            });

            this.showUploadForm = false;
            this.pendingCloudFileUrl = '';
            this.uploadStatusText = '';
            await this.saveLibrary();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-lib-cat]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectedCategory = btn.dataset.libCat;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-fav-book]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const book = this.books.find(b => b.id === btn.dataset.favBook);
                if (book) {
                    book.favorite = !book.favorite;
                    await this.saveLibrary();
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.querySelectorAll('[data-rec-book]').forEach(btn => {
            btn.addEventListener('click', async () => {
                const book = this.books.find(b => b.id === btn.dataset.recBook);
                const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
                if (book) {
                    book.recommendedBy = activeUser;
                    await this.saveLibrary();
                    const msg = `📚 *Recomendación en nuestra Biblioteca del Amor* 🌻\n\nMi amor, te recomendé leer *"${book.title}"* de ${book.author} en nuestro jardín: https://santana282.github.io/our-garden/#/biblioteca`;
                    navigator.clipboard?.writeText(msg);
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.querySelectorAll('[data-open-book]').forEach(btn => {
            btn.addEventListener('click', async () => {
                this.activeBookId = btn.dataset.openBook;
                const book = this.books.find(b => b.id === this.activeBookId);
                this.activeChapterIndex = book?.bookmarkChapter || 0;
                this.render();
                this.bindEvents();
            });
        });

        const activeBook = this.books.find(b => b.id === this.activeBookId);
        if (activeBook) {
            this.querySelector('#btn-close-reader')?.addEventListener('click', () => {
                this.activeBookId = null;
                this.render();
                this.bindEvents();
            });

            this.querySelector('#btn-font-dec')?.addEventListener('click', async () => {
                this.readerFontSize = Math.max(0.82, +(this.readerFontSize - 0.08).toFixed(2));
                await this.saveLibrary();
                this.render();
                this.bindEvents();
            });

            this.querySelector('#btn-font-inc')?.addEventListener('click', async () => {
                this.readerFontSize = Math.min(1.45, +(this.readerFontSize + 0.08).toFixed(2));
                await this.saveLibrary();
                this.render();
                this.bindEvents();
            });

            this.querySelectorAll('[data-rtheme]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    this.readerTheme = btn.dataset.rtheme;
                    await this.saveLibrary();
                    this.render();
                    this.bindEvents();
                });
            });

            this.querySelectorAll('[data-chap-idx]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    this.activeChapterIndex = Number(btn.dataset.chapIdx);
                    await this.saveLibrary();
                    this.render();
                    this.bindEvents();
                });
            });

            this.querySelector('#btn-bookmark-chap')?.addEventListener('click', async () => {
                activeBook.bookmarkChapter = this.activeChapterIndex;
                await this.saveLibrary();
                this.render();
                this.bindEvents();
            });

            this.querySelector('#btn-add-book-note')?.addEventListener('click', async () => {
                const inp = this.querySelector('#inp-book-note');
                const val = inp?.value.trim();
                if (!val) return;
                const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
                activeBook.notes = activeBook.notes || [];
                activeBook.notes.unshift({
                    author: activeUser === 'analy' ? '👩🏻‍🍳 Analy' : '💻 Kevin',
                    text: val
                });
                await this.saveLibrary();
                this.render();
                this.bindEvents();
            });
        }
    }
}

customElements.define('library-view', LibraryView);