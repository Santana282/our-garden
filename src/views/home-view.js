import { syncEngine } from '../core/sync.js';

const ELEMENTS_INFO = {
    sun: {
        icon: '☀️',
        title: 'El Sol: Tu Luz y Calor',
        body: 'Representa tu ternura cuando me dices "Ánimo mi inge". Recuerda nuestro compromiso central: priorizar siempre la validación afectiva antes de cualquier barrera logística.'
    },
    water: {
        icon: '💧',
        title: 'El Agua: Tu Amor 24/7',
        body: 'Es cada detalle de cuidado mutuo: recordarnos el Omeprazol, las gotitas para los ojos, escucharnos con atención sobre Gastronomía y acompañarnos a distancia.'
    },
    earth: {
        icon: '🌱',
        title: 'La Tierra: Raíz y Hogar',
        body: 'Es nuestro presente activo. No posponer el cariño por miedos futuros ni convertir nuestra relación en un proyecto escolar, sino habitar el hoy juntos.'
    }
};

export const DEFAULT_DAILY_LIGHTS = [
    {
        id: 'luz-1',
        quote: 'Todo tiene su tiempo, y todo lo que se quiere debajo del cielo tiene su hora.',
        author: 'Eclesiastés 3:1',
        sourceVersion: 'Biblia Reina-Valera 1909 (Dominio Público)',
        category: 'Versículos bíblicos',
        date: '2026-11-05',
        reflection: 'No todo se resuelve inmediatamente. Algunas cosas necesitan paciencia, comprensión y acciones constantes en pareja.'
    },
    {
        id: 'luz-2',
        quote: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no hace sinrazón, no se ensancha.',
        author: '1 Corintios 13:4',
        sourceVersion: 'Biblia Reina-Valera 1909 (Dominio Público)',
        category: 'Pensamientos sobre el amor',
        date: '2026-11-06',
        reflection: 'Amar en el presente significa escuchar con ternura antes de levantar muros lógicos, cuidando el corazón del otro.'
    },
    {
        id: 'luz-3',
        quote: 'Nunca el ánimo se determine si no es con la razón y libre de enojo; jamás hagas nada mientras estés turbado.',
        author: 'Séneca',
        sourceVersion: 'De la Ira (Obra filosófica clásica • Dominio Público)',
        category: 'Reflexiones sobre la paciencia',
        date: '2026-11-07',
        reflection: 'Cuando el cansancio de madrugada aprieta, hacer una pausa y abrazarnos evita decir palabras que no sentimos.'
    },
    {
        id: 'luz-4',
        quote: 'Nunca se aparten de ti la misericordia y la verdad; átalas a tu cuello, escríbelas en la tabla de tu corazón.',
        author: 'Proverbios 3:3',
        sourceVersion: 'Biblia Reina-Valera 1909 (Dominio Público)',
        category: 'Enseñanzas sobre humildad',
        date: '2026-11-08',
        reflection: 'La lealtad y la transparencia con ternura son las raíces que sostienen nuestro jardín todos los días.'
    },
    {
        id: 'luz-5',
        quote: 'Al amanecer, cuando te cueste levantarte, ten a mano este pensamiento: me levanto para hacer la obra de un ser humano.',
        author: 'Marco Aurelio',
        sourceVersion: 'Meditaciones, Libro V (Dominio Público)',
        category: 'Pensamientos sobre disciplina y crecimiento',
        date: '2026-11-09',
        reflection: 'Tanto en Gastronomía como en Ingeniería, cada esfuerzo diario construye el futuro que soñamos compartir.'
    },
    {
        id: 'luz-6',
        quote: 'Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos.',
        author: 'Cantares 8:7',
        sourceVersion: 'Biblia Reina-Valera 1909 (Dominio Público)',
        category: 'Mensajes sobre esperanza y perseverancia',
        date: '2026-11-10',
        reflection: 'Ni la distancia entre Orizaba y Atlixco ni el cansancio diario pueden apagar un vínculo que se cuida con hechos.'
    },
    {
        id: 'luz-7',
        quote: 'No nos pertenece elegir las tormentas externas, pero sí la ternura con la que cuidamos a quien camina a nuestro lado.',
        author: 'Reflexión Original • Nuestro Jardín',
        sourceVersion: 'Reflexión original verificada para Kevin y Analy',
        category: 'Reflexiones sobre el cuidado de los demás',
        date: '2026-11-11',
        reflection: 'Cuando uno de los dos tenga un día pesado, nuestro refugio siempre será el apapacho, nunca el reproche.'
    }
];

