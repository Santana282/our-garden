const DEFAULT_CYCLE_DATA = {
    lastPeriodStart: '2026-10-18',
    lastPeriodEnd: '2026-10-23',
    cycleLength: 28,
    periodDuration: 5,
    privacyHideDetailsFromPartner: false,
    symptomsLog: [
        { date: '2026-10-19', symptoms: ['Cólicos leves', 'Antojo de algo dulce / postres'], note: 'Descansar calientita con cobijita.' }
    ],
    careReminders: [
        'Prepararle té calientito o su bebida hidratante con limón y miel.',
        'Cero discusiones pesadas de madrugada: priorizar apapacho, escucha y paciencia.',
        'Tener listos sus antojos favoritos o invitarle una copa de Merlot cuando se sienta con ánimo.'
    ]
};

export class DaysView extends HTMLElement {
    constructor() {
        super();
        this.cycleData = JSON.parse(localStorage.getItem('our_garden_cycle_v1')) || DEFAULT_CYCLE_DATA;
        this.activeViewer = localStorage.getItem('our_garden_active_user') || 'analy';
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    saveCycle() {
        localStorage.setItem('our_garden_cycle_v1', JSON.stringify(this.cycleData));
    }

    calculateCyclePredictions() {
        const start = new Date(this.cycleData.lastPeriodStart + 'T00:00:00');
        const today = new Date();
        const cycleLen = Number(this.cycleData.cycleLength) || 28;

        const diffDays = Math.floor((today - start) / 86400000);
        const currentDayInCycle = ((diffDays % cycleLen) + cycleLen) % cycleLen + 1;

        const nextStart = new Date(start);
        const cyclesPassed = Math.max(1, Math.ceil((diffDays + 1) / cycleLen));
        nextStart.setDate(start.getDate() + cyclesPassed * cycleLen);

        const daysUntilNext = Math.max(0, Math.ceil((nextStart - today) / 86400000));

        let phaseName = 'Fase Folicular 🌱 (Energía en renovación)';
        let phaseAdvice = 'Días ideales para planear proyectos, cocinar postres nuevos y disfrutar paseos tranquilos.';

        if (currentDayInCycle <= (this.cycleData.periodDuration || 5)) {
            phaseName = 'Fase Menstrual 🌙 (Días de descanso y apapacho)';
            phaseAdvice = 'Priorizar calorcito, descanso, comprensión total y cero estrés externo.';
        } else if (currentDayInCycle >= 12 && currentDayInCycle <= 16) {
            phaseName = 'Fase Ovulatoria ✨ (Plenitud y vitalidad alta)';
            phaseAdvice = 'Momento de alta energía, conexión afectiva y creatividad gastronómica.';
        } else if (currentDayInCycle > 16) {
            phaseName = 'Fase Lútea 🍂 (Sensibilidad y cuidado)';
            phaseAdvice = 'Aumentar la validación afectiva, escuchar sin debatir y consentir sus antojos.';
        }

        return {
            currentDayInCycle,
            nextDateFormatted: nextStart.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
            daysUntilNext,
            phaseName,
            phaseAdvice
        };
    }

    render() {
        const pred = this.calculateCyclePredictions();
        const isAnaly = this.activeViewer === 'analy';
        const restrictForKevin = !isAnaly && this.cycleData.privacyHideDetailsFromPartner;

        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">🌙 Tus Días • Calendario y Cuidado</h1>
                <p class="hero-subtitle">
                    Espacio personal de Analy para el seguimiento voluntario de su ciclo y recordatorios de apapacho.
                </p>
            </section>

            <!-- Selector de modo de visualización y privacidad -->
            <div class="glass-card" style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;text-align:left;">
                <div>
                    <span class="card-label">👤 CONSULTANDO COMO:</span>
                    <div style="display:flex;gap:6px;margin-top:4px;">
                        <button type="button" class="loc-chip ${isAnaly ? 'active' : ''}" data-viewer="analy">👩🏻‍🍳 Analy (Autorizada para editar)</button>
                        <button type="button" class="loc-chip ${!isAnaly ? 'active' : ''}" data-viewer="kevin">💻 Kevin (Modo Compañero)</button>
                    </div>
                </div>
                <div style="font-size:0.75rem;color:var(--accent-sunflower-soft);">
                    🔒 Control exclusivo de Analy
                </div>
            </div>

            <!-- Aviso ético y médico obligatorio -->
            <div style="background:rgba(56,189,248,0.1);border:1px solid var(--border-cyan);padding:10px 12px;border-radius:12px;font-size:0.78rem;color:var(--text-secondary);margin-bottom:14px;">
                ℹ️ <strong>Nota importante:</strong> Los cálculos mostrados son estimaciones orientativas basadas únicamente en las fechas registradas voluntariamente por Analy y pueden variar. No representan diagnósticos médicos.
            </div>

            ${restrictForKevin ? `
                <!-- Vista reducida cuando Analy activa privacidad de detalles -->
                <div class="stage-card" style="text-align:center;">
                    <div style="font-size:2.6rem;margin-bottom:8px;">💝</div>
                    <h3 style="color:var(--accent-rose);margin-bottom:8px;">Modo de Privacidad Activo</h3>
                    <p style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:14px;">
                        Analy eligió mostrar únicamente los recordatorios generales de cuidado para estos días:
                    </p>
                    <div style="text-align:left;background:rgba(255,255,255,0.04);padding:12px;border-radius:12px;font-size:0.85rem;">
                        <ul style="padding-left:18px;display:flex;flex-direction:column;gap:8px;">
                            ${this.cycleData.careReminders.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            ` : `
                <!-- Tarjetas de Resumen del Ciclo -->
                <div class="cards-grid-3">
                    <div class="glass-card">
                        <span class="card-label">🌸 DÍA DEL CICLO</span>
                        <div class="card-value rose">Día ${pred.currentDayInCycle}</div>
                        <span style="font-size:0.68rem;color:var(--text-secondary);">de ~${this.cycleData.cycleLength} días</span>
                    </div>
                    <div class="glass-card">
                        <span class="card-label">📅 PRÓXIMA FECHA EST.</span>
                        <div class="card-value" style="font-size:0.82rem;color:var(--accent-sunflower-soft);">${pred.nextDateFormatted}</div>
                        <span style="font-size:0.68rem;color:var(--text-secondary);">En ~${pred.daysUntilNext} días</span>
                    </div>
                    <div class="glass-card">
                        <span class="card-label">⏳ DURACIÓN MEDIA</span>
                        <div class="card-value emerald">${this.cycleData.periodDuration} días</div>
                        <span style="font-size:0.68rem;color:var(--text-secondary);">Inicio: ${this.cycleData.lastPeriodStart}</span>
                    </div>
                </div>

                <!-- Fase Actual y Recomendación de Cuidado -->
                <div class="stage-card" style="margin-top:12px;">
                    <div class="stage-title">${pred.phaseName}</div>
                    <p style="font-size:0.86rem;color:var(--text-primary);margin-bottom:12px;">${pred.phaseAdvice}</p>
                    <div style="background:rgba(244,114,182,0.1);border-left:3px solid var(--accent-rose);padding:10px;border-radius:8px;font-size:0.82rem;">
                        <strong style="color:var(--accent-rose);">🌷 Recordatorios de apapacho para Kevin:</strong>
                        <ul style="margin-top:6px;padding-left:18px;display:flex;flex-direction:column;gap:4px;">
                            ${this.cycleData.careReminders.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Panel exclusivo de edición para Analy -->
                ${isAnaly ? `
                    <div class="stage-card" style="border-color:var(--border-pink);">
                        <h3 style="color:var(--accent-rose);font-size:1rem;margin-bottom:10px;">👩🏻‍🍳 Panel Personal de Analy (Edición y Privacidad)</h3>
                        
                        <label style="display:flex;align-items:center;gap:8px;font-size:0.83rem;margin-bottom:12px;cursor:pointer;background:rgba(255,255,255,0.04);padding:10px;border-radius:10px;">
                            <input type="checkbox" id="chk-cycle-privacy" ${this.cycleData.privacyHideDetailsFromPartner ? 'checked' : ''}>
                            <span>Ocultar fechas/síntomas a Kevin y mostrarle únicamente recordatorios generales de cuidado.</span>
                        </label>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
                            <div>
                                <label style="font-size:0.75rem;color:var(--text-secondary);">Fecha de inicio del periodo:</label>
                                <input type="date" id="inp-period-start" value="${this.cycleData.lastPeriodStart}" style="width:100%;background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:8px;margin-top:4px;">
                            </div>
                            <div>
                                <label style="font-size:0.75rem;color:var(--text-secondary);">Fecha de finalización:</label>
                                <input type="date" id="inp-period-end" value="${this.cycleData.lastPeriodEnd}" style="width:100%;background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:8px;margin-top:4px;">
                            </div>
                        </div>

                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">
                            <div>
                                <label style="font-size:0.75rem;color:var(--text-secondary);">Duración del ciclo (días):</label>
                                <input type="number" id="inp-cycle-len" min="20" max="45" value="${this.cycleData.cycleLength}" style="width:100%;background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:8px;margin-top:4px;">
                            </div>
                            <div>
                                <label style="font-size:0.75rem;color:var(--text-secondary);">Días de periodo:</label>
                                <input type="number" id="inp-period-dur" min="2" max="10" value="${this.cycleData.periodDuration}" style="width:100%;background:#060a17;border:1px solid var(--border-subtle);padding:8px;border-radius:8px;margin-top:4px;">
                            </div>
                        </div>

                        <button type="button" class="pill-action-btn" id="btn-save-cycle-dates" style="width:100%;justify-content:center;margin-bottom:14px;">
                            💾 Actualizar Fechas y Cálculo
                        </button>

                        <!-- Registro voluntario de síntomas o notas -->
                        <div style="border-top:1px solid var(--border-subtle);padding-top:12px;">
                            <strong style="font-size:0.84rem;color:var(--accent-sunflower-soft);">📝 Registrar síntoma, antojo o nota de hoy:</strong>
                            <div style="display:flex;gap:6px;margin-top:8px;">
                                <input type="text" id="inp-symptom-note" placeholder="Ej. Cólicos leves, antojo de fresas o descansar..." style="flex:1;background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:8px;font-size:0.83rem;">
                                <button type="button" class="pill-action-btn" id="btn-add-symptom">Añadir</button>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Bitácora de síntomas y notas registradas -->
                <div class="stage-card">
                    <div class="stage-title">📋 Bitácora de Síntomas y Notas de Cuidado</div>
                    ${this.cycleData.symptomsLog.map(item => `
                        <div class="stage-item" style="cursor:default;">
                            <div style="font-size:0.75rem;color:var(--accent-sky);font-weight:700;">${item.date}</div>
                            <div style="font-size:0.86rem;margin-top:2px;">${item.symptoms.join(' • ')}</div>
                            ${item.note ? `<div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">Nota: ${item.note}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            `}
        `;
    }

    bindEvents() {
        this.querySelectorAll('[data-viewer]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeViewer = btn.dataset.viewer;
                localStorage.setItem('our_garden_active_user', this.activeViewer);
                this.render();
                this.bindEvents();
            });
        });

        this.querySelector('#chk-cycle-privacy')?.addEventListener('change', (e) => {
            this.cycleData.privacyHideDetailsFromPartner = e.target.checked;
            this.saveCycle();
        });

        this.querySelector('#btn-save-cycle-dates')?.addEventListener('click', () => {
            const start = this.querySelector('#inp-period-start')?.value;
            const end = this.querySelector('#inp-period-end')?.value;
            const len = Number(this.querySelector('#inp-cycle-len')?.value) || 28;
            const dur = Number(this.querySelector('#inp-period-dur')?.value) || 5;

            if (start) this.cycleData.lastPeriodStart = start;
            if (end) this.cycleData.lastPeriodEnd = end;
            this.cycleData.cycleLength = len;
            this.cycleData.periodDuration = dur;

            this.saveCycle();
            this.render();
            this.bindEvents();
        });

        this.querySelector('#btn-add-symptom')?.addEventListener('click', () => {
            const inp = this.querySelector('#inp-symptom-note');
            const val = inp?.value.trim();
            if (!val) return;
            const today = new Date().toISOString().split('T')[0];
            this.cycleData.symptomsLog.unshift({
                date: today,
                symptoms: [val],
                note: 'Registrado voluntariamente por Analy'
            });
            this.saveCycle();
            this.render();
            this.bindEvents();
        });
    }
}

customElements.define('days-view', DaysView);