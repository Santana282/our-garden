const INITIAL_KIT_ITEMS = [
    {
        id: 'kit-1',
        category: 'Señal de Pausa 🌻',
        forWhom: 'Ambos',
        title: 'Protocolo de las 12:00 AM y Señal del Girasol',
        message: 'Si pasa de medianoche o sentimos que el cerebro ya no cerebra durante una discusión, enviamos un 🌻. Significa: "Te amo, no eres mi enemigo, dormimos juntos en paz y mañana con mente fresca nos escuchamos".'
    },
    {
        id: 'kit-2',
        category: 'Para Analy 👩🏻‍🍳',
        forWhom: 'Analy',
        title: 'Cuando dudes de tu cuerpo o de cuánto me gustas',
        message: 'Recuerda nuestro fin de semana en Orizaba: me encantas exactamente como eres, me fascina estar contigo y para mí eres la mujer más hermosa. Nunca tienes que pedir perdón por tu cuerpo.'
    },
    {
        id: 'kit-3',
        category: 'Para Kevin 💻',
        forWhom: 'Kevin',
        title: 'Cuando sientas que te hundes o que tu mirada aleja',
        message: 'Como te dijo Analy el 30 de octubre: es nuestra primera vez siendo humanos y todos tenemos luz. Con ella no tienes que fingir; ella conoce al hombre noble y leal que eres por dentro.'
    },
    {
        id: 'kit-4',
        category: 'Receta de Cuidado 🍋',
        forWhom: 'Ambos',
        title: 'Hidratación y Apapacho Físico',
        message: 'Agua fresca con un toque de limón, miel y Tajín para recuperar electrolitos, tomar el Omeprazol a tiempo, ponerse las gotitas en los ojos y descansar.'
    }
];

export class BotiquinView extends HTMLElement {
    constructor() {
        super();
        this.items = JSON.parse(localStorage.getItem('our_garden_botiquin_v1')) || INITIAL_KIT_ITEMS;
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
    }

    render() {
        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:8px;">
                <h1 class="hero-title" style="font-size:1.75rem;">🛠️ Botiquín de Cuidado Emocional</h1>
                <p class="hero-subtitle">
                    Mensajes de contención, recordatorios de amor y herramientas de calma para cuando alguno tenga un día pesado.
                </p>
            </section>

            <!-- Botón de Emergencia Afectiva (Señal Girasol) -->
            <div class="stage-card" style="text-align:center;border-color:var(--border-gold);margin-bottom:16px;">
                <div style="font-size:2.4rem;margin-bottom:6px;">🌻</div>
                <h3 style="color:var(--accent-sunflower);margin-bottom:6px;">Activar Señal de Calma y Apapacho</h3>
                <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:12px;">
                    Copia un mensaje afectivo inmediato para cortar cualquier tensión o recordar cuánto nos importamos.
                </p>
                <button type="button" class="pill-action-btn" id="btn-copy-peace-signal" style="margin:0 auto;">
                    🌻 Copiar Mensaje de Paz Afectiva
                </button>
                <div id="peace-copied-feedback" style="font-size:0.78rem;color:var(--accent-emerald);margin-top:8px;display:none;">
                    ✅ Mensaje copiado al portapapeles. Listo para pegar en nuestro chat.
                </div>
            </div>

            <!-- Cápsulas de Apoyo -->
            <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:16px;">
                ${this.items.map(item => `
                    <div class="stage-card" style="margin-top:0;">
                        <span style="font-size:0.72rem;color:var(--accent-rose);font-weight:700;text-transform:uppercase;">${item.category} • Para ${item.forWhom}</span>
                        <h3 style="color:var(--accent-sunflower-soft);font-size:1rem;margin:4px 0 6px;">${item.title}</h3>
                        <p style="font-size:0.86rem;color:var(--text-primary);line-height:1.55;">${item.message}</p>
                    </div>
                `).join('')}
            </div>

            <!-- Agregar nueva cápsula al Botiquín -->
            <div class="stage-card">
                <h3 style="color:var(--accent-sky);font-size:0.96rem;margin-bottom:10px;">➕ Guardar nuevo mensaje de apoyo en el Botiquín</h3>
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <input type="text" id="kit-title" placeholder="Título del recordatorio (ej. Para días de exámenes)" style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.84rem;">
                    <textarea id="kit-msg" rows="2" placeholder="Mensaje reconfortante..." style="background:#060a17;border:1px solid var(--border-subtle);padding:8px 10px;border-radius:10px;font-size:0.84rem;"></textarea>
                    <button type="button" class="pill-action-btn" id="btn-save-kit" style="align-self:flex-end;">💖 Guardar en Botiquín</button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.querySelector('#btn-copy-peace-signal')?.addEventListener('click', () => {
            const text = '🌻 Mi amor, activo nuestra señal del girasol: antes que cualquier debate o estrés, mi prioridad eres tú y estar bien juntos. Te amo, respiremos tantito y abracémonos.';
            navigator.clipboard?.writeText(text);
            const fb = this.querySelector('#peace-copied-feedback');
            if (fb) fb.style.display = 'block';
        });

        this.querySelector('#btn-save-kit')?.addEventListener('click', () => {
            const title = this.querySelector('#kit-title')?.value.trim();
            const message = this.querySelector('#kit-msg')?.value.trim();
            if (!title || !message) return;

            this.items.unshift({
                id: 'kit-' + Date.now(),
                category: 'Cápsula Personalizada 💖',
                forWhom: 'Ambos',
                title,
                message
            });
            localStorage.setItem('our_garden_botiquin_v1', JSON.stringify(this.items));
            this.render();
            this.bindEvents();
        });
    }
}

customElements.define('botiquin-view', BotiquinView);