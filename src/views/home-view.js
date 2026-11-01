const ELEMENTS_INFO = {
    sun: {
        icon: '☀️',
        title: 'El Sol: Tu Luz y Calor',
        body: 'Representa tu ternura y calidez cuando me dices "Ánimo mi inge". Recuerda nuestro compromiso central: priorizar siempre la validación afectiva antes de cualquier barrera logística.'
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
                wateredByKevin: false,
                wateredByAnaly: false
            },
            {
                id: 'l2',
                title: '2. Miedo a no ser prioridad o ser ocultada',
                kevinView: 'Mi aislamiento defensivo cuando me saturo de estrés hace parecer que pongo muros lógicos.',
                analyView: 'Necesidad de validación afectiva presente, certeza de prioridad y atención cálida sin evasivas.',
                action: 'Expresar en un mensaje corto cuando haya cansancio emocional en vez de desaparecer en silencio.',
                wateredByKevin: false,
                wateredByAnaly: false
            }
        ]
    }
];

export class HomeView extends HTMLElement {
    constructor() {
        super();
        this.uptimeTimer = null;
        this.stages = JSON.parse(localStorage.getItem('jardin_stages_v1')) || INITIAL_STAGES;
    }

    connectedCallback() {
        this.render();
        this.startUptimeCounter();
        this.bindEvents();
    }

    disconnectedCallback() {
        if (this.uptimeTimer) clearInterval(this.uptimeTimer);
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
        const pct = Math.min(100, Math.round(10 + (completed / totalActions) * 90));
        return { pct, completed, totalActions };
    }

    render() {
        const vit = this.calculateVitality();
        const currentStage = this.stages[0];

        this.innerHTML = `
            <section class="hero-section">
                <h1 class="hero-title">Nuestro Ecosistema</h1>
                <p class="hero-subtitle">
                    Un jardín vivo sincronizado con nuestro cielo, tu ciclo, tus gustos y nuestras soluciones en el presente.
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
                    <span class="card-label">🎃 PRÓXIMO ENCUENTRO</span>
                    <div class="card-value rose">Presente<br>Activo 🎃</div>
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

            <!-- Tarjeta Interactiva de Etapa del Girasol -->
            <div class="stage-card">
                <div class="stage-title">
                    <span>🌻</span>
                    <span>${currentStage.title}</span>
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

            <!-- Modal para Elementos y Hojas del Girasol -->
            <div class="eco-modal-backdrop" id="home-modal">
                <div class="eco-modal-box" id="home-modal-content"></div>
            </div>
        `;
    }

    bindEvents() {
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