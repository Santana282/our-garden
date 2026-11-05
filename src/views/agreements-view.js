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
        description: 'Elegir nuestro futuro lugar para vivir en común acuerdo, cuidando el bienestar laboral, el clima y la cercanía familiar.',
        createdAt: '2026-10-27',
        responsible: 'Kevin y Analy',
        status: 'Pendiente',
        reviewDate: '2027-07-22',
        history: ['27/10/2026: Conversado durante el regreso de Orizaba a Atlixco.']
    }
];

export class AgreementsView extends HTMLElement {
    constructor() {
        super();
        this.agreements = JSON.parse(localStorage.getItem('our_garden_agreements_v1')) || INITIAL_AGREEMENTS;
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    saveAgreements() {
        localStorage.setItem('our_garden_agreements_v1', JSON.stringify(this.agreements));
    }

    render() {
        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">🤝 Nuestros Acuerdos Explícitos</h1>
                <p class="hero-subtitle">
                    Compromisos construidos entre los dos para comprendernos mejor, sin presiones ni calificaciones.
                </p>
            </section>

            <!-- Nuevo Acuerdo -->
            <div class="stage-card" style="margin-bottom:16px;">
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

            <!-- Lista de Acuerdos -->
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
            this.saveAgreements();
            this.render();
            this.bindEvents();
        });

        this.querySelectorAll('.change-agr-status').forEach(sel => {
            sel.addEventListener('change', (e) => {
                const idx = Number(sel.dataset.idx);
                const newStatus = e.target.value;
                this.agreements[idx].status = newStatus;
                this.agreements[idx].history.unshift(`${new Date().toLocaleDateString('es-MX')}: Estado actualizado a "${newStatus}".`);
                this.saveAgreements();
                this.render();
                this.bindEvents();
            });
        });
    }
}

customElements.define('agreements-view', AgreementsView);