export class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.cityMode = localStorage.getItem('jardin_city_mode') || 'dual';
        this.weatherLabel = 'Orizaba / Atlixco • Sincronizando...';
        this.musicPlaying = false;
        this.gyroActive = false;
        this.clockInterval = null;
    }

    connectedCallback() {
        this.render();
        this.startClock();
        this.fetchWeather();
        this.bindEvents();
    }

    disconnectedCallback() {
        if (this.clockInterval) clearInterval(this.clockInterval);
    }

    render() {
        this.innerHTML = `
            <header class="observatory-header">
                <div class="header-inner">
                    <div>
                        <button type="button" class="weather-pill" id="toggle-loc-bar" title="Cambiar ubicación de clima">
                            <span id="weather-icon">☀️</span>
                            <span id="weather-status-text">${this.weatherLabel}</span>
                        </button>
                        <div class="live-clock" id="header-live-clock">--:--:-- a.m.</div>
                        <div class="greeting-line" id="header-greeting-line">✨ Cargando ciclo solar...</div>
                    </div>

                    <div class="header-controls">
                        <button type="button" class="pill-action-btn" id="music-toggle-btn">
                            🎵 Música: OFF
                        </button>
                        <button type="button" class="pill-action-btn gyro-btn" id="gyro-toggle-btn">
                            🪐 Giroscopio: OFF
                        </button>
                    </div>
                </div>

                <!-- Controles de ubicación voluntaria -->
                <div class="location-bar" id="location-selector-bar" style="display:none;">
                    <button type="button" class="loc-chip ${this.cityMode === 'dual' ? 'active' : ''}" data-city="dual">🌄 Orizaba / Atlixco</button>
                    <button type="button" class="loc-chip ${this.cityMode === 'atlixco' ? 'active' : ''}" data-city="atlixco">🌸 Atlixco (Analy)</button>
                    <button type="button" class="loc-chip ${this.cityMode === 'orizaba' ? 'active' : ''}" data-city="orizaba">⛰️ Orizaba (Kevin)</button>
                    <button type="button" class="loc-chip ${this.cityMode === 'gps' ? 'active' : ''}" data-city="gps">📍 Mi GPS (Voluntario)</button>
                </div>

                <!-- Cajón de control de volumen y pista (YouTube PEM0Vs8jf1w) -->
                <div class="audio-drawer" id="audio-drawer-panel">
                    <span id="audio-track-status">🎶 Pista: Ambiente Espacial (YouTube)</span>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <label for="audio-vol-slider" style="font-size:0.72rem;">Vol:</label>
                        <input type="range" id="audio-vol-slider" min="0" max="100" value="60" style="width:80px;">
                    </div>
                </div>
            </header>
        `;
    }

    bindEvents() {
        const locToggle = this.querySelector('#toggle-loc-bar');
        const locBar = this.querySelector('#location-selector-bar');
        locToggle?.addEventListener('click', () => {
            locBar.style.display = locBar.style.display === 'none' ? 'flex' : 'none';
        });

        this.querySelectorAll('.loc-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                this.querySelectorAll('.loc-chip').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.cityMode = btn.dataset.city;
                localStorage.setItem('jardin_city_mode', this.cityMode);
                this.fetchWeather();
            });
        });

        const musicBtn = this.querySelector('#music-toggle-btn');
        const audioDrawer = this.querySelector('#audio-drawer-panel');
        musicBtn?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('ecosystem:toggle-music'));
            audioDrawer?.classList.toggle('open');
        });

        const volSlider = this.querySelector('#audio-vol-slider');
        volSlider?.addEventListener('input', (e) => {
            window.dispatchEvent(new CustomEvent('ecosystem:volume-change', { detail: Number(e.target.value) }));
        });

        const gyroBtn = this.querySelector('#gyro-toggle-btn');
        gyroBtn?.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('ecosystem:toggle-gyro'));
        });

        window.addEventListener('ecosystem:music-state', (e) => {
            this.musicPlaying = e.detail.playing;
            if (musicBtn) {
                musicBtn.textContent = this.musicPlaying ? '🎵 Música: ON' : '🎵 Música: OFF';
                musicBtn.classList.toggle('active', this.musicPlaying);
            }
        });

        window.addEventListener('ecosystem:gyro-state', (e) => {
            this.gyroActive = e.detail.active;
            if (gyroBtn) {
                gyroBtn.textContent = this.gyroActive ? '🪐 Giroscopio: ON' : '🪐 Giroscopio: OFF';
                gyroBtn.classList.toggle('active', this.gyroActive);
            }
        });
    }

    startClock() {
        const update = () => {
            const now = new Date();
            const rawHours = now.getHours(); // 0 - 23 (Hora real para evitar el bug de AM/PM)
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const ampm = rawHours >= 12 ? 'p.m.' : 'a.m.';
            const hours12 = rawHours % 12 || 12;

            const clockEl = this.querySelector('#header-live-clock');
            const greetEl = this.querySelector('#header-greeting-line');

            if (clockEl) {
                clockEl.textContent = `${hours12}:${minutes}:${seconds} ${ampm}`;
            }

            if (greetEl) {
                if (rawHours >= 6 && rawHours < 12) {
                    greetEl.textContent = '🌅 Mañana • Buenos días mi amor, que hoy todo compile bonito';
                } else if (rawHours >= 12 && rawHours < 19) {
                    greetEl.textContent = '☀️ Tarde • Pensando en ti en nuestro presente activo';
                } else if (rawHours >= 19 && rawHours < 22) {
                    greetEl.textContent = '🌇 Atardecer • Hora de bajar el ritmo y abrazarnos sin pretextos';
                } else {
                    greetEl.textContent = '🌙 Noche • Descansa mi amor, nos vemos en sueños';
                }
            }
        };
        update();
        this.clockInterval = setInterval(update, 1000);
    }

    async fetchWeather() {
        const statusEl = this.querySelector('#weather-status-text');
        const iconEl = this.querySelector('#weather-icon');
        if (!statusEl) return;

        statusEl.textContent = 'Consultando cielo...';

        const coords = {
            orizaba: { lat: 18.851, lon: -97.099, name: 'Orizaba' },
            atlixco: { lat: 18.909, lon: -98.432, name: 'Atlixco' }
        };

        try {
            if (this.cityMode === 'gps') {
                if (!navigator.geolocation) throw new Error('Sin soporte GPS');
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const data = await this.queryOpenMeteo(pos.coords.latitude, pos.coords.longitude);
                    statusEl.textContent = `Ubicación Local • ${data.temp}°C ${data.desc}`;
                    if (iconEl) iconEl.textContent = data.icon;
                }, () => {
                    statusEl.textContent = 'Permiso GPS denegado • Usando Atlixco/Orizaba';
                    this.cityMode = 'dual';
                    this.fetchWeather();
                }, { timeout: 7000 });
                return;
            }

            if (this.cityMode === 'atlixco' || this.cityMode === 'orizaba') {
                const c = coords[this.cityMode];
                const data = await this.queryOpenMeteo(c.lat, c.lon);
                statusEl.textContent = `${c.name} • ${data.temp}°C ${data.desc}`;
                if (iconEl) iconEl.textContent = data.icon;
            } else {
                const [ori, atl] = await Promise.all([
                    this.queryOpenMeteo(coords.orizaba.lat, coords.orizaba.lon),
                    this.queryOpenMeteo(coords.atlixco.lat, coords.atlixco.lon)
                ]);
                statusEl.textContent = `Orizaba ${ori.temp}°C / Atlixco ${atl.temp}°C • ${atl.desc}`;
                if (iconEl) iconEl.textContent = atl.icon;
            }
        } catch (err) {
            const cached = localStorage.getItem('jardin_last_weather') || 'Orizaba / Atlixco • Modo Offline';
            statusEl.textContent = cached;
        }
    }

    async queryOpenMeteo(lat, lon) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Error API Clima');
        const json = await res.json();
        const cw = json.current_weather;
        const temp = Math.round(cw.temperature);
        const code = cw.weathercode;

        let desc = 'Despejado';
        let icon = '☀️';
        if (code >= 1 && code <= 3) { desc = 'Semi nublado'; icon = '⛅'; }
        else if (code >= 45 && code <= 48) { desc = 'Neblina'; icon = '🌫️'; }
        else if (code >= 51 && code <= 67) { desc = 'Lluvia ligera'; icon = '🌧️'; }
        else if (code >= 80) { desc = 'Tormenta'; icon = '⛈️'; }

        const summary = `Orizaba / Atlixco • ${temp}°C ${desc}`;
        localStorage.setItem('jardin_last_weather', summary);
        return { temp, desc, icon };
    }
}

customElements.define('app-header', AppHeader);