import { syncEngine } from '../core/sync.js';

const INITIAL_AGREEMENTS = [
    {
        id: 'agr-1',
        description: 'Priorizar la validación afectiva y el apapacho presente antes de debatir barreras logísticas o problemas futuros.',
        createdAt: '2026-09-27',
        responsible: 'Kevin y Analy',
        status: 'Cumplido',
        reviewDate: '2026-11-22',
        history: ['27/09/2026: Creado como principio rector de Nuestro Jardín.']
    },
    {
        id: 'agr-2',
        description: 'Avisar con cariño antes de iniciar partidas de COD o entrar en enfoque de trabajo/código para que ninguno sienta silencio frío.',
        createdAt: '2026-10-14',
        responsible: 'Kevin',
        status: 'Revisado',
        reviewDate: '2026-11-22',
        history: ['14/10/2026: Acordado tras charlar sobre nuestras partidas en dúo y escuadra.']
    },
    {
        id: 'agr-3',
        description: 'Planear juntos con anticipación nuestros encuentros presenciales (Diciembre en CDMX/Pachuca y Verano en Puebla).',
        createdAt: '2026-10-26',
        responsible: 'Kevin y Analy',
        status: 'Cumplido',
        reviewDate: '2026-12-15',
        history: ['26/10/2026: Acordado después del primer encuentro en Orizaba.']
    },
    {
        id: 'agr-4',
        description: 'Elegir nuestro futuro lugar para vivir en común acuerdo, cuidando el bienestar laboral, el clima fresco y la cercanía familiar.',
        createdAt: '2026-10-27',
        responsible: 'Kevin y Analy',
        status: 'Pendiente',
        reviewDate: '2027-07-22',
        history: ['27/10/2026: Conversado durante el regreso de Orizaba a Atlixco.']
    }
];

const INITIAL_GOALS = [
    {
        id: 'goal-1',
        category: 'Familia & Vínculo 💖',
        title: 'Conocer formalmente a la familia de Analy este año',
        proposedBy: 'Analy',
        done: false
    },
    {
        id: 'goal-2',
        category: 'Proyectos & Carrera 🚀',
        title: 'Que despeguen con éxito nuestros proyectos (Tecnología/IA y Postres/Gastronomía)',
        proposedBy: 'Kevin y Analy',
        done: false
    },
    {
        id: 'goal-3',
        category: 'Fondo Compartido 💳',
        title: 'Ahorrar juntos en nuestra cuenta de Revolut para nuestro patrimonio y emergencias',
        proposedBy: 'Kevin y Analy',
        done: true
    },
    {
        id: 'goal-4',
        category: 'Pinky Promise 💍',
        title: 'Casarnos por el civil acabando la uni (nuestro domingo de bodorrio)',
        proposedBy: 'Kevin y Analy',
        done: false
    },
    {
        id: 'goal-5',
        category: 'Nuestro Hogar 🏡',
        title: 'Empezar con nuestro hogar básico sin pagar renta para ahorrar rumbo a otra casa',
        proposedBy: 'Kevin y Analy',
        done: false
    },
    {
        id: 'goal-6',
        category: 'Básicos del Hogar 🛏️',
        title: 'Primeros básicos: Una almohada, cobijas calientitas y nuestro colchón',
        proposedBy: 'Analy',
        done: false
    },
    {
        id: 'goal-7',
        category: 'Básicos del Hogar 🍳',
        title: 'Equipamiento inicial: Refri, estufa, lavadora chica, plancha, trastes y despensa básica',
        proposedBy: 'Kevin',
        done: false
    }
];

