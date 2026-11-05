export class ArcadeView extends HTMLElement {
    constructor() {
        super();
        this.activeGame = 'pacman'; // 'pacman' | 'pingpong' | 'tetris'
        this.rafId = null;
        this.gameInterval = null;
        this.isPaused = false;
        this.pongMode = '1p'; // '1p' | '2p'
        this.highScores = JSON.parse(localStorage.getItem('our_garden_arcade_scores_v1')) || {
            pacman: 0,
            pingpong: 0,
            tetris: 0
        };
        this.boundKeyDown = this.handleKeyDown.bind(this);
    }

    connectedCallback() {
        this.render();
        this.bindUIEvents();
        window.addEventListener('keydown', this.boundKeyDown);
        this.startSelectedGame();
    }

    disconnectedCallback() {
        this.stopActiveLoops();
        window.removeEventListener('keydown', this.boundKeyDown);
    }

    stopActiveLoops() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
    }

    saveHighScore(game, score) {
        if (score > (this.highScores[game] || 0)) {
            this.highScores[game] = score;
            localStorage.setItem('our_garden_arcade_scores_v1', JSON.stringify(this.highScores));
            const bestEl = this.querySelector('#arcade-best-val');
            if (bestEl) bestEl.textContent = this.highScores[game];
        }
    }

    render() {
        this.innerHTML = `
            <section class="hero-section" style="padding-bottom:6px;">
                <h1 class="hero-title" style="font-size:1.75rem;">👾 Arcade Retro • Kevin & Analy</h1>
                <p class="hero-subtitle">
                    Nuestro rincón para distraernos juntos: Caza de Antojos y Girasoles, Ping Pong y Tetris táctil.
                </p>
            </section>

            <!-- Selector de los 3 Videojuegos -->
            <div class="cards-grid-3" style="margin-bottom:12px;">
                <button type="button" class="element-btn-card ${this.activeGame === 'pacman' ? 'sun' : ''}" data-game="pacman">
                    <span class="card-label">👩🏻‍🍳 JUEGO 1</span>
                    <div class="card-value" style="font-size:0.84rem;">Pac-Man Chef</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeGame === 'pingpong' ? 'water' : ''}" data-game="pingpong">
                    <span class="card-label">🏓 JUEGO 2</span>
                    <div class="card-value" style="font-size:0.84rem;">Ping Pong</div>
                </button>
                <button type="button" class="element-btn-card ${this.activeGame === 'tetris' ? 'earth' : ''}" data-game="tetris">
                    <span class="card-label">🧱 JUEGO 3</span>
                    <div class="card-value" style="font-size:0.84rem;">Tetris</div>
                </button>
            </div>

            <!-- Marcador y Controles de Partida -->
            <div class="glass-card" style="padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div style="display:flex;gap:14px;align-items:center;font-size:0.84rem;">
                    <span>⭐ Puntos: <strong id="arcade-score-val" style="color:var(--accent-sunflower);">0</strong></span>
                    <span>🏆 Récord: <strong id="arcade-best-val" style="color:var(--accent-emerald);">${this.highScores[this.activeGame] || 0}</strong></span>
                    <span id="arcade-extra-stat" style="color:var(--accent-rose);font-weight:700;">❤️❤️❤️</span>
                </div>
                <div style="display:flex;gap:6px;">
                    ${this.activeGame === 'pingpong' ? `
                        <button type="button" class="loc-chip active" id="btn-pong-mode">
                            ${this.pongMode === '1p' ? '🤖 1J (vs IA)' : '👫 2J (Kevin vs Analy)'}
                        </button>
                    ` : ''}
                    <button type="button" class="loc-chip" id="btn-arcade-pause">⏸️ Pausa</button>
                    <button type="button" class="pill-action-btn" id="btn-arcade-restart" style="padding:4px 10px;font-size:0.74rem;">🔄 Reiniciar</button>
                </div>
            </div>

            <!-- Contenedor del Lienzo de Juego -->
            <div class="stage-card" style="margin-top:0;padding:12px;text-align:center;display:flex;flex-direction:column;align-items:center;">
                <div id="arcade-status-banner" style="font-size:0.82rem;color:var(--accent-sky);font-weight:700;margin-bottom:8px;min-height:1.2em;">
                    ¡Usa los botones táctiles o las flechas del teclado!
                </div>

                <canvas id="arcade-canvas" width="320" height="360" style="background:#03050c;border:2px solid var(--border-gold);border-radius:14px;max-width:100%;touch-action:none;box-shadow:0 8px 25px rgba(0,0,0,0.8);"></canvas>

                <!-- Controles Táctiles Universales Adaptados por Juego -->
                <div id="arcade-touch-controls" style="margin-top:14px;width:100%;max-width:300px;">
                    ${this.renderTouchControls()}
                </div>
            </div>
        `;
    }

    renderTouchControls() {
        if (this.activeGame === 'pingpong') {
            return `
                <div style="font-size:0.76rem;color:var(--text-secondary);margin-bottom:8px;">
                    💡 Desliza tu dedo directamente sobre la cancha o usa estos botones:
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                    <button type="button" class="pill-action-btn" data-dir="LEFT" style="justify-content:center;padding:12px;font-size:1rem;">⬅️ Mover Izquierda</button>
                    <button type="button" class="pill-action-btn" data-dir="RIGHT" style="justify-content:center;padding:12px;font-size:1rem;">Mover Derecha ➡️</button>
                </div>
            `;
        }

        if (this.activeGame === 'tetris') {
            return `
                <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;">
                    <button type="button" class="pill-action-btn" data-dir="LEFT" style="justify-content:center;padding:12px;font-size:1.05rem;">⬅️</button>
                    <button type="button" class="pill-action-btn" data-dir="ROTATE" style="justify-content:center;padding:12px;font-size:1.05rem;border-color:var(--border-gold);color:var(--accent-sunflower);">🔄 Girar</button>
                    <button type="button" class="pill-action-btn" data-dir="DOWN" style="justify-content:center;padding:12px;font-size:1.05rem;">⬇️</button>
                    <button type="button" class="pill-action-btn" data-dir="RIGHT" style="justify-content:center;padding:12px;font-size:1.05rem;">➡️</button>
                </div>
            `;
        }

        // Cruceta D-Pad para Pac-Man Chef
        return `
            <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;max-width:220px;margin:0 auto;">
                <div></div>
                <button type="button" class="pill-action-btn" data-dir="UP" style="justify-content:center;padding:10px;font-size:1.15rem;">⬆️</button>
                <div></div>
                <button type="button" class="pill-action-btn" data-dir="LEFT" style="justify-content:center;padding:10px;font-size:1.15rem;">⬅️</button>
                <button type="button" class="pill-action-btn" data-dir="DOWN" style="justify-content:center;padding:10px;font-size:1.15rem;">⬇️</button>
                <button type="button" class="pill-action-btn" data-dir="RIGHT" style="justify-content:center;padding:10px;font-size:1.15rem;">➡️</button>
            </div>
        `;
    }

    bindUIEvents() {
        this.querySelectorAll('[data-game]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.activeGame = btn.dataset.game;
                this.isPaused = false;
                this.stopActiveLoops();
                this.render();
                this.bindUIEvents();
                this.startSelectedGame();
            });
        });

        this.querySelector('#btn-arcade-pause')?.addEventListener('click', (e) => {
            this.isPaused = !this.isPaused;
            e.currentTarget.textContent = this.isPaused ? '▶️ Reanudar' : '⏸️ Pausa';
            this.setBanner(this.isPaused ? '⏸️ Juego en pausa' : '▶️ ¡En juego!');
        });

        this.querySelector('#btn-arcade-restart')?.addEventListener('click', () => {
            this.isPaused = false;
            const pauseBtn = this.querySelector('#btn-arcade-pause');
            if (pauseBtn) pauseBtn.textContent = '⏸️ Pausa';
            this.stopActiveLoops();
            this.startSelectedGame();
        });

        this.querySelector('#btn-pong-mode')?.addEventListener('click', () => {
            this.pongMode = this.pongMode === '1p' ? '2p' : '1p';
            this.stopActiveLoops();
            this.render();
            this.bindUIEvents();
            this.startSelectedGame();
        });

        this.querySelectorAll('[data-dir]').forEach(btn => {
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.triggerDirection(btn.dataset.dir);
            });
        });
    }

    handleKeyDown(e) {
        const map = {
            ArrowUp: 'UP', KeyW: 'UP',
            ArrowDown: 'DOWN', KeyS: 'DOWN',
            ArrowLeft: 'LEFT', KeyA: 'LEFT',
            ArrowRight: 'RIGHT', KeyD: 'RIGHT',
            Space: 'ROTATE'
        };
        if (map[e.code]) {
            e.preventDefault();
            this.triggerDirection(map[e.code]);
        }
    }

    triggerDirection(dir) {
        if (this.isPaused) return;
        if (this.activeGame === 'pacman' && this.pacmanInput) this.pacmanInput(dir);
        if (this.activeGame === 'pingpong' && this.pongInput) this.pongInput(dir);
        if (this.activeGame === 'tetris' && this.tetrisInput) this.tetrisInput(dir);
    }

    setScore(val) {
        const el = this.querySelector('#arcade-score-val');
        if (el) el.textContent = val;
        this.saveHighScore(this.activeGame, val);
    }

    setExtraStat(text) {
        const el = this.querySelector('#arcade-extra-stat');
        if (el) el.textContent = text;
    }

    setBanner(text) {
        const el = this.querySelector('#arcade-status-banner');
        if (el) el.textContent = text;
    }

    startSelectedGame() {
        const canvas = this.querySelector('#arcade-canvas');
        if (!canvas) return;
        if (this.activeGame === 'pacman') this.initPacManGame(canvas);
        if (this.activeGame === 'pingpong') this.initPingPongGame(canvas);
        if (this.activeGame === 'tetris') this.initTetrisGame(canvas);
    }

    /* =====================================================================
       JUEGO 1: PAC-MAN GASTRONÓMICO (CAZA DE ANTOJOS Y GIRASOLES)
       ===================================================================== */
    initPacManGame(canvas) {
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        const gridSize = 15;
        const tile = canvas.width / gridSize; // 20px

        // 1 = Pared, 0 = Antojo normal, 2 = Girasol/Corazón Power-Up, 9 = Pasillo vacío
        const baseMap = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,2,0,0,0,0,0,1,0,0,0,0,0,2,1],
            [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
            [1,0,1,1,0,1,0,0,0,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
            [1,0,1,0,1,1,9,9,9,1,1,0,1,0,1],
            [1,0,1,0,1,9,9,9,9,9,1,0,1,0,1],
            [9,0,0,0,1,9,9,9,9,9,1,0,0,0,9],
            [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,9,0,0,0,0,1,0,1],
            [1,0,1,1,0,1,1,9,1,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
            [1,2,0,0,0,1,0,1,0,1,0,0,0,2,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];

        const cravings = ['🌮', '🍔', '🥐', '🍰', '🍷'];
        const board = baseMap.map((row, r) =>
            row.map((cell, c) => ({
                type: cell,
                icon: cell === 2 ? ((r + c) % 2 === 0 ? '🌻' : '💖') : cravings[(r * gridSize + c) % cravings.length]
            }))
        );

        let totalCollectibles = 0;
        board.forEach(r => r.forEach(c => { if (c.type === 0 || c.type === 2) totalCollectibles++; }));

        let score = 0;
        let lives = 3;
        let powerTimer = 0;
        let gameOver = false;

        const chef = { x: 7, y: 9, dx: 0, dy: 0, nextDx: 0, nextDy: 0 };
        const ghosts = [
            { x: 6, y: 6, dx: 0, dy: -1, icon: '⛈️' },
            { x: 7, y: 6, dx: 1, dy: 0, icon: '📶' },
            { x: 8, y: 6, dx: -1, dy: 0, icon: '😴' }
        ];

        this.setScore(0);
        this.setExtraStat('❤️'.repeat(lives));
        this.setBanner('👩🏻‍🍳 ¡Recoge los antojos y girasoles con Analy!');

        this.pacmanInput = (dir) => {
            if (dir === 'UP') { chef.nextDx = 0; chef.nextDy = -1; }
            if (dir === 'DOWN') { chef.nextDx = 0; chef.nextDy = 1; }
            if (dir === 'LEFT') { chef.nextDx = -1; chef.nextDy = 0; }
            if (dir === 'RIGHT') { chef.nextDx = 1; chef.nextDy = 0; }
        };

        const canMove = (x, y) => {
            const wrappedX = (x + gridSize) % gridSize;
            if (y < 0 || y >= gridSize) return false;
            return board[y][wrappedX].type !== 1;
        };

        const stepGame = () => {
            if (this.isPaused || gameOver) return;

            if ((chef.nextDx !== 0 || chef.nextDy !== 0) && canMove(chef.x + chef.nextDx, chef.y + chef.nextDy)) {
                chef.dx = chef.nextDx;
                chef.dy = chef.nextDy;
            }

            if (canMove(chef.x + chef.dx, chef.y + chef.dy)) {
                chef.x = (chef.x + chef.dx + gridSize) % gridSize;
                chef.y += chef.dy;
            }

            // Recoger antojo o girasol
            const currentCell = board[chef.y][chef.x];
            if (currentCell.type === 0) {
                currentCell.type = 9;
                score += 10;
                totalCollectibles--;
                this.setScore(score);
            } else if (currentCell.type === 2) {
                currentCell.type = 9;
                score += 50;
                powerTimer = 30; // ~6 segundos de poder
                totalCollectibles--;
                this.setScore(score);
                this.setBanner('🌻 ¡Poder Girasol activo! Atrapa a los malos ratos.');
            }

            if (powerTimer > 0) {
                powerTimer--;
                if (powerTimer === 0) this.setBanner('👩🏻‍🍳 ¡Sigue recolectando antojos!');
            }

            if (totalCollectibles <= 0) {
                gameOver = true;
                this.setBanner('🏆 ¡Victoria! Analy recolectó todos los antojos y girasoles 🌻');
                return;
            }

            // Mover enemigos y verificar colisiones
            const dirs = [
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ];

            ghosts.forEach(g => {
                // Colisión antes de mover
                if (g.x === chef.x && g.y === chef.y) {
                    handleGhostCollision(g);
                }

                const validDirs = dirs.filter(d =>
                    canMove(g.x + d.dx, g.y + d.dy) &&
                    !(d.dx === -g.dx && d.dy === -g.dy)
                );

                const chosen = validDirs.length > 0
                    ? validDirs[Math.floor(Math.random() * validDirs.length)]
                    : dirs.find(d => canMove(g.x + d.dx, g.y + d.dy)) || { dx: 0, dy: 0 };

                g.dx = chosen.dx;
                g.dy = chosen.dy;
                g.x = (g.x + g.dx + gridSize) % gridSize;
                g.y += g.dy;

                if (g.x === chef.x && g.y === chef.y) {
                    handleGhostCollision(g);
                }
            });

            drawBoard();
        };

        const handleGhostCollision = (g) => {
            if (powerTimer > 0) {
                score += 100;
                this.setScore(score);
                g.x = 7;
                g.y = 6;
                this.setBanner('✨ ¡Mal momento transformado en calma (+100 pts)!');
            } else {
                lives--;
                this.setExtraStat(lives > 0 ? '❤️'.repeat(lives) : '💔');
                if (lives <= 0) {
                    gameOver = true;
                    this.setBanner('💔 Fin del juego. Toca "Reiniciar" para otra partida.');
                } else {
                    chef.x = 7;
                    chef.y = 9;
                    chef.dx = 0;
                    chef.dy = 0;
                    this.setBanner(`⚠️ ¡Cuidado! Te quedan ${lives} vidas.`);
                }
            }
        };

        const drawBoard = () => {
            ctx.fillStyle = '#04060e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const cell = board[r][c];
                    const px = c * tile;
                    const py = r * tile;

                    if (cell.type === 1) {
                        ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
                        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
                        ctx.fillRect(px + 1, py + 1, tile - 2, tile - 2);
                        ctx.strokeRect(px + 1, py + 1, tile - 2, tile - 2);
                    } else if (cell.type === 0) {
                        ctx.font = '11px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(cell.icon, px + tile / 2, py + tile / 2);
                    } else if (cell.type === 2) {
                        ctx.font = '15px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(cell.icon, px + tile / 2, py + tile / 2);
                    }
                }
            }

            // Dibujar Chef Analy
            ctx.font = '17px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('👩🏻‍🍳', chef.x * tile + tile / 2, chef.y * tile + tile / 2);

            // Dibujar fantasmas
            ghosts.forEach(g => {
                ctx.font = '16px sans-serif';
                ctx.fillText(powerTimer > 0 ? '🌼' : g.icon, g.x * tile + tile / 2, g.y * tile + tile / 2);
            });
        };

        drawBoard();
        this.gameInterval = setInterval(stepGame, 220);
    }

    /* =====================================================================
       JUEGO 2: PING PONG TÁCTIL (1 JUGADOR VS IA / 2 JUGADORES)
       ===================================================================== */
    initPingPongGame(canvas) {
        canvas.width = 300;
        canvas.height = 350;
        const ctx = canvas.getContext('2d');

        const paddleW = 68;
        const paddleH = 10;
        let bottomX = (canvas.width - paddleW) / 2;
        let topX = (canvas.width - paddleW) / 2;

        let ball = { x: canvas.width / 2, y: canvas.height / 2, vx: 3.2, vy: 3.6, r: 7 };
        let bottomScore = 0;
        let topScore = 0;

        this.setScore(0);
        this.setExtraStat(this.pongMode === '1p' ? '👩🏻‍🍳 0 - 0 🤖' : '👩🏻‍🍳 0 - 0 💻');
        this.setBanner(this.pongMode === '1p'
            ? '🏓 Modo 1J: Desliza en la cancha para mover tu paleta inferior'
            : '🏓 Modo 2J: Abajo Analy 👩🏻‍🍳 • Arriba Kevin 💻 (Deslicen su mitad)');

        this.pongInput = (dir) => {
            if (dir === 'LEFT') bottomX = Math.max(0, bottomX - 24);
            if (dir === 'RIGHT') bottomX = Math.min(canvas.width - paddleW, bottomX + 24);
        };

        const handlePointer = (e) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (e.clientX - rect.left) * scaleX;
            const y = (e.clientY - rect.top) * scaleY;

            if (this.pongMode === '2p' && y < canvas.height / 2) {
                topX = Math.max(0, Math.min(canvas.width - paddleW, x - paddleW / 2));
            } else {
                bottomX = Math.max(0, Math.min(canvas.width - paddleW, x - paddleW / 2));
            }
        };

        canvas.onpointermove = handlePointer;
        canvas.onpointerdown = handlePointer;

        const resetBall = (dirY) => {
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;
            ball.vx = (Math.random() > 0.5 ? 1 : -1) * 3.1;
            ball.vy = dirY * 3.5;
        };

        const loop = () => {
            if (!this.isPaused) {
                ball.x += ball.vx;
                ball.y += ball.vy;

                if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width) {
                    ball.vx *= -1;
                }

                // IA en modo 1 jugador
                if (this.pongMode === '1p') {
                    const target = ball.x - paddleW / 2;
                    topX += (target - topX) * 0.085;
                    topX = Math.max(0, Math.min(canvas.width - paddleW, topX));
                }

                // Rebote paleta inferior (Analy)
                if (ball.y + ball.r >= canvas.height - 22 &&
                    ball.x >= bottomX && ball.x <= bottomX + paddleW && ball.vy > 0) {
                    const hitOffset = (ball.x - (bottomX + paddleW / 2)) / (paddleW / 2);
                    ball.vx = hitOffset * 4.5;
                    ball.vy = -Math.min(6.5, Math.abs(ball.vy) * 1.05);
                    if (this.pongMode === '1p') {
                        bottomScore += 10;
                        this.setScore(bottomScore);
                    }
                }

                // Rebote paleta superior (IA o Kevin)
                if (ball.y - ball.r <= 22 &&
                    ball.x >= topX && ball.x <= topX + paddleW && ball.vy < 0) {
                    const hitOffset = (ball.x - (topX + paddleW / 2)) / (paddleW / 2);
                    ball.vx = hitOffset * 4.5;
                    ball.vy = Math.min(6.5, Math.abs(ball.vy) * 1.05);
                }

                // Punto anotado arriba o abajo
                if (ball.y < 0) {
                    bottomScore += (this.pongMode === '1p' ? 50 : 1);
                    this.setScore(bottomScore);
                    this.setExtraStat(`👩🏻‍🍳 ${bottomScore} - ${topScore} ${this.pongMode === '1p' ? '🤖' : '💻'}`);
                    resetBall(1);
                } else if (ball.y > canvas.height) {
                    topScore += 1;
                    this.setExtraStat(`👩🏻‍🍳 ${bottomScore} - ${topScore} ${this.pongMode === '1p' ? '🤖' : '💻'}`);
                    resetBall(-1);
                }

                // Renderizado de la cancha
                ctx.fillStyle = '#04060e';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = 'rgba(255,255,255,0.15)';
                ctx.setLineDash([6, 6]);
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // Paleta superior
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(topX, 12, paddleW, paddleH);

                // Paleta inferior
                ctx.fillStyle = '#fb7185';
                ctx.fillRect(bottomX, canvas.height - 22, paddleW, paddleH);

                // Pelota
                ctx.fillStyle = '#fbbf24';
                ctx.beginPath();
                ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
                ctx.fill();
            }
            this.rafId = requestAnimationFrame(loop);
        };

        this.rafId = requestAnimationFrame(loop);
    }

    /* =====================================================================
       JUEGO 3: TETRIS COMPLETO (ROTACIÓN, LÍNEAS Y VELOCIDAD PROGRESIVA)
       ===================================================================== */
    initTetrisGame(canvas) {
        const cols = 10;
        const rows = 18;
        const block = 20;
        canvas.width = cols * block;
        canvas.height = rows * block;
        const ctx = canvas.getContext('2d');

        const board = Array.from({ length: rows }, () => Array(cols).fill(0));
        const shapes = [
            { color: '#38bdf8', matrix: [[1, 1, 1, 1]] },
            { color: '#fbbf24', matrix: [[1, 1], [1, 1]] },
            { color: '#c084fc', matrix: [[0, 1, 0], [1, 1, 1]] },
            { color: '#34d399', matrix: [[0, 1, 1], [1, 1, 0]] },
            { color: '#fb7185', matrix: [[1, 1, 0], [0, 1, 1]] },
            { color: '#60a5fa', matrix: [[1, 0, 0], [1, 1, 1]] },
            { color: '#f97316', matrix: [[0, 0, 1], [1, 1, 1]] }
        ];

        let score = 0;
        let lines = 0;
        let gameOver = false;

        const spawnPiece = () => {
            const pick = shapes[Math.floor(Math.random() * shapes.length)];
            return {
                color: pick.color,
                matrix: pick.matrix.map(r => [...r]),
                x: Math.floor(cols / 2) - 1,
                y: 0
            };
        };

        let piece = spawnPiece();
        this.setScore(0);
        this.setExtraStat('Líneas: 0');
        this.setBanner('🧱 ¡Acomoda los bloques y completa líneas!');

        const collides = (mat, px, py) => {
            for (let r = 0; r < mat.length; r++) {
                for (let c = 0; c < mat[r].length; c++) {
                    if (!mat[r][c]) continue;
                    const nx = px + c;
                    const ny = py + r;
                    if (nx < 0 || nx >= cols || ny >= rows) return true;
                    if (ny >= 0 && board[ny][nx]) return true;
                }
            }
            return false;
        };

        const rotateMatrix = (mat) => {
            return mat[0].map((_, idx) => mat.map(row => row[idx]).reverse());
        };

        const mergePiece = () => {
            piece.matrix.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val && piece.y + r >= 0) {
                        board[piece.y + r][piece.x + c] = piece.color;
                    }
                });
            });

            // Verificar líneas completas
            let cleared = 0;
            for (let r = rows - 1; r >= 0; r--) {
                if (board[r].every(cell => cell !== 0)) {
                    board.splice(r, 1);
                    board.unshift(Array(cols).fill(0));
                    cleared++;
                    r++;
                }
            }

            if (cleared > 0) {
                lines += cleared;
                score += cleared * 100 * cleared;
                this.setScore(score);
                this.setExtraStat(`Líneas: ${lines}`);
                this.setBanner(`✨ ¡${cleared} línea(s) completada(s)!`);
            }

            piece = spawnPiece();
            if (collides(piece.matrix, piece.x, piece.y)) {
                gameOver = true;
                this.setBanner('🧱 Tablero lleno. Toca "Reiniciar" para jugar de nuevo.');
            }
        };

        const drawTetris = () => {
            ctx.fillStyle = '#04060e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Cuadrícula sutil
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    ctx.strokeRect(c * block, r * block, block, block);
                    if (board[r][c]) {
                        ctx.fillStyle = board[r][c];
                        ctx.fillRect(c * block + 1, r * block + 1, block - 2, block - 2);
                    }
                }
            }

            // Pieza activa
            piece.matrix.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val) {
                        ctx.fillStyle = piece.color;
                        ctx.fillRect((piece.x + c) * block + 1, (piece.y + r) * block + 1, block - 2, block - 2);
                    }
                });
            });
        };

        this.tetrisInput = (dir) => {
            if (gameOver || this.isPaused) return;
            if (dir === 'LEFT' && !collides(piece.matrix, piece.x - 1, piece.y)) {
                piece.x--;
            } else if (dir === 'RIGHT' && !collides(piece.matrix, piece.x + 1, piece.y)) {
                piece.x++;
            } else if (dir === 'DOWN') {
                if (!collides(piece.matrix, piece.x, piece.y + 1)) {
                    piece.y++;
                    score += 2;
                    this.setScore(score);
                } else {
                    mergePiece();
                }
            } else if (dir === 'ROTATE') {
                const rotated = rotateMatrix(piece.matrix);
                if (!collides(rotated, piece.x, piece.y)) {
                    piece.matrix = rotated;
                }
            }
            drawTetris();
        };

        drawTetris();
        this.gameInterval = setInterval(() => {
            if (this.isPaused || gameOver) return;
            if (!collides(piece.matrix, piece.x, piece.y + 1)) {
                piece.y++;
            } else {
                mergePiece();
            }
            drawTetris();
        }, 520);
    }
}

customElements.define('arcade-view', ArcadeView);