const INITIAL_STAGES = [
    {
        id: 'etapa-1',
        title: 'Etapa 1 de 5: Girasol del Alba - Confianza Nocturna',
        leaves: [
            {
                id: 'l1',
                title: '1. Madrugada en Discord / Pestaña reducida en COD',
                kevinView: 'A veces me concentro de más en las partidas o en el código sin avisar a tiempo, sin mala intención.',
                analyView: 'Desgaste al esperar sin aviso claro cuando entras a partidas de Guerra de Clanes o te quedas en silencio.',
                action: 'Avisar siempre con cariño antes de iniciar partida y usar nuestra señal 🌻 para pausar todo.',
                wateredByKevin: true,
                wateredByAnaly: true
            },
            {
                id: 'l2',
                title: '2. Miedo a no ser prioridad o ser ocultada',
                kevinView: 'Mi aislamiento defensivo cuando me saturo de estrés hace parecer que pongo muros lógicos.',
                analyView: 'Necesidad de validación afectiva presente, certeza de prioridad y atención cálida sin evasivas.',
                action: 'Expresar en un mensaje corto cuando haya cansancio emocional en vez de desaparecer en silencio.',
                wateredByKevin: true,
                wateredByAnaly: true
            }
        ]
    }
];

export class HomeView extends HTMLElement {
    constructor() {
        super();
        this.uptimeTimer = null;
        this.stages = JSON.parse(localStorage.getItem('jardin_stages_v1')) || INITIAL_STAGES;
        this.lightState = JSON.parse(localStorage.getItem('our_garden_daily_light_v1')) || {
            customPhrases: [],
            favorites: [],
            reflections: [],
            selectedCategory: 'Todas',
            manualIndex: null
        };
        this.nasaData = null;
    }

    connectedCallback() {
        this.render();
        this.startUptimeCounter();
        this.bindEvents();
        this.fetchNasaAstronomyData();
    }

    disconnectedCallback() {
        if (this.uptimeTimer) clearInterval(this.uptimeTimer);
    }

    saveLightState() {
        localStorage.setItem('our_garden_daily_light_v1', JSON.stringify(this.lightState));
        syncEngine.syncNow();
    }

    getAllPhrases() {
        return [...(this.lightState.customPhrases || []), ...DEFAULT_DAILY_LIGHTS];
    }

    getTodayPhrase() {
        const all = this.getAllPhrases();
        const filtered = this.lightState.selectedCategory === 'Todas'
            ? all
            : all.filter(p => p.category === this.lightState.selectedCategory);
        const list = filtered.length > 0 ? filtered : all;

        if (this.lightState.manualIndex !== null && list[this.lightState.manualIndex]) {
            return list[this.lightState.manualIndex];
        }
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
        return list[dayOfYear % list.length];
    }

    getNextMonthlyAnniversary() {
        const now = new Date();
        let targetYear = now.getFullYear();
        let targetMonth = now.getMonth();

        if (now.getDate() === 22) {
            return '¡Hoy es nuestro Día 22! 🌻💖';
        }
        if (now.getDate() > 22) {
            targetMonth += 1;
            if (targetMonth > 11) {
                targetMonth = 0;
                targetYear += 1;
            }
        }
        const next22 = new Date(targetYear, targetMonth, 22, 0, 0, 0);
        const diffDays = Math.ceil((next22 - now) / 86400000);
        return `Día 22 en ${diffDays}d • Presente Activo 💖`;
    }

    getRealAstronomicalTelemetry() {
        const now = new Date();
        const lp = 2551443;
        const newMoonRef = new Date('2026-01-18T19:52:00Z');
        const phaseSecs = ((now.getTime() - newMoonRef.getTime()) / 1000) % lp;
        const normalized = (phaseSecs < 0 ? phaseSecs + lp : phaseSecs) / lp;
        const illumination = Math.round((1 - Math.cos(normalized * 2 * Math.PI)) * 50);

        let moonName = 'Luna Nueva 🌑';
        if (normalized > 0.03 && normalized < 0.22) moonName = 'Luna Creciente 🌒';
        else if (normalized >= 0.22 && normalized <= 0.28) moonName = 'Cuarto Creciente 🌓';
        else if (normalized > 0.28 && normalized < 0.47) moonName = 'Gibosa Creciente 🌔';
        else if (normalized >= 0.47 && normalized <= 0.53) moonName = 'Luna Llena 🌕';
        else if (normalized > 0.53 && normalized < 0.72) moonName = 'Gibosa Menguante 🌖';
        else if (normalized >= 0.72 && normalized <= 0.78) moonName = 'Cuarto Menguante 🌗';
        else if (normalized > 0.78 && normalized < 0.97) moonName = 'Luna Menguante 🌘';

        const hour = now.getHours();
        let skyScenario = 'Noche Profunda (20:00 - 23:59)';
        if (hour >= 6 && hour < 9) skyScenario = 'Amanecer Dorado (06:00 - 08:59)';
        else if (hour >= 9 && hour < 17) skyScenario = 'Día Celeste (09:00 - 17:29)';
        else if (hour >= 17 && hour < 20) skyScenario = 'Atardecer Violeta (17:30 - 19:59)';
        else if (hour >= 0 && hour < 6) skyScenario = 'Madrugada Serena (00:00 - 05:59)';

        return { moonName, illumination, skyScenario };
    }

