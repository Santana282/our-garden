import { syncEngine } from '../core/sync.js';

const INITIAL_SUNFLOWERS = [
    {
        id: 'girasol-1',
        stage: 'Etapa 1 • Girasol del Alba',
        title: 'Presente Activo vs. Futuro y Validación Afectiva',
        date: '2026-09-27',
        description: 'Conversación de madrugada sobre la necesidad de habitar el presente juntos sin sentir que la relación se trata como un proyecto académico o que la estabilidad futura desplaza el cariño de hoy.',
        kevinPerspective: 'Mis prioridades de escuela y buscar dónde vivir me hicieron responder corto o enfocarme en resolver problemas futuros, sin notar que parecía frialdad o rechazo.',
        analyPerspective: 'Sentí que estaba en tu futuro pero no en tu presente, recibiendo respuestas cortantes cuando solo buscaba robarte un ratito, sentir prioridad y calidez sin ser tratada como proyecto de universidad.',
        kevinEmotions: 'Preocupación por dar estabilidad, abrumación logística y miedo a no dar el ancho económico en el momento.',
        analyEmotions: 'Tristeza por sentirse rechazada, cansancio de insistir y necesidad de certeza afectiva en el presente.',
        psychInsight: 'Choque entre el lenguaje de cuidado instrumental (asegurar el futuro) y la necesidad de vinculación emocional presente. Validar primero el sentimiento desactiva la defensiva.',
        agreements: 'Priorizar la validación afectiva antes que cualquier barrera logística; nunca responder frío cuando el otro busca cercanía.',
        repairActions: [
            { id: 'a1', text: 'Adelantar exámenes y liberar medio día cuando Analy visite Orizaba para estar juntos', done: true },
            { id: 'a2', text: 'Pausar debates lógicos de madrugada y abrazarnos con palabras cálidas primero', done: true }
        ],
        waterCount: 6,
        kevinResolved: true,
        analyResolved: true,
        status: 'Resuelto en acuerdo mutuo',
        history: [
            '27/09/2026: Registro del conflicto de madrugada.',
            '23/10/2026: Kevin adelantó exámenes para recibir a Analy en el ADO de Orizaba y disfrutar el fin de semana juntos.'
        ]
    },
    {
        id: 'girasol-2',
        stage: 'Etapa 2 • Girasol de Escuadra',
        title: 'Comunicación en COD (MJ/BR) y Certeza de Elegirnos',
        date: '2026-10-15',
        description: 'Malentendido nocturno jugando en escuadra sobre seguir el ritmo o cambiar a multijugador, que escaló al miedo de Analy de estar lastimando o cuestionarse terminar.',
        kevinPerspective: 'Intentaba explicar por qué en escuadra de 4 necesitaba mi escopeta a diferencia de cuando jugamos en dúo, pero me frustré al sentir que no me daba a entender y me asustó leer que pensaras en terminar.',
        analyPerspective: 'Sentí que te habías molestado o salido por mi hermano, y al acumularse la tensión pensé que te daba dolores de cabeza y que quizá estarías más tranquilo sin mí.',
        kevinEmotions: 'Frustración por el malentendido y temor real a perder el vínculo ("Yo no quiero terminar, te elegiría a ti").',
        analyEmotions: 'Culpa, saturación emocional y miedo a ser la versión incierta en la relación.',
        psychInsight: 'El cansancio después de las 11:30 PM amplifica los roces de juego. Hablar por voz en Discord reduce la interpretación dura del texto escrito.',
        agreements: 'No tomar decisiones ni cuestionar la relación durante una discusión de madrugada; pasar a llamada tranquila o descansar juntos.',
        repairActions: [
            { id: 'b1', text: 'Reafirmar explícitamente que nos elegimos incluso cuando no estamos de acuerdo en todo', done: true },
            { id: 'b2', text: 'Avisar con calma en el lobby antes de cambiar entre BR y MJ', done: true }
        ],
        waterCount: 5,
        kevinResolved: true,
        analyResolved: true,
        status: 'Resuelto en acuerdo mutuo',
        history: [
            '14/10/2026: Roce durante partida nocturna de COD.',
            '15/10/2026: Conversación en Discord aclarando que ninguno desea terminar.'
        ]
    },
    {
        id: 'girasol-3',
        stage: 'Etapa 3 • Girasol de Orizaba',
        title: 'Primer Encuentro en Orizaba y Seguridad en la Intimidad',
        date: '2026-10-27',
        description: 'Al regresar en autobús de Orizaba a Puebla tras nuestro primer fin de semana juntos, Analy expresó timidez e inseguridad sobre su cuerpo y si la experiencia íntima había sido grata.',
        kevinPerspective: 'Para mí fueron días increíbles desde ir por ti al ADO hasta cuidar tu cobijita que se quedó bajo mi sudadera; me encantó estar contigo en todo sentido.',
        analyPerspective: 'Me dio pena pensar que por mi peso o mis piernas no te hubiera satisfecho del todo y necesitaba saber con ternura que la experiencia conmigo te gustó de verdad.',
        kevinEmotions: 'Gratitud profunda por la visita, atracción genuina y deseo de hacerla sentir completamente segura y deseada.',
        analyEmotions: 'Vulnerabilidad física, cariño profundo tras la despedida y búsqueda de reafirmación amorosa.',
        psychInsight: 'Abrir una inseguridad corporal requiere confianza absoluta. La validación cálida e inmediata transforma la vulnerabilidad en intimidad segura.',
        agreements: 'Expresar con total confianza cualquier inseguridad física o emocional sabiendo que el otro responderá con admiración, cuidado y respeto.',
        repairActions: [
            { id: 'c1', text: 'Reafirmar con palabras claras cuánto nos gustamos y disfrutamos estar juntos', done: true },
            { id: 'c2', text: 'Guardar la cobijita con cariño para nuestro próximo encuentro en diciembre', done: true }
        ],
        waterCount: 8,
        kevinResolved: true,
        analyResolved: true,
        status: 'Floreciendo en plenitud',
        history: [
            '23/10/2026: Llegada de Analy al ADO de Orizaba a las 21:58.',
            '27/10/2026: Despedida de Nacho y Pimpon, regreso a casa y validación amorosa.'
        ]
    },
    {
        id: 'girasol-4',
        stage: 'Etapa 4 • Girasol de Luz Propia',
        title: 'Brillar desde la Oscuridad y Aceptación Genuina',
        date: '2026-10-30',
        description: 'Conversación honesta sobre heridas del pasado, la percepción de los demás por la mirada seria de Kevin y el deseo de ser una base sólida sin perder la esencia.',
        kevinPerspective: 'He atravesado hundimientos fuertes en el pasado y decidí vivir para demostrar que puedo dar luz y ser un buen compañero, aunque a veces la gente juzgue mi mirada o carácter.',
        analyPerspective: 'Nadie nos enseñó a vivir; es nuestra primera vez siendo humanos. Yo te acepto exactamente como eres y es bonito que no cualquiera conozca el gran hombre que realmente eres por dentro.',
        kevinEmotions: 'Alivio al sentirse comprendido sin juicios y motivación para mantenerse firme.',
        analyEmotions: 'Empatía, ternura protectora y orgullo por el corazón real de su pareja.',
        psychInsight: 'El refugio seguro en la pareja permite hablar de dolores pasados sin miedo al estigma, fortaleciendo la resiliencia compartida.',
        agreements: 'Recordarnos mutuamente nuestra luz cuando el estrés externo apriete y nunca exigirnos fingir una personalidad que no somos.',
        repairActions: [
            { id: 'd1', text: 'Mantener comunicación honesta cuando el ánimo baje sin aislarnos', done: true }
        ],
        waterCount: 4,
        kevinResolved: true,
        analyResolved: true,
        status: 'En cuidado constante',
        history: [
            '30/10/2026: Plática profunda sobre valentía de vivir y aceptación mutua.'
        ]
    },
    {
        id: 'girasol-5',
        stage: 'Etapa 5 • Girasol del Horizonte',
        title: 'Plan de Hogar Compartido, Enología y Metas 2026-2027',
        date: '2026-11-04',
        description: 'Construcción de acuerdos sobre dónde vivir a futuro (Orizaba, Puebla o punto medio con clima fresco), fondo en Revolut, emprendimiento gastronómico/tecnológico y viajes próximos.',
        kevinPerspective: 'Quiero construir un patrimonio sólido para los dos sin pagar renta innecesaria, aprender de ti sobre vinos y Enología, vernos en diciembre (Pachuca/CDMX) y en verano ir a Puebla.',
        analyPerspective: 'Me ilusiona celebrar nuestros logros con un Cabernet Sauvignon o Merlot, que este año conozcas a mi familia, que despeguen nuestros proyectos y armar nuestro hogar en común acuerdo.',
        kevinEmotions: 'Entusiasmo emprendedor, compromiso a largo plazo y curiosidad por el mundo gastronómico de Analy.',
        analyEmotions: 'Ilusión compartida, orgullo académico y deseo de cercanía familiar y climas frescos.',
        psychInsight: 'Planificar metas a mediano plazo funciona mejor cuando se acompaña de pequeños rituales cercanos (citas, catas de vino y escapadas confirmadas).',
        agreements: 'Decidir juntos nuestro futuro hogar respetando la opinión de ambos e ir cumpliendo paso a paso nuestra lista de objetivos.',
        repairActions: [
            { id: 'e1', text: 'Organizar escapada de diciembre (CDMX / Pachuca) y conocer a la familia de Analy', done: false },
            { id: 'e2', text: 'Realizar nuestra primera cata formal de Cabernet Sauvignon y Merlot juntos', done: false }
        ],
        waterCount: 4,
        kevinResolved: false,
        analyResolved: false,
        status: 'En crecimiento activo',
        history: [
            '21/10/2026: Apertura de nuestra cuenta de ahorro en Revolut y plática sobre Enología.',
            '25/10/2026: Creación de nuestra lista de objetivos actualizable (Pinky Promise).'
        ]
    }
];