export class AgreementsView extends HTMLElement {
    constructor() {
        super();
        this.agreements = JSON.parse(localStorage.getItem('our_garden_agreements_v1')) || INITIAL_AGREEMENTS;
        this.goals = JSON.parse(localStorage.getItem('our_garden_goals_v1')) || INITIAL_GOALS;
        this.activeTab = 'goals'; // 'goals' | 'agreements'
        this.boundRemotePull = () => {
            this.agreements = JSON.parse(localStorage.getItem('our_garden_agreements_v1')) || INITIAL_AGREEMENTS;
            this.goals = JSON.parse(localStorage.getItem('our_garden_goals_v1')) || INITIAL_GOALS;
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

    saveAll() {
        localStorage.setItem('our_garden_agreements_v1', JSON.stringify(this.agreements));
        localStorage.setItem('our_garden_goals_v1', JSON.stringify(this.goals));
        syncEngine.syncNow();
    }

    render() {
        const doneGoals = this.goals.filter(g => g.done).length;
        const pctGoals = this.goals.length ? Math.round((doneGoals / this.goals.length) * 100) : 0;

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">🤝 Acuerdos y Objetivos (Pinky Promise)</h1>
                <p class="hero-subtitle">
                    Nuestra lista actualizable de metas compartidas, avances del futuro hogar y acuerdos de cuidado.
                </p>
            </section>

            <!-- Selector entre Lista de Objetivos (25 Oct) y Acuerdos -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
                <button type="button" class="element-btn-card ${this.activeTab === 'goals' ? 'sun' : ''}" data-tab="goals">
                    <span class="card-label">🎯 PINKY PROMISE</span>
                    <div class="card-value" style="font-size:0.86rem;">Objetivos (${doneGoals}/${this.goals.length})</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeTab === 'agreements' ? 'earth' : ''}" data-tab="agreements">
                    <span class="card-label">🤝 COMPROMISOS</span>
                    <div class="card-value" style="font-size:0.86rem;">Acuerdos (${this.agreements.length})</div>
                </button>
            </div>

            ${this.activeTab === 'goals' ? this.renderGoalsTab(doneGoals, pctGoals) : this.renderAgreementsTab()}
        `;
    }

    renderGoalsTab(doneGoals, pctGoals) {
        return `
            <!-- Barra de Progreso de Objetivos -->
            <div class="glass-card" style="margin-bottom:14px;text-align:left;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:0.76rem;font-weight:800;color:var(--accent-sunflower);">
                        🏡 PROGRESO DE NUESTRAS METAS Y FUTURO HOGAR
                    </span>
                    <strong style="font-size:0.84rem;color:var(--accent-emerald);">${pctGoals}% (${doneGoals}/${this.goals.length})</strong>
                </div>
                <div style="width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;">
                    <div style="width:${pctGoals}%;height:100%;background:linear-gradient(90deg,var(--accent-sunflower),var(--accent-emerald));transition:width 0.3s ease;"></div>
                </div>
            </div>

            <!-- Formulario para añadir nuevo objetivo actualizable -->
            <div class="stage-card" style="margin-top:0;margin-bottom:14px;border-color:var(--border-gold);">
                <h3 style="color:var(--accent-sunflower);font-size:0.96rem;margin-bottom:8px;">➕ Agregar nuevo objetivo a nuestra lista</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="inp-goal-title" placeholder="Ej. Comprar nuestra cafetera, viaje a Puebla, mueble nuevo..." style="background:#060a17;border:1px solid var(--border-subtle);padding:9px 10px;border-radius:10px;font-size:0.84rem;">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <select id="inp-goal-cat" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:10px;font-size:0.82rem;">
                            <option value="Nuestro Hogar 🏡">Nuestro Hogar 🏡</option>
                            <option value="Básicos del Hogar 🛏️">Básicos del Hogar 🛏️</option>
                            <option value="Pinky Promise 💍">Pinky Promise 💍</option>
                            <option value="Proyectos & Carrera 🚀">Proyectos & Carrera 🚀</option>
                            <option value="Viajes & Citas 🍷">Viajes & Citas 🍷</option>
                        </select>
                        <select id="inp-goal-by" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:10px;font-size:0.82rem;">
                            <option value="Kevin y Analy">🤝 Kevin y Analy</option>
                            <option value="Analy">👩🏻‍🍳 Propuesto por Analy</option>
                            <option value="Kevin">💻 Propuesto por Kevin</option>
                        </select>
                    </div>
                    <button type="button" class="pill-action-btn" id="btn-add-goal" style="align-self:flex-end;">🎯 Añadir y Sincronizar</button>
                </div>
            </div>

            <!-- Checklist interactiva de Objetivos -->
            <div style="display:flex;flex-direction:column;gap:10px;">
                ${this.goals.map((g, idx) => `
                    <div class="stage-card" style="margin-top:0;padding:14px;border-color:${g.done ? 'var(--border-green)' : 'var(--border-subtle)'};">
                        <label style="display:flex;align-items:flex-start;gap:10px;cursor:pointer;">
                            <input type="checkbox" class="toggle-goal-chk" data-gidx="${idx}" ${g.done ? 'checked' : ''} style="margin-top:4px;transform:scale(1.25);">
                            <div style="flex:1;">
                                <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;">
                                    <span style="font-size:0.7rem;color:var(--accent-sky);font-weight:700;">${g.category} • ${g.proposedBy}</span>
                                    <span style="font-size:0.7rem;color:${g.done ? 'var(--accent-emerald)' : 'var(--text-secondary)'};font-weight:700;">
                                        ${g.done ? '✅ ¡Cumplido!' : '⏳ En camino'}
                                    </span>
                                </div>
                                <div style="font-size:0.9rem;margin-top:4px;${g.done ? 'text-decoration:line-through;color:var(--text-secondary);' : 'color:var(--text-primary);font-weight:700;'}">
                                    ${g.title}
                                </div>
                            </div>
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderAgreementsTab() {
        return `
            <div class="stage-card" style="margin-top:0;margin-bottom:16px;">
                <h3 style="color:var(--accent-sunflower);font-size:0.96rem;margin-bottom:10px;">➕ Registrar nuevo acuerdo de pareja</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <textarea id="agr-desc" rows="2" placeholder="Descripción clara del acuerdo..." style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.84rem;"></textarea>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                        <select id="agr-resp" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:10px;font-size:0.82rem;">
                            <option value="Kevin y Analy">🤝 Kevin y Analy</option>
                            <option value="Kevin">💻 Kevin</option>
                            <option value="Analy">👩🏻‍🍳 Analy</option>
                        </select>
                        <input type="date" id="agr-review" value="2026-11-22" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:10px;font-size:0.82rem;">
                    </div>
                    <button type="button" class="pill-action-btn" id="btn-add-agreement" style="align-self:flex-end;">🤝 Guardar Acuerdo</button>
                </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:12px;">
                ${this.agreements.map((agr, idx) => `
                    <div class="stage-card" style="margin-top:0;">
                        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;">
                            <span style="font-size:0.72rem;color:var(--accent-sky);font-weight:700;">
                                👤 ${agr.responsible} • Revisión: ${agr.reviewDate}
                            </span>
                            <select class="loc-chip active change-agr-status" data-idx="${idx}" style="background:#0b1124;">
                                <option value="Cumplido" ${agr.status === 'Cumplido' ? 'selected' : ''}>✅ Cumplido</option>
                                <option value="Revisado" ${agr.status === 'Revisado' ? 'selected' : ''}>🔄 Revisado</option>
                                <option value="Pendiente" ${agr.status === 'Pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
                            </select>
                        </div>
                        <p style="font-size:0.88rem;color:var(--text-primary);margin-bottom:8px;">${agr.description}</p>
                        <div style="font-size:0.74rem;color:var(--text-secondary);border-top:1px solid var(--border-subtle);padding-top:6px;">
                            <strong>Historial:</strong> ${agr.history[0] || ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    bindEvents() {
        this.querySelectorAll('[data-tab]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeTab = btn.dataset.tab;
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#btn-add-goal')?.addEventListener('click', () => {
            const title = this.querySelector('#inp-goal-title')?.value.trim();
            const category = this.querySelector('#inp-goal-cat')?.value || 'Nuestro Hogar 🏡';
            const proposedBy = this.querySelector('#inp-goal-by')?.value || 'Kevin y Analy';
            if (!title) return;

            this.goals.unshift({
                id: 'goal-' + Date.now(),
                category,
                title,
                proposedBy,
                done: false
            });
            this.saveAll();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('.toggle-goal-chk').forEach(chk => {
            chk.addEventListener('change', () => {
                const idx = Number(chk.dataset.gidx);
                if (this.goals[idx]) {
                    this.goals[idx].done = chk.checked;
                    this.saveAll();
                    this.render();
                    this.bindEvents();
                }
            });
        });

        this.querySelector('#btn-add-agreement')?.addEventListener('click', () => {
            const desc = this.querySelector('#agr-desc')?.value.trim();
            const resp = this.querySelector('#agr-resp')?.value || 'Kevin y Analy';
            const rev = this.querySelector('#agr-review')?.value || '2026-11-22';
            if (!desc) return;

            const today = new Date().toISOString().split('T')[0];
            this.agreements.unshift({
                id: 'agr-' + Date.now(),
                description: desc,
                createdAt: today,
                responsible: resp,
                status: 'Pendiente',
                reviewDate: rev,
                history: [`${today}: Acuerdo registrado.`]
            });
            this.saveAll();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('.change-agr-status').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = Number(sel.dataset.idx);
                const newStatus = e.target.value;
                this.agreements[idx].status = newStatus;
                this.agreements[idx].history.unshift(`${new Date().toLocaleDateString('es-MX')}: Estado actualizado a "${newStatus}".`);
                this.saveAll();
                this.render();
                this.bindEvents();
            });
        });
    }
}

customElements.define('agreements-view', AgreementsView);