    async fetchNasaAstronomyData() {
        try {
            const cached = sessionStorage.getItem('our_garden_nasa_apod');
            if (cached) {
                this.nasaData = JSON.parse(cached);
                this.updateNasaBadge();
                return;
            }
            const res = await fetch('[https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY](https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY)');
            if (!res.ok) return;
            const data = await res.json();
            this.nasaData = { title: data.title, date: data.date };
            sessionStorage.setItem('our_garden_nasa_apod', JSON.stringify(this.nasaData));
            this.updateNasaBadge();
        } catch (e) {}
    }

    updateNasaBadge() {
        const el = this.querySelector('#nasa-real-telemetry');
        if (el && this.nasaData) {
            el.textContent = `🛰️ Efeméride NASA APOD (${this.nasaData.date}): "${this.nasaData.title}"`;
        }
    }

    calculateVitality() {
        let totalActions = 14;
        let completed = 0;
        this.stages.forEach(s => {
            s.leaves.forEach(l => {
                if (l.wateredByKevin) completed++;
                if (l.wateredByAnaly) completed++;
            });
        });
        const sunflowers = JSON.parse(localStorage.getItem('our_garden_sunflowers_v2')) || [];
        sunflowers.forEach(f => {
            if (f.kevinResolved) completed++;
            if (f.analyResolved) completed++;
        });
        const capped = Math.min(totalActions, completed);
        const pct = Math.min(100, Math.round(10 + (capped / totalActions) * 90));
        return { pct, completed: capped, totalActions };
    }