export class GardenView extends HTMLElement {
    constructor() {
        super();
        this.sunflowers = JSON.parse(localStorage.getItem('our_garden_sunflowers_v2')) || INITIAL_SUNFLOWERS;
        this.selectedId = null;
        this.activeAuthor = localStorage.getItem('our_garden_active_user') || 'kevin';
        this.filterStage = 'all';
        this.boundRemotePull = () => {
            this.sunflowers = JSON.parse(localStorage.getItem('our_garden_sunflowers_v2')) || INITIAL_SUNFLOWERS;
            this.render();
            this.bindEvents();
        };
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
        window.addEventListener('ecosystem:remote-pulled', this.boundRemotePull);
    }

    disconnectedCallback() {
        window.removeEventListener('ecosystem:remote-pulled', this.boundRemotePull);
    }

    saveData() {
        localStorage.setItem('our_garden_sunflowers_v2', JSON.stringify(this.sunflowers));
        syncEngine.syncNow();
    }

    getVitalitySummary() {
        const total = this.sunflowers.length;
        const resolved = this.sunflowers.filter(f => f.kevinResolved && f.analyResolved).length;
        const totalWater = this.sunflowers.reduce((acc, f) => acc + (f.waterCount || 0), 0);
        return { total, resolved, totalWater };
    }

