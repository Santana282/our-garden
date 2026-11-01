export class BottomNav extends HTMLElement {
    connectedCallback() {
        this.render();
        window.addEventListener('hashchange', () => this.highlightActive());
        this.highlightActive();
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
                    <span>Diarios</span>
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

    highlightActive() {
        const currentHash = window.location.hash || '#/';
        this.querySelectorAll('.nav-item').forEach(link => {
            const route = link.getAttribute('data-route');
            const isHomeOrGarden = (currentHash === '#/' || currentHash === '#/jardin') && route === '#/';
            link.classList.toggle('active', currentHash === route || isHomeOrGarden);
        });
    }
}

customElements.define('bottom-nav', BottomNav);