    render() {
        const vit = this.calculateVitality();
        const currentStage = this.stages[0];
        const todayLight = this.getTodayPhrase();
        const isFav = (this.lightState.favorites || []).includes(todayLight.id);
        const astro = this.getRealAstronomicalTelemetry();
        const next22Label = this.getNextMonthlyAnniversary();
        const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';

        this.innerHTML = `
            <section class="hero-section">
                <h1 class="hero-title">Nuestro Ecosistema</h1>
                <p class="hero-subtitle">
                    Un jardín vivo sincronizado con nuestro cielo, tu ciclo, nuestra biblioteca y nuestras soluciones en el presente.
                </p>
            </section>

            <!-- Métricas Principales -->
            <div class="cards-grid-3">
                <div class="glass-card">
                    <span class="card-label">⏱️ TIEMPO JUNTOS</span>
                    <div class="card-value" id="home-uptime-val">Calculando...</div>
                </div>
                <div class="glass-card">
                    <span class="card-label">🌱 VITALIDAD</span>
                    <div class="card-value emerald" id="home-vitality-val">${vit.pct}% (${vit.completed}/${vit.totalActions})</div>
                </div>
                <div class="glass-card">
                    <span class="card-label">📅 ANIVERSARIO MENSUAL</span>
                    <div class="card-value rose" style="font-size:0.82rem;">${next22Label}</div>
                </div>
            </div>

            <!-- SECCIÓN 26: MÓDULO "UNA LUZ PARA HOY" -->
            <div class="stage-card" style="border-color:var(--border-gold);margin-top:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:8px;">
                    <span style="font-size:0.75rem;font-weight:800;color:var(--accent-sunflower);text-transform:uppercase;letter-spacing:0.5px;">
                        ✨ Una luz para hoy • ${todayLight.category}
                    </span>
                    <div style="display:flex;gap:6px;">
                        <button type="button" class="loc-chip ${isFav ? 'active' : ''}" id="btn-fav-light" title="Guardar en favoritas">
                            ${isFav ? '⭐ Favorita' : '☆ Guardar'}
                        </button>
                        <button type="button" class="loc-chip" id="btn-next-light" title="Ver otra frase">🔄 Otra luz</button>
                        <button type="button" class="loc-chip" id="btn-archive-light">📜 Archivo</button>
                    </div>
                </div>

                <blockquote style="font-size:1.02rem;font-style:italic;color:#fef3c7;line-height:1.6;margin:8px 0;padding-left:12px;border-left:3px solid var(--accent-sunflower);">
                    "${todayLight.quote}"
                </blockquote>

                <div style="font-size:0.8rem;font-weight:800;color:var(--accent-sky);margin-bottom:8px;">
                    — ${todayLight.author} <span style="font-weight:400;color:var(--text-secondary);">(${todayLight.sourceVersion})</span>
                </div>

                <div style="background:rgba(255,255,255,0.04);padding:10px 12px;border-radius:10px;font-size:0.84rem;color:var(--text-primary);margin-bottom:10px;">
                    <strong style="color:var(--accent-emerald);">🌱 Reflexión:</strong> ${todayLight.reflection}
                </div>

                <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">
                    <input type="text" id="inp-light-reflection" placeholder="Añadir nuestra reflexión personal (${activeUser === 'kevin' ? 'Kevin' : 'Analy'})..." style="flex:1;min-width:180px;background:#060a17;border:1px solid var(--border-subtle);padding:7px 10px;border-radius:8px;font-size:0.8rem;">
                    <button type="button" class="pill-action-btn" id="btn-save-light-ref" style="padding:6px 12px;font-size:0.76rem;">💬 Guardar</button>
                    <button type="button" class="loc-chip" id="btn-share-light" style="font-size:0.75rem;">📲 Compartir</button>
                </div>
            </div>

            <!-- Los 3 Elementos -->
            <div class="cards-grid-3">
                <div class="element-btn-card sun" data-element="sun">
                    <span class="card-label">☀️ EL SOL</span>
                    <div class="card-value" style="font-size:0.86rem;">Tu Luz y Calor</div>
                </div>
                <div class="element-btn-card water" data-element="water">
                    <span class="card-label">💧 EL AGUA</span>
                    <div class="card-value" style="font-size:0.86rem;">Tu Amor 24/7</div>
                </div>
                <div class="element-btn-card earth" data-element="earth">
                    <span class="card-label">🌱 LA TIERRA</span>
                    <div class="card-value" style="font-size:0.86rem;">Raíz y Hogar</div>
                </div>
            </div>

            <!-- SECCIÓN 23: TELEMETRÍA ASTRONÓMICA REAL VS. REPRESENTACIÓN GENERATIVA -->
            <div class="glass-card" style="text-align:left;margin-top:12px;padding:12px 14px;">
                <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:6px;">
                    <span style="font-size:0.72rem;font-weight:800;color:var(--accent-sky);text-transform:uppercase;">
                        🔭 Observatorio en Tiempo Real • Transparencia Científica
                    </span>
                    <a href="#/biblioteca" class="loc-chip active" style="text-decoration:none;font-size:0.7rem;">📚 Ir a Biblioteca del Amor ➔</a>
                </div>
                <div style="font-size:0.8rem;color:var(--text-primary);display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px;">
                    <div>
                        <strong style="color:var(--accent-sunflower-soft);">📊 Datos Astronómicos Reales:</strong><br>
                        Fase Lunar: ${astro.moonName} (${astro.illumination}% iluminada)<br>
                        <span id="nasa-real-telemetry" style="font-size:0.74rem;color:var(--text-secondary);">Sincronizado con ciclo solar local</span>
                    </div>
                    <div>
                        <strong style="color:var(--accent-rose);">🎨 Simulación Visual Generativa:</strong><br>
                        Escenario activo: ${astro.skyScenario}<br>
                        <span style="font-size:0.74rem;color:var(--text-secondary);">Agujero negro Phoenix-A y nebulosas generadas en Canvas 2D</span>
                    </div>
                </div>
            </div>

            <!-- Tarjeta Interactiva de Etapa del Girasol -->
            <div class="stage-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;flex-wrap:wrap;gap:6px;">
                    <div class="stage-title" style="margin-bottom:0;">
                        <span>🌻</span>
                        <span>${currentStage.title}</span>
                    </div>
                    <a href="#/jardin" class="loc-chip active" style="text-decoration:none;">Ver los 5 Girasoles ➔</a>
                </div>
                <div id="stage-leaves-list">
                    ${currentStage.leaves.map((leaf, idx) => `
                        <div class="stage-item ${leaf.wateredByKevin && leaf.wateredByAnaly ? 'healed' : ''}" data-leaf-index="${idx}">
                            <div style="font-weight:700;">${leaf.title}</div>
                            <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;">
                                Riego: 💻 Kevin ${leaf.wateredByKevin ? '✅' : '⏳'} • 👩🏻‍🍳 Analy ${leaf.wateredByAnaly ? '✅' : '⏳'} (Toca para abrir)
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="eco-modal-backdrop" id="home-modal">
                <div class="eco-modal-box" id="home-modal-content"></div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelector('#btn-fav-light')?.addEventListener('click', () => {
            const todayLight = this.getTodayPhrase();
            const favs = this.lightState.favorites || [];
            const idx = favs.indexOf(todayLight.id);
            if (idx >= 0) favs.splice(idx, 1);
            else favs.push(todayLight.id);
            this.lightState.favorites = favs;
            this.saveLightState();
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-next-light')?.addEventListener('click', () => {
            const all = this.getAllPhrases();
            const current = this.lightState.manualIndex ?? 0;
            this.lightState.manualIndex = (current + 1) % all.length;
            this.saveLightState();
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-save-light-ref')?.addEventListener('click', () => {
            const inp = this.querySelector('#inp-light-reflection');
            const text = inp?.value.trim();
            if (!text) return;
            const todayLight = this.getTodayPhrase();
            const activeUser = localStorage.getItem('our_garden_active_user') || 'kevin';
            this.lightState.reflections = this.lightState.reflections || [];
            this.lightState.reflections.unshift({
                phraseId: todayLight.id,
                quoteTitle: todayLight.author,
                author: activeUser,
                text,
                date: new Date().toLocaleDateString('es-MX')
            });
            this.saveLightState();
            inp.value = '';
            this.openArchiveLightsModal();
        });

        this.querySelector('#btn-share-light')?.addEventListener('click', () => {
            const todayLight = this.getTodayPhrase();
            const shareText = `✨ *Una luz para hoy en Nuestro Jardín* 🌻\n\n"${todayLight.quote}"\n— ${todayLight.author} (${todayLight.sourceVersion})\n\n💭 Reflexión: ${todayLight.reflection}`;
            navigator.clipboard?.writeText(shareText);
            this.openModal(`
                <div style="text-align:center;">
                    <div style="font-size:2.5rem;margin-bottom:8px;">✨</div>
                    <h3 style="color:var(--accent-sunflower);margin-bottom:8px;">Frase Copiada para Compartir</h3>
                    <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:14px;">Ya está en tu portapapeles lista para pegarla en WhatsApp.</p>
                    <button type="button" class="pill-action-btn" id="close-eco-modal" style="margin:0 auto;">Cerrar</button>
                </div>
            `);
        });

        this.querySelector('#btn-archive-light')?.addEventListener('click', () => {
            this.openArchiveLightsModal();
        });

        this.querySelectorAll('.element-btn-card').forEach(card => {
            card.addEventListener('click', () => {
                const key = card.dataset.element;
                const info = ELEMENTS_INFO[key];
                this.openModal(`
                    <div style="text-align:center;">
                        <div style="font-size:3rem;margin-bottom:8px;">${info.icon}</div>
                        <h3 style="color:var(--accent-sunflower);margin-bottom:10px;">${info.title}</h3>
                        <p style="font-size:0.92rem;color:var(--text-primary);line-height:1.6;">${info.body}</p>
                        <button type="button" class="pill-action-btn" id="close-eco-modal" style="margin:18px auto 0;">Cerrar</button>
                    </div>
                `);
            });
        });

        this.querySelectorAll('.stage-item').forEach(item => {
            item.addEventListener('click', () => {
                const idx = Number(item.dataset.leafIndex);
                const leaf = this.stages[0].leaves[idx];
                this.openLeafModal(leaf, idx);
            });
        });
    }

