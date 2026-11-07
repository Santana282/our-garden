export class BottomNav extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('hashchange', () => this.highlightActive());
        this.highlightActive();
        this.bindPulseEvents();
    }

    render() {
        this.innerHTML = `
            <nav class="bottom-nav" aria-label="Navegación principal">
                <a href="#/" class="nav-item" data-route="#/">
                    <span class="nav-icon">🌻</span>
                    <span>Jardín</span>
                </a>
                <a href="#/tus-dias" class="nav-item" data-route="#/tus-dias">
                    <span class="nav-icon">🌙</span>
                    <span>Tus Días</span>
                </a>
                <a href="#/diario" class="nav-item" data-route="#/diario">
                    <span class="nav-icon">📖</span>
                    <span>Diario</span>
                </a>
                <a href="#/biblioteca" class="nav-item" data-route="#/biblioteca">
                    <span class="nav-icon">📚</span>
                    <span>Biblioteca</span>
                </a>
                <a href="#/arcade" class="nav-item" data-route="#/arcade">
                    <span class="nav-icon">👾</span>
                    <span>Arcade</span>
                </a>
                <a href="#/star-os" class="nav-item" data-route="#/star-os">
                    <span class="nav-icon">💻</span>
                    <span>Star-OS</span>
                </a>
                <a href="#/botiquin" class="nav-item" data-route="#/botiquin">
                    <span class="nav-icon">🛠️</span>
                    <span>Botiquín</span>
                </a>
                <a href="#/acuerdos" class="nav-item" data-route="#/acuerdos">
                    <span class="nav-icon">🤝</span>
                    <span>Acuerdos</span>
                </a>
            </nav>
        `;
    }

    bindPulseEvents() {
        this.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('pointerdown', (e) => {
                const rect = item.getBoundingClientRect();
                const originX = rect.left + rect.width / 2;
                const originY = rect.top + rect.height / 2;
                window.dispatchEvent(new CustomEvent('ecosystem:trigger-construction', {
                    detail: {
                        route: item.getAttribute('data-route'),
                        originX,
                        originY
                    }
                }));
            });
        });
    }

    highlightActive() {
        const currentHash = window.location.hash || '#/';
        this.querySelectorAll('.nav-item').forEach(link => {
            const route = link.getAttribute('data-route');
            const isHome = currentHash === '#/' && route === '#/';
            link.classList.toggle('active', currentHash === route || isHome);
        });
    }
}

customElements.define('bottom-nav', BottomNav);