import { Component, HostListener, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

type GameType = 'menu' | 'snake' | 'pong' | 'breakout' | 'flappy' | 'shooter' | 'dino';

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('gameCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    isVisible = false;
    activeGame: GameType = 'menu';
    isGameRunning = false;
    score = 0;
    highScore = 0;

    games = [
        { id: 'snake', name: 'Neon Snake', icon: '🐍' },
        { id: 'pong', name: 'Cyber Pong', icon: '🏓' },
        { id: 'breakout', name: 'Brick Breaker', icon: '🧱' },
        { id: 'flappy', name: 'Flappy Box', icon: '✈️' },
        { id: 'shooter', name: 'Space Defender', icon: '🚀' },
        { id: 'dino', name: 'Dino Run', icon: '🦖' }
    ];

    private ctx!: CanvasRenderingContext2D;
    private gameLoop: any;
    private canvasWidth = 400;
    private canvasHeight = 400;

    // --- Game State Variables ---
    private frameCount = 0;

    // Snake
    private snake: { x: number, y: number }[] = [];
    private snakeFood: { x: number, y: number } = { x: 0, y: 0 };
    private snakeDir: { x: number, y: number } = { x: 0, y: 0 };

    // Pong
    private paddleY = 150;
    private aiPaddleY = 150;
    private ball = { x: 200, y: 200, dx: 3, dy: 3 };
    private readonly paddleHeight = 80; // Easier: taller paddle

    // Breakout
    private paddleX = 150;
    private bricks: { x: number, y: number, status: number }[] = [];
    private ballBrick = { x: 200, y: 200, dx: 3, dy: -3 };
    private readonly paddleWidth = 100; // Easier: wider paddle

    // Flappy
    private birdY = 200;
    private birdVelocity = 0;
    private pipes: { x: number, gapY: number }[] = [];

    // Shooter
    private playerX = 175;
    private bullets: { x: number, y: number }[] = [];
    private enemies: { x: number, y: number }[] = [];
    private enemyTimer = 0;

    // Dino
    private dinoY = 300;
    private dinoVelocity = 0;
    private isJumping = false;
    private obstacles: { x: number, type: number }[] = [];
    private groundY = 350;

    constructor() { }

    ngOnInit() {
        this.loadHighScore();
    }

    ngOnDestroy() {
        this.stopGame();
    }

    toggleGame() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.activeGame = 'menu';
        } else {
            this.stopGame();
        }
    }

    selectGame(game: string) {
        this.activeGame = game as GameType;
        setTimeout(() => this.initGame(), 50);
    }

    backToMenu() {
        this.stopGame();
        this.activeGame = 'menu';
    }

    initGame() {
        if (!this.canvasRef) return;
        const canvas = this.canvasRef.nativeElement;
        this.ctx = canvas.getContext('2d')!;

        const size = Math.min(window.innerWidth - 40, 400);
        canvas.width = size;
        canvas.height = size;
        this.canvasWidth = size;
        this.canvasHeight = size;

        this.startGame();
    }

    startGame() {
        this.isGameRunning = true;
        this.score = 0;
        this.frameCount = 0;
        this.loadHighScore(this.activeGame);

        switch (this.activeGame) {
            case 'snake': this.resetSnake(); break;
            case 'pong': this.resetPong(); break;
            case 'breakout': this.resetBreakout(); break;
            case 'flappy': this.resetFlappy(); break;
            case 'shooter': this.resetShooter(); break;
            case 'dino': this.resetDino(); break;
        }

        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 1000 / 60);
    }

    stopGame() {
        this.isGameRunning = false;
        if (this.gameLoop) clearInterval(this.gameLoop);
    }

    update() {
        if (!this.isGameRunning) return;
        this.frameCount++;

        switch (this.activeGame) {
            case 'snake': this.updateSnake(); break;
            case 'pong': this.updatePong(); break;
            case 'breakout': this.updateBreakout(); break;
            case 'flappy': this.updateFlappy(); break;
            case 'shooter': this.updateShooter(); break;
            case 'dino': this.updateDino(); break;
        }

        this.draw();
    }

    draw() {
        if (!this.ctx) return;
        this.ctx.fillStyle = '#0b0e14';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        switch (this.activeGame) {
            case 'snake': this.drawSnake(); break;
            case 'pong': this.drawPong(); break;
            case 'breakout': this.drawBreakout(); break;
            case 'flappy': this.drawFlappy(); break;
            case 'shooter': this.drawShooter(); break;
            case 'dino': this.drawDino(); break;
        }
    }

    gameOver() {
        this.stopGame();
        this.saveHighScore();
        setTimeout(() => {
            this.ctx.fillStyle = 'rgba(0,0,0,0.85)';
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

            this.ctx.fillStyle = '#ff0055';
            this.ctx.font = 'bold 30px monospace';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvasWidth / 2, this.canvasHeight / 2 - 20);

            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px monospace';
            this.ctx.fillText(`Score: ${this.score}`, this.canvasWidth / 2, this.canvasHeight / 2 + 20);
            this.ctx.fillText('Press Space/Tap to Retry', this.canvasWidth / 2, this.canvasHeight / 2 + 50);
        }, 50);
    }
    // --- INPUT HANDLING ---
    private touchStartX = 0;
    private touchStartY = 0;

    @HostListener('document:touchstart', ['$event'])
    onTouchStart(e: TouchEvent) {
        if (!this.isVisible || this.activeGame === 'menu') return;
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
    }

    @HostListener('document:touchend', ['$event'])
    onTouchEnd(e: TouchEvent) {
        if (!this.isVisible || this.activeGame === 'menu') return;
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        this.handleSwipe(this.touchStartX, this.touchStartY, touchEndX, touchEndY);
    }

    handleSwipe(startX: number, startY: number, endX: number, endY: number) {
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (!this.isGameRunning) {
            this.startGame();
            return;
        }

        // Horizontal Swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 30) { // Threshold
                this.handleMobileControl(diffX > 0 ? 'right' : 'left');
            }
        }
        // Vertical Swipe
        else {
            if (Math.abs(diffY) > 30) {
                this.handleMobileControl(diffY > 0 ? 'down' : 'up');
            }
        }
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboard(event: KeyboardEvent) {
        if (!this.isVisible) return;
        if (this.activeGame === 'menu') return;

        if (!this.isGameRunning && (event.code === 'Space' || event.code === 'Enter')) {
            this.startGame();
            return;
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) {
            event.preventDefault();
        }

        switch (this.activeGame) {
            case 'snake':
                if (event.key === 'ArrowUp' && this.snakeDir.y === 0) this.snakeDir = { x: 0, y: -1 };
                if (event.key === 'ArrowDown' && this.snakeDir.y === 0) this.snakeDir = { x: 0, y: 1 };
                if (event.key === 'ArrowLeft' && this.snakeDir.x === 0) this.snakeDir = { x: -1, y: 0 };
                if (event.key === 'ArrowRight' && this.snakeDir.x === 0) this.snakeDir = { x: 1, y: 0 };
                break;
            case 'pong':
                if (event.key === 'ArrowUp') this.paddleY = Math.max(0, this.paddleY - 15);
                if (event.key === 'ArrowDown') this.paddleY = Math.min(this.canvasHeight - this.paddleHeight, this.paddleY + 15);
                break;
            case 'breakout':
                if (event.key === 'ArrowLeft') this.paddleX = Math.max(0, this.paddleX - 25);
                if (event.key === 'ArrowRight') this.paddleX = Math.min(this.canvasWidth - this.paddleWidth, this.paddleX + 25);
                break;
            case 'flappy':
            case 'dino':
                if (event.code === 'Space' || event.key === 'ArrowUp') this.jump();
                break;
            case 'shooter':
                if (event.key === 'ArrowLeft') this.playerX = Math.max(0, this.playerX - 15);
                if (event.key === 'ArrowRight') this.playerX = Math.min(this.canvasWidth - 20, this.playerX + 15);
                if (event.code === 'Space') this.shoot();
                break;
        }
    }

    handleMobileControl(action: string) {
        if (!this.isGameRunning) {
            this.startGame();
            return;
        }

        switch (this.activeGame) {
            case 'snake':
                if (action === 'up' && this.snakeDir.y === 0) this.snakeDir = { x: 0, y: -1 };
                if (action === 'down' && this.snakeDir.y === 0) this.snakeDir = { x: 0, y: 1 };
                if (action === 'left' && this.snakeDir.x === 0) this.snakeDir = { x: -1, y: 0 };
                if (action === 'right' && this.snakeDir.x === 0) this.snakeDir = { x: 1, y: 0 };
                break;
            case 'pong':
                if (action === 'up') this.paddleY = Math.max(0, this.paddleY - 30);
                if (action === 'down') this.paddleY = Math.min(this.canvasHeight - this.paddleHeight, this.paddleY + 30);
                break;
            case 'breakout':
                if (action === 'left') this.paddleX = Math.max(0, this.paddleX - 30);
                if (action === 'right') this.paddleX = Math.min(this.canvasWidth - this.paddleWidth, this.paddleX + 30);
                break;
            case 'flappy':
            case 'dino':
                this.jump();
                break;
            case 'shooter':
                if (action === 'left') this.playerX = Math.max(0, this.playerX - 20);
                if (action === 'right') this.playerX = Math.min(this.canvasWidth - 20, this.playerX + 20);
                if (action === 'up' || action === 'btn') this.shoot();
                break;
        }
    }

    // --- GAME LOGIC ---

    // 1. SNAKE
    resetSnake() {
        this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        this.snakeDir = { x: 1, y: 0 };
        this.placeSnakeFood();
    }
    updateSnake() {
        // Smoother throttle: Update every 5 frames
        if (this.frameCount % 5 !== 0) return;

        const head = { x: this.snake[0].x + this.snakeDir.x, y: this.snake[0].y + this.snakeDir.y };
        const max = this.canvasWidth / 20;

        // Wrap around logic (Free Pass)
        if (head.x < 0) head.x = max - 1;
        if (head.x >= max) head.x = 0;
        if (head.y < 0) head.y = max - 1;
        if (head.y >= max) head.y = 0;

        if (this.snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)) { // Ignore head-self
            this.gameOver();
            return;
        }

        this.snake.unshift(head);
        if (head.x === this.snakeFood.x && head.y === this.snakeFood.y) {
            this.score += 10;
            this.placeSnakeFood();
        } else {
            this.snake.pop();
        }
    }
    drawSnake() {
        this.snake.forEach((s, i) => {
            this.ctx.fillStyle = i === 0 ? '#fff' : '#00f0ff';
            this.ctx.fillRect(s.x * 20, s.y * 20, 18, 18);
        });
        this.ctx.fillStyle = '#ff0055';
        this.ctx.fillRect(this.snakeFood.x * 20, this.snakeFood.y * 20, 18, 18);
    }
    placeSnakeFood() {
        const max = this.canvasWidth / 20;
        this.snakeFood = { x: Math.floor(Math.random() * max), y: Math.floor(Math.random() * max) };
    }

    // 2. PONG (Easier)
    resetPong() {
        this.ball = { x: this.canvasWidth / 2, y: this.canvasHeight / 2, dx: 3, dy: 3 }; // Slower ball
        this.paddleY = (this.canvasHeight - this.paddleHeight) / 2;
        this.aiPaddleY = this.paddleY;
    }
    updatePong() {
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.y <= 0 || this.ball.y >= this.canvasHeight) this.ball.dy *= -1;

        // Player Paddle
        if (this.ball.x <= 20 && this.ball.y > this.paddleY && this.ball.y < this.paddleY + this.paddleHeight) {
            this.ball.dx *= -1; // No speed up, simplified
            this.ball.x = 22; // Prevent stickiness
            this.score += 1;
        }
        // AI Paddle
        if (this.ball.x >= this.canvasWidth - 20 && this.ball.y > this.aiPaddleY && this.ball.y < this.aiPaddleY + this.paddleHeight) {
            this.ball.dx *= -1;
            this.ball.x = this.canvasWidth - 22;
        }

        if (this.ball.x < 0) this.gameOver();
        if (this.ball.x > this.canvasWidth) {
            this.ball.x = 200; this.ball.y = 200; // Reset point
            this.ball.dx = -3;
        }

        // AI tracks ball with limit
        const center = this.aiPaddleY + this.paddleHeight / 2;
        if (center < this.ball.y - 10) this.aiPaddleY += 2.5; // Slower AI
        if (center > this.ball.y + 10) this.aiPaddleY -= 2.5;
    }
    drawPong() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(10, this.paddleY, 10, this.paddleHeight);
        this.ctx.fillRect(this.canvasWidth - 20, this.aiPaddleY, 10, this.paddleHeight);
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvasWidth / 2, 0);
        this.ctx.lineTo(this.canvasWidth / 2, this.canvasHeight);
        this.ctx.stroke();
    }

    // 3. BREAKOUT (Easier)
    resetBreakout() {
        this.paddleX = (this.canvasWidth - this.paddleWidth) / 2;
        this.ballBrick = { x: this.canvasWidth / 2, y: this.canvasHeight / 2, dx: 3, dy: -3 };
        this.bricks = [];
        const rows = 4; const cols = 5;
        const brickWidth = (this.canvasWidth - 20) / cols;
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                this.bricks.push({ x: c * brickWidth + 10, y: r * 25 + 30, status: 1 });
            }
        }
    }
    updateBreakout() {
        this.ballBrick.x += this.ballBrick.dx;
        this.ballBrick.y += this.ballBrick.dy;

        if (this.ballBrick.x < 0 || this.ballBrick.x > this.canvasWidth) this.ballBrick.dx *= -1;
        if (this.ballBrick.y < 0) this.ballBrick.dy *= -1;

        // Paddle
        if (this.ballBrick.y > this.canvasHeight - 20) {
            if (this.ballBrick.x > this.paddleX && this.ballBrick.x < this.paddleX + this.paddleWidth) {
                this.ballBrick.dy *= -1;
                this.ballBrick.y = this.canvasHeight - 22;
            } else if (this.ballBrick.y > this.canvasHeight) {
                this.gameOver();
            }
        }

        const brickWidth = (this.canvasWidth - 20) / 5;
        this.bricks.forEach(b => {
            if (b.status === 1) {
                if (this.ballBrick.x > b.x && this.ballBrick.x < b.x + brickWidth &&
                    this.ballBrick.y > b.y && this.ballBrick.y < b.y + 20) {
                    this.ballBrick.dy *= -1;
                    b.status = 0;
                    this.score += 10;
                }
            }
        });
    }
    drawBreakout() {
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(this.paddleX, this.canvasHeight - 10, this.paddleWidth, 10);
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ballBrick.x, this.ballBrick.y, 5, 0, Math.PI * 2);
        this.ctx.fill();

        const brickWidth = (this.canvasWidth - 20) / 5;
        this.bricks.forEach(b => {
            if (b.status === 1) {
                this.ctx.fillStyle = '#ff0055';
                this.ctx.fillRect(b.x + 1, b.y + 1, brickWidth - 2, 18);
            }
        });
    }

    // 4. FLAPPY (Easier)
    resetFlappy() {
        this.birdY = 200;
        this.birdVelocity = 0;
        this.pipes = [];
        this.frameCount = 0;
    }
    jump() {
        if (this.activeGame === 'flappy') this.birdVelocity = -5; // Lower jump force
        if (this.activeGame === 'dino' && !this.isJumping) {
            this.isJumping = true;
            this.dinoVelocity = -10; // Lower jump force
        }
    }
    updateFlappy() {
        this.birdVelocity += 0.25; // Lower gravity
        this.birdY += this.birdVelocity;

        if (this.birdY > this.canvasHeight - 10 || this.birdY < 0) this.gameOver();

        if (this.frameCount % 200 === 0) { // Slower pipe spawn
            this.pipes.push({ x: this.canvasWidth, gapY: Math.random() * (this.canvasHeight - 200) + 50 });
        }

        this.pipes.forEach(p => {
            p.x -= 2; // Slower pipes
            if (p.x === 100) this.score++;

            if (p.x < 130 && p.x + 50 > 100) { // Hitbox check
                if (this.birdY < p.gapY || this.birdY + 20 > p.gapY + 150) { // 150 gap size (easier)
                    this.gameOver();
                }
            }
        });
        this.pipes = this.pipes.filter(p => p.x > -60);
    }
    drawFlappy() {
        this.ctx.fillStyle = '#ffd700';
        this.ctx.fillRect(100, this.birdY, 30, 20);
        this.ctx.fillStyle = '#00f0ff';
        this.pipes.forEach(p => {
            this.ctx.fillRect(p.x, 0, 50, p.gapY);
            this.ctx.fillRect(p.x, p.gapY + 150, 50, this.canvasHeight - (p.gapY + 150));
        });
    }

    // 5. SHOOTER (Easier)
    resetShooter() {
        this.playerX = this.canvasWidth / 2;
        this.bullets = [];
        this.enemies = [];
        this.frameCount = 0;
    }
    shoot() {
        this.bullets.push({ x: this.playerX + 10, y: this.canvasHeight - 30 });
    }
    updateShooter() {
        if (this.frameCount % 80 === 0) { // Slower spawns
            this.enemies.push({ x: Math.random() * (this.canvasWidth - 20), y: -20 });
        }

        this.bullets.forEach(b => b.y -= 8); // Faster bullets
        this.enemies.forEach(e => e.y += 1.5); // Slower enemies

        this.bullets = this.bullets.filter(b => {
            let hit = false;
            this.enemies = this.enemies.filter(e => {
                if (b.x > e.x - 5 && b.x < e.x + 25 && b.y > e.y && b.y < e.y + 25) {
                    hit = true;
                    this.score += 10;
                    return false;
                }
                return true;
            });
            return !hit && b.y > 0;
        });

        this.enemies.forEach(e => {
            if (e.y > this.canvasHeight) this.gameOver();
        });
    }
    drawShooter() {
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.beginPath();
        this.ctx.moveTo(this.playerX + 10, this.canvasHeight - 30);
        this.ctx.lineTo(this.playerX, this.canvasHeight);
        this.ctx.lineTo(this.playerX + 20, this.canvasHeight);
        this.ctx.fill();

        this.ctx.fillStyle = '#ff0';
        this.bullets.forEach(b => this.ctx.fillRect(b.x, b.y, 4, 8));

        this.ctx.fillStyle = '#ff0055';
        this.enemies.forEach(e => this.ctx.fillRect(e.x, e.y, 20, 20));
    }

    // 6. DINO (Easier)
    resetDino() {
        this.dinoY = this.groundY;
        this.dinoVelocity = 0;
        this.isJumping = false;
        this.obstacles = [];
        this.frameCount = 0;
    }
    updateDino() {
        if (this.isJumping) {
            this.dinoY += this.dinoVelocity;
            this.dinoVelocity += 0.5;
            if (this.dinoY >= this.groundY) {
                this.dinoY = this.groundY;
                this.isJumping = false;
            }
        }

        if (this.frameCount % 120 === 0) { // Less obstacles
            this.obstacles.push({ x: this.canvasWidth, type: 1 });
        }

        this.obstacles.forEach(o => {
            o.x -= 3; // Slower obstacles
            if (o.x < 60 && o.x > 30 && this.dinoY > this.groundY - 15) {
                this.gameOver();
            }
        });

        this.score++;
        this.obstacles = this.obstacles.filter(o => o.x > -30);
    }
    drawDino() {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, this.groundY + 20, this.canvasWidth, 2);
        this.ctx.fillStyle = '#00f0ff';
        this.ctx.fillRect(40, this.dinoY, 20, 20);
        this.ctx.fillStyle = '#ff0055';
        this.obstacles.forEach(o => {
            this.ctx.fillRect(o.x, this.groundY, 15, 20);
        });
    }

    // High Score
    loadHighScore(game: string = this.activeGame) {
        if (game === 'menu') return;
        const key = `highscore_${game}`;
        this.highScore = parseInt(localStorage.getItem(key) || '0', 10);
    }
    saveHighScore() {
        const key = `highscore_${this.activeGame}`;
        if (this.score > this.highScore) {
            localStorage.setItem(key, this.score.toString());
            this.highScore = this.score;
        }
    }
}