    render() {
        const summary = this.getVitalitySummary();
        const filtered = this.filterStage === 'all'
            ? this.sunflowers
            : this.sunflowers.filter(f => (f.kevinResolved && f.analyResolved) === (this.filterStage === 'resolved'));

        const selectedFlower = this.sunflowers.find(f => f.id === this.selectedId);

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">🌻 Invernadero de Acuerdos y Cuidado</h1>
                <p class="hero-subtitle">
                    Cada girasol guarda nuestras dos miradas, nuestras necesidades y las acciones reales con las que cuidamos nuestro vínculo.
                </p>
            </section>

            <div class="glass-card" style="margin-bottom:14px;display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:10px;text-align:left;">
                <div>
                    <span class="card-label" style="margin-bottom:2px;">👤 INTERACTUANDO COMO:</span>
                    <div style="display:flex;gap:6px;margin-top:4px;">
                        <button type="button" class="loc-chip ${this.activeAuthor === 'kevin' ? 'active' : ''}" data-user="kevin">💻 Kevin</button>
                        <button type="button" class="loc-chip ${this.activeAuthor === 'analy' ? 'active' : ''}" data-user="analy">👩🏻‍🍳 Analy</button>
                    </div>
                </div>
                <div style="text-align:right;">
                    <span class="card-label" style="margin-bottom:2px;">🌱 AVANCES SINCRONIZADOS</span>
                    <div style="font-size:0.86rem;font-weight:800;color:var(--accent-emerald);">
                        ${summary.resolved}/${summary.total} Acordados • 💧 ${summary.totalWater} Riegos
                    </div>
                </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:14px;flex-wrap:wrap;">
                <div style="display:flex;gap:6px;">
                    <button type="button" class="loc-chip ${this.filterStage === 'all' ? 'active' : ''}" data-filter="all">Todos (${this.sunflowers.length})</button>
                    <button type="button" class="loc-chip ${this.filterStage === 'active' ? 'active' : ''}" data-filter="active">En crecimiento</button>
                    <button type="button" class="loc-chip ${this.filterStage === 'resolved' ? 'active' : ''}" data-filter="resolved">En acuerdo mutuo</button>
                </div>
                <button type="button" class="pill-action-btn" id="btn-new-sunflower">
                    🌱 Sembrar Girasol
                </button>
            </div>

            <div id="new-sunflower-form-box" class="stage-card" style="display:none;margin-bottom:16px;">
                <h3 style="color:var(--accent-sunflower);font-size:1rem;margin-bottom:10px;">🌱 Sembrar nueva experiencia o problema</h3>
                <div style="display:flex;flex-direction:column;gap:10px;">
                    <input type="text" id="nf-title" placeholder="Nombre de la experiencia o situación" style="background:#060a17;border:1px solid var(--border-subtle);padding:10px;border-radius:10px;font-size:0.88rem;">
                    <textarea id="nf-desc" rows="2" placeholder="¿Qué ocurrió? (Descripción neutral)" style="background:#060a17;border:1px solid var(--border-subtle);padding:10px;border-radius:10px;font-size:0.85rem;"></textarea>
                    <textarea id="nf-perspective" rows="2" placeholder="Mi perspectiva y cómo me sentí (${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'})" style="background:#060a17;border:1px solid var(--border-subtle);padding:10px;border-radius:10px;font-size:0.85rem;"></textarea>
                    <input type="text" id="nf-agreement" placeholder="Propuesta de acuerdo o acción de cuidado" style="background:#060a17;border:1px solid var(--border-subtle);padding:10px;border-radius:10px;font-size:0.85rem;">
                    <div style="display:flex;gap:8px;justify-content:flex-end;">
                        <button type="button" class="loc-chip" id="cancel-new-sunflower">Cancelar</button>
                        <button type="button" class="pill-action-btn" id="save-new-sunflower">🌻 Guardar y Sincronizar</button>
                    </div>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px;">
                ${filtered.map(flower => {
                    const isBothAgreed = flower.kevinResolved && flower.analyResolved;
                    const flowerEmoji = isBothAgreed ? '🌻' : (flower.waterCount >= 4 ? '🌼' : '🌱');
                    return `
                        <div class="stage-card" style="margin-top:0;border-color:${isBothAgreed ? 'var(--border-green)' : 'var(--border-gold)'};cursor:pointer;" data-open-flower="${flower.id}">
                            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
                                <div>
                                    <span style="font-size:0.72rem;color:var(--accent-sky);font-weight:700;text-transform:uppercase;">${flower.stage} • ${flower.date}</span>
                                    <h3 style="color:var(--accent-sunflower-soft);font-size:1.05rem;margin:4px 0 6px;">${flowerEmoji} ${flower.title}</h3>
                                </div>
                                <span class="loc-chip ${isBothAgreed ? 'active' : ''}" style="font-size:0.7rem;">
                                    💧 ${flower.waterCount}
                                </span>
                            </div>
                            <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:10px;">${flower.description}</p>
                            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.76rem;border-top:1px solid var(--border-subtle);padding-top:8px;">
                                <span>Acuerdo mutuo: 💻 ${flower.kevinResolved ? '✅' : '⏳'} • 👩🏻‍🍳 ${flower.analyResolved ? '✅' : '⏳'}</span>
                                <span style="color:var(--accent-sunflower);font-weight:700;">Abrir girasol ➔</span>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="eco-modal-backdrop ${selectedFlower ? 'open' : ''}" id="garden-detail-modal">
                ${selectedFlower ? this.renderFlowerDetailModal(selectedFlower) : ''}
            </div>
        `;
    }

    renderFlowerDetailModal(f) {
        const isBothAgreed = f.kevinResolved && f.analyResolved;
        return `
            <div class="eco-modal-box" style="max-width:540px;max-height:88vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:10px;">
                    <div>
                        <span style="font-size:0.72rem;color:var(--accent-sky);font-weight:700;">${f.stage} • ${f.date}</span>
                        <h3 style="color:var(--accent-sunflower);font-size:1.1rem;margin-top:2px;">🌻 ${f.title}</h3>
                    </div>
                    <button type="button" class="loc-chip" id="close-flower-modal">✕</button>
                </div>

                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">${f.description}</p>

                <div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:12px;">
                    <div style="background:rgba(56,189,248,0.08);border-left:3px solid var(--accent-sky);padding:10px;border-radius:8px;font-size:0.83rem;">
                        <strong style="color:var(--accent-sky);">💻 Perspectiva y sentir de Kevin:</strong>
                        <p style="margin-top:4px;">${f.kevinPerspective}</p>
                        <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"><em>Necesidad/Emoción:</em> ${f.kevinEmotions}</div>
                    </div>

                    <div style="background:rgba(251,113,133,0.08);border-left:3px solid var(--accent-rose);padding:10px;border-radius:8px;font-size:0.83rem;">
                        <strong style="color:var(--accent-rose);">👩🏻‍🍳 Perspectiva y sentir de Analy:</strong>
                        <p style="margin-top:4px;">${f.analyPerspective}</p>
                        <div style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;"><em>Necesidad/Emoción:</em> ${f.analyEmotions}</div>
                    </div>
                </div>

                <div style="background:rgba(192,132,252,0.1);border:1px solid rgba(192,132,252,0.35);padding:10px;border-radius:10px;font-size:0.82rem;margin-bottom:12px;">
                    <strong style="color:var(--accent-purple);">🧭 Lectura Afectiva (Comunicación No Violenta):</strong>
                    <p style="margin-top:4px;">${f.psychInsight}</p>
                </div>

                <div style="background:rgba(52,211,153,0.08);border:1px solid var(--border-green);padding:10px;border-radius:10px;font-size:0.83rem;margin-bottom:12px;">
                    <strong style="color:var(--accent-emerald);">🤝 Acuerdo Alcanzado:</strong>
                    <p style="margin-top:4px;margin-bottom:8px;">${f.agreements}</p>
                    <strong style="font-size:0.78rem;color:var(--accent-sunflower-soft);">Acciones concretas de cuidado:</strong>
                    <div style="margin-top:6px;display:flex;flex-direction:column;gap:6px;">
                        ${f.repairActions.map((act, i) => `
                            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.82rem;">
                                <input type="checkbox" class="toggle-repair-action" data-action-idx="${i}" ${act.done ? 'checked' : ''}>
                                <span style="${act.done ? 'text-decoration:line-through;color:var(--text-secondary);' : ''}">${act.text}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="margin-bottom:12px;">
                    <label style="font-size:0.76rem;color:var(--text-secondary);display:block;margin-bottom:4px;">
                        ✍️ Añadir reflexión o proponer acción como <strong>${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'}</strong>:
                    </label>
                    <div style="display:flex;gap:6px;">
                        <input type="text" id="new-reflection-input" placeholder="Escribe cómo te sientes hoy o un avance..." style="flex:1;background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.83rem;">
                        <button type="button" class="pill-action-btn" id="btn-add-reflection">Guardar</button>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                    <button type="button" class="pill-action-btn" id="btn-water-flower" style="justify-content:center;">
                        💧 Regar Girasol (${f.waterCount})
                    </button>
                    <button type="button" class="pill-action-btn" id="btn-toggle-agree" style="justify-content:center;border-color:var(--border-gold);color:var(--accent-sunflower-soft);">
                        ${(this.activeAuthor === 'kevin' ? f.kevinResolved : f.analyResolved) ? '✅ Mi acuerdo confirmado' : '🤝 Confirmar resolución'}
                    </button>
                </div>

                <div style="font-size:0.76rem;text-align:center;color:${isBothAgreed ? 'var(--accent-emerald)' : 'var(--text-secondary)'};margin-bottom:10px;">
                    ${isBothAgreed
                        ? '🌻 Ambos han confirmado que este girasol está en acuerdo mutuo.'
                        : 'ℹ️ Un problema solo se marca como resuelto cuando tanto Kevin como Analy confirman su acuerdo.'}
                </div>

                <div style="border-top:1px solid var(--border-subtle);padding-top:8px;font-size:0.76rem;color:var(--text-secondary);">
                    <strong>📜 Historial de cuidado (Sincronizado en tiempo real):</strong>
                    <ul style="margin-top:4px;padding-left:18px;">
                        ${f.history.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('[data-user]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeAuthor = btn.dataset.user;
                localStorage.setItem('our_garden_active_user', this.activeAuthor);
                this.render();
                this.bindEvents();
            });
        });

        this.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterStage = btn.dataset.filter;
                this.render();
                this.bindEvents();
            });
        });

        const btnNew = this.querySelector('#btn-new-sunflower');
        const formBox = this.querySelector('#new-sunflower-form-box');
        btnNew?.addEventListener('click', () => {
            formBox.style.display = formBox.style.display === 'none' ? 'block' : 'none';
        });

        this.querySelector('#cancel-new-sunflower')?.addEventListener('click', () => {
            formBox.style.display = 'none';
        });

        this.querySelector('#save-new-sunflower')?.addEventListener('click', () => {
            const title = this.querySelector('#nf-title')?.value.trim();
            const desc = this.querySelector('#nf-desc')?.value.trim();
            const persp = this.querySelector('#nf-perspective')?.value.trim();
            const agree = this.querySelector('#nf-agreement')?.value.trim();
            if (!title) return;

            const today = new Date().toISOString().split('T')[0];
            const newFlower = {
                id: 'girasol-' + Date.now(),
                stage: `Etapa ${this.sunflowers.length + 1} • Nuevo Brote`,
                title,
                date: today,
                description: desc || 'Experiencia registrada para diálogo en pareja.',
                kevinPerspective: this.activeAuthor === 'kevin' ? (persp || 'Pendiente de escribir.') : 'Pendiente de escribir por Kevin.',
                analyPerspective: this.activeAuthor === 'analy' ? (persp || 'Pendiente de escribir.') : 'Pendiente de escribir por Analy.',
                kevinEmotions: 'Escucha activa y apertura.',
                analyEmotions: 'Escucha activa y validación.',
                psychInsight: 'Hablar a tiempo desde lo que cada uno necesita fortalece la raíz de la relación.',
                agreements: agree || 'En construcción conjunta.',
                repairActions: agree ? [{ id: 'act-1', text: agree, done: false }] : [],
                waterCount: 1,
                kevinResolved: false,
                analyResolved: false,
                status: 'En crecimiento',
                history: [`${today}: Girasol sembrado por ${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'}.`]
            };

            this.sunflowers.unshift(newFlower);
            this.saveData();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('[data-open-flower]').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedId = card.dataset.openFlower;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#close-flower-modal')?.addEventListener('click', () => {
            this.selectedId = null;
            this.render();
            this.bindEvents();
        });

        const selectedFlower = this.sunflowers.find(f => f.id === this.selectedId);
        if (selectedFlower) {
            this.querySelectorAll('.toggle-repair-action').forEach(chk => {
                chk.addEventListener('change', () => {
                    const idx = Number(chk.dataset.actionIdx);
                    selectedFlower.repairActions[idx].done = chk.checked;
                    selectedFlower.history.unshift(`${new Date().toLocaleDateString('es-MX')}: Acción "${selectedFlower.repairActions[idx].text}" marcada por ${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'}.`);
                    this.saveData();
                    this.render();
                    this.bindEvents();
                });
            });

            this.querySelector('#btn-water-flower')?.addEventListener('click', () => {
                selectedFlower.waterCount = (selectedFlower.waterCount || 0) + 1;
                selectedFlower.history.unshift(`${new Date().toLocaleDateString('es-MX')}: 💧 Girasol regado con cariño por ${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'}.`);
                this.saveData();
                this.render();
                this.bindEvents();
            });

            this.querySelector('#btn-toggle-agree')?.addEventListener('click', () => {
                if (this.activeAuthor === 'kevin') {
                    selectedFlower.kevinResolved = !selectedFlower.kevinResolved;
                } else {
                    selectedFlower.analyResolved = !selectedFlower.analyResolved;
                }
                selectedFlower.history.unshift(`${new Date().toLocaleDateString('es-MX')}: 🤝 ${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'} actualizó su confirmación de acuerdo.`);
                this.saveData();
                this.render();
                this.bindEvents();
            });

            this.querySelector('#btn-add-reflection')?.addEventListener('click', () => {
                const input = this.querySelector('#new-reflection-input');
                const val = input?.value.trim();
                if (!val) return;
                if (this.activeAuthor === 'kevin') {
                    selectedFlower.kevinPerspective += ` | Actualización: ${val}`;
                } else {
                    selectedFlower.analyPerspective += ` | Actualización: ${val}`;
                }
                selectedFlower.history.unshift(`${new Date().toLocaleDateString('es-MX')}: ✍️ Reflexión añadida por ${this.activeAuthor === 'kevin' ? 'Kevin' : 'Analy'}: "${val}"`);
                this.saveData();
                this.render();
                this.bindEvents();
            });
        }
    }
}

customElements.define('garden-view', GardenView);