    openArchiveLightsModal() {
        const all = this.getAllPhrases();
        const refs = this.lightState.reflections || [];
        this.openModal(`
            <div style="max-height:80vh;overflow-y:auto;text-align:left;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <h3 style="color:var(--accent-sunflower);font-size:1.05rem;">📜 Archivo de "Una luz para hoy"</h3>
                    <button type="button" class="loc-chip" id="close-eco-modal">✕</button>
                </div>
                ${refs.length > 0 ? `
                    <div style="margin-bottom:12px;background:rgba(52,211,153,0.1);padding:10px;border-radius:10px;">
                        <strong style="font-size:0.78rem;color:var(--accent-emerald);">💬 Nuestras reflexiones guardadas:</strong>
                        ${refs.slice(0, 5).map(r => `
                            <div style="font-size:0.8rem;margin-top:6px;border-bottom:1px solid var(--border-subtle);padding-bottom:4px;">
                                <strong>${r.author === 'kevin' ? '💻 Kevin' : '👩🏻‍🍳 Analy'} (${r.date} • ${r.quoteTitle}):</strong> ${r.text}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div style="display:flex;flex-direction:column;gap:8px;">
                    ${all.map((p) => `
                        <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;font-size:0.8rem;">
                            <span style="color:var(--accent-sky);font-weight:700;">${p.category} • ${p.author}</span>
                            <p style="font-style:italic;margin:4px 0;">"${p.quote}"</p>
                            <div style="font-size:0.72rem;color:var(--text-secondary);">${p.sourceVersion}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `);
    }

    openLeafModal(leaf, idx) {
        this.openModal(`
            <div>
                <h3 style="color:var(--accent-sunflower);font-size:1rem;margin-bottom:10px;">🌻 ${leaf.title}</h3>
                <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;margin-bottom:8px;font-size:0.84rem;">
                    <strong style="color:var(--accent-sky);">💻 Perspectiva de Kevin:</strong>
                    <p style="margin-top:4px;">${leaf.kevinView}</p>
                </div>
                <div style="background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;margin-bottom:8px;font-size:0.84rem;">
                    <strong style="color:var(--accent-rose);">👩🏻‍🍳 Perspectiva de Analy:</strong>
                    <p style="margin-top:4px;">${leaf.analyView}</p>
                </div>
                <div style="background:rgba(52,211,153,0.1);border-left:3px solid var(--accent-emerald);padding:10px;border-radius:8px;margin-bottom:14px;font-size:0.84rem;">
                    <strong style="color:var(--accent-emerald);">🤝 Acuerdo de Reparación:</strong>
                    <p style="margin-top:4px;">${leaf.action}</p>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <button type="button" class="pill-action-btn" id="water-kevin-btn" style="justify-content:center;">
                        💧 Regar (Kevin) ${leaf.wateredByKevin ? '✅' : ''}
                    </button>
                    <button type="button" class="pill-action-btn" id="water-analy-btn" style="justify-content:center;border-color:var(--border-pink);color:var(--accent-rose);">
                        💧 Regar (Analy) ${leaf.wateredByAnaly ? '✅' : ''}
                    </button>
                </div>
                <button type="button" class="pill-action-btn" id="close-eco-modal" style="width:100%;justify-content:center;margin-top:12px;border-color:var(--border-subtle);color:var(--text-secondary);">
                    Cerrar ventana
                </button>
            </div>
        `);

        this.querySelector('#water-kevin-btn')?.addEventListener('click', () => {
            this.stages[0].leaves[idx].wateredByKevin = !this.stages[0].leaves[idx].wateredByKevin;
            this.saveAndRefresh();
        });

        this.querySelector('#water-analy-btn')?.addEventListener('click', () => {
            this.stages[0].leaves[idx].wateredByAnaly = !this.stages[0].leaves[idx].wateredByAnaly;
            this.saveAndRefresh();
        });
    }

    saveAndRefresh() {
        localStorage.setItem('jardin_stages_v1', JSON.stringify(this.stages));
        syncEngine.syncNow();
        this.render();
        this.startUptimeCounter();
        this.bindEvents();
    }

    openModal(html) {
        const modal = this.querySelector('#home-modal');
        const content = this.querySelector('#home-modal-content');
        if (!modal || !content) return;
        content.innerHTML = html;
        modal.classList.add('open');
        content.querySelector('#close-eco-modal')?.addEventListener('click', () => {
            modal.classList.remove('open');
        });
    }

    startUptimeCounter() {
        const startRel = new Date(2026, 6, 22, 0, 0, 0); // 22 de julio de 2026
        const update = () => {
            const now = new Date();
            const diff = Math.max(0, now - startRel);
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const mins = Math.floor((diff % 3600000) / 60000);
            const el = this.querySelector('#home-uptime-val');
            if (el) el.textContent = `${days}d ${hours}h ${mins}m`;
        };
        update();
        this.uptimeTimer = setInterval(update, 30000);
    }
}

customElements.define('home-view', HomeView);