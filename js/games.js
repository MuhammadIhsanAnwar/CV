// ========================================
// MINI GAMES LOGIC
// ========================================

// ===== FLAPPY BIRD GAME =====
class FlappyBirdGame {
  constructor() {
    this.canvas = document.getElementById('flappyGame');
    this.scoreDisplay = document.getElementById('flappyScore');
    this.startBtn = document.getElementById('flappyStart');
    this.isRunning = false;
    this.score = 0;
    
    this.birdPos = 150;
    this.birdVelocity = 0;
    this.gravity = 0.18;
    this.pipes = [];
    this.pipeGap = 130;
    this.pipeDistance = 220;
    this.pipeSpeed = 3;
    this.frameCount = 0;
    
    this.startBtn.addEventListener('click', () => this.startGame());
    this.canvas.addEventListener('click', () => {
      if (this.isRunning) this.jump();
    });
  }
  
  startGame() {
    this.isRunning = true;
    this.score = 0;
    this.birdPos = 150;
    this.birdVelocity = 0;
    this.pipes = [];
    this.frameCount = 0;
    this.update();
  }
  
  jump() {
    this.birdVelocity = -6;
  }
  
  update() {
    if (!this.isRunning) return;
    
    this.frameCount++;
    
    // Update bird position
    this.birdVelocity += this.gravity;
    this.birdPos += this.birdVelocity;
    
    // Generate pipes
    if (this.frameCount % this.pipeDistance === 0) {
      const gapStart = Math.random() * (250 - this.pipeGap);
      this.pipes.push({
        x: 400,
        gapStart: gapStart,
        passed: false
      });
    }
    
    // Move pipes
    this.pipes.forEach((pipe, index) => {
      pipe.x -= this.pipeSpeed;
      
      // Check if bird passed pipe
      if (!pipe.passed && pipe.x + 60 < 50) {
        pipe.passed = true;
        this.score++;
        this.scoreDisplay.textContent = this.score;
      }
      
      if (pipe.x < -60) {
        this.pipes.splice(index, 1);
      }
    });
    
    // Check collision
    if (this.birdPos < 0 || this.birdPos > 250 || this.checkPipeCollision()) {
      this.endGame();
      return;
    }
    
    this.draw();
    requestAnimationFrame(() => this.update());
  }
  
  checkPipeCollision() {
    const birdX = 50;
    const birdSize = 30;
    
    for (let pipe of this.pipes) {
      if (birdX + birdSize > pipe.x && birdX < pipe.x + 60) {
        if (this.birdPos < pipe.gapStart || this.birdPos + birdSize > pipe.gapStart + this.pipeGap) {
          return true;
        }
      }
    }
    return false;
  }
  
  draw() {
    this.canvas.innerHTML = '';
    
    // Draw bird
    const bird = document.createElement('div');
    bird.className = 'bird';
    bird.style.left = '50px';
    bird.style.top = this.birdPos + 'px';
    const birdIcon = document.createElement('i');
    birdIcon.className = 'fas fa-dove';
    bird.appendChild(birdIcon);
    this.canvas.appendChild(bird);
    
    // Draw pipes
    this.pipes.forEach(pipe => {
      const pipeTop = document.createElement('div');
      pipeTop.className = 'pipe pipe-top';
      pipeTop.style.left = pipe.x + 'px';
      pipeTop.style.height = pipe.gapStart + 'px';
      this.canvas.appendChild(pipeTop);
      
      const pipeBottom = document.createElement('div');
      pipeBottom.className = 'pipe pipe-bottom';
      pipeBottom.style.left = pipe.x + 'px';
      pipeBottom.style.height = (250 - pipe.gapStart - this.pipeGap) + 'px';
      this.canvas.appendChild(pipeBottom);
    });
  }
  
  endGame() {
    this.isRunning = false;
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = `Game Over!\nScore: ${this.score}`;
    this.canvas.appendChild(message);
  }
}

// ===== CLICK SPEED GAME =====
class ClickSpeedGame {
  constructor() {
    this.gameContainer = document.getElementById('clickGame');
    this.scoreDisplay = document.getElementById('clickScore');
    this.startBtn = document.getElementById('clickStart');
    this.counter = document.getElementById('clickCounter');
    this.timerDisplay = document.getElementById('clickTimer');
    this.isRunning = false;
    this.clicks = 0;
    this.maxScore = 0;
    this.timeLeft = 10;
    
    this.startBtn.addEventListener('click', () => this.startGame());
    this.gameContainer.addEventListener('click', (e) => {
      if (this.isRunning && e.target === this.gameContainer) {
        this.handleClick();
      }
    });
  }
  
  startGame() {
    this.isRunning = true;
    this.clicks = 0;
    this.timeLeft = 10;
    this.counter.textContent = '0';
    this.timerDisplay.textContent = this.timeLeft + 's';
    this.gameContainer.style.background = 'linear-gradient(135deg, #e6f9f8 0%, #ccf2f0 100%)';
    
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.timerDisplay.textContent = this.timeLeft + 's';
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }
  
  handleClick() {
    this.clicks++;
    this.counter.textContent = this.clicks;
    this.counter.classList.remove('animate');
    // Trigger animation
    void this.counter.offsetWidth;
    this.counter.classList.add('animate');
  }
  
  endGame() {
    clearInterval(this.timer);
    this.isRunning = false;
    
    if (this.clicks > this.maxScore) {
      this.maxScore = this.clicks;
      this.scoreDisplay.textContent = this.maxScore;
    }
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = `Waktu Habis!\nKlik: ${this.clicks}`;
    this.gameContainer.appendChild(message);
    
    setTimeout(() => {
      message.remove();
      this.gameContainer.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(240,250,255,0.5) 100%)';
    }, 2500);
  }
}

// ===== TAP THE BALL GAME =====
class TapTheBallGame {
  constructor() {
    this.gameContainer = document.getElementById('ballGame');
    this.ball = document.getElementById('ball');
    this.scoreDisplay = document.getElementById('ballScore');
    this.startBtn = document.getElementById('ballStart');
    this.timerDisplay = document.getElementById('ballTimer');
    this.isRunning = false;
    this.score = 0;
    this.ballTimer = null;
    this.gameTimer = null;
    this.timeLeft = 20;
    
    this.startBtn.addEventListener('click', () => this.startGame());
    this.ball.addEventListener('click', (e) => {
      if (this.isRunning) {
        e.stopPropagation();
        this.hitBall();
      }
    });
  }
  
  startGame() {
    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 20;
    this.scoreDisplay.textContent = '0';
    this.timerDisplay.textContent = this.timeLeft + 's';
    this.moveBall();
    
    this.gameTimer = setInterval(() => {
      this.timeLeft--;
      this.timerDisplay.textContent = this.timeLeft + 's';
      if (this.timeLeft <= 0) {
        this.endGame();
      }
    }, 1000);
  }
  
  moveBall() {
    if (!this.isRunning) return;
    
    const maxX = this.gameContainer.offsetWidth - 50;
    const maxY = this.gameContainer.offsetHeight - 50;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    this.ball.style.left = randomX + 'px';
    this.ball.style.top = randomY + 'px';
    
    this.ballTimer = setTimeout(() => this.moveBall(), 650);
  }
  
  hitBall() {
    this.score++;
    this.scoreDisplay.textContent = this.score;
    clearTimeout(this.ballTimer);
    this.moveBall();
  }
  
  endGame() {
    this.isRunning = false;
    clearTimeout(this.ballTimer);
    clearInterval(this.gameTimer);
    
    const message = document.createElement('div');
    message.className = 'game-message';
    message.textContent = `Selesai!\nScore: ${this.score}`;
    this.gameContainer.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2500);
  }
}

// ===== MEMORY GAME =====
class MemoryGame {
  constructor() {
    this.cards = document.querySelectorAll('.memory-card');
    this.scoreDisplay = document.getElementById('memoryScore');
    this.resetBtn = document.getElementById('memoryStart');
    this.timerDisplay = document.getElementById('memoryTimer');
    this.isFlipped = false;
    this.matchedPairs = 0;
    this.totalPairs = 8;
    this.firstCard = null;
    this.secondCard = null;
    this.lockBoard = false;
    this.gameStarted = false;
    this.timeLeft = 60;
    this.gameTimer = null;
    
    // Memory pairs emojis - 8 pairs = 16 cards
    this.symbols = ['<i class="fas fa-rocket"></i>', '<i class="fas fa-rocket"></i>', '<i class="fas fa-gamepad"></i>', '<i class="fas fa-gamepad"></i>', '<i class="fas fa-star"></i>', '<i class="fas fa-star"></i>', '<i class="fas fa-palette"></i>', '<i class="fas fa-palette"></i>', '<i class="fas fa-music"></i>', '<i class="fas fa-music"></i>', '<i class="fas fa-trophy"></i>', '<i class="fas fa-trophy"></i>', '<i class="fas fa-heart"></i>', '<i class="fas fa-heart"></i>', '<i class="fas fa-crown"></i>', '<i class="fas fa-crown"></i>'];
    
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.initGame();
  }
  
  initGame() {
    // Shuffle cards
    let shuffled = [...this.symbols].sort(() => Math.random() - 0.5);
    
    this.cards.forEach((card, index) => {
      card.dataset.symbol = shuffled[index];
      card.classList.remove('flipped', 'matched');
      card.addEventListener('click', () => this.flipCard(card));
    });
    
    this.matchedPairs = 0;
    this.scoreDisplay.textContent = '0/' + this.totalPairs;
  }
  
  flipCard(card) {
    if (this.lockBoard) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;
    
    // Start timer on first card flip
    if (!this.gameStarted) {
      this.gameStarted = true;
      this.timeLeft = 60;
      this.timerDisplay.textContent = this.timeLeft + 's';
      this.timerDisplay.classList.remove('timer-warning');
      this.gameTimer = setInterval(() => {
        this.timeLeft--;
        this.timerDisplay.textContent = this.timeLeft + 's';
        
        // Add warning color when time is low
        if (this.timeLeft <= 10) {
          this.timerDisplay.classList.add('timer-warning');
        }
        
        if (this.timeLeft <= 0) {
          this.gameLost();
        }
      }, 1000);
    }
    
    card.classList.add('flipped');
    card.querySelector('span').innerHTML = card.dataset.symbol;
    
    if (!this.firstCard) {
      this.firstCard = card;
      return;
    }
    
    this.secondCard = card;
    this.lockBoard = true;
    
    this.checkMatch();
  }
  
  checkMatch() {
    const match = this.firstCard.dataset.symbol === this.secondCard.dataset.symbol;
    
    if (match) {
      this.disableCards();
    } else {
      this.unflipCards();
    }
  }
  
  disableCards() {
    this.firstCard.classList.add('matched');
    this.secondCard.classList.add('matched');
    
    this.matchedPairs++;
    this.scoreDisplay.textContent = this.matchedPairs + '/' + this.totalPairs;
    
    if (this.matchedPairs === this.totalPairs) {
      setTimeout(() => this.showWinMessage(), 300);
    }
    
    this.resetCards();
  }
  
  unflipCards() {
    setTimeout(() => {
      this.firstCard.classList.remove('flipped');
      this.secondCard.classList.remove('flipped');
      this.firstCard.querySelector('span').textContent = '❓';
      this.secondCard.querySelector('span').textContent = '❓';
      this.resetCards();
    }, 600);
  }
  
  resetCards() {
    [this.firstCard, this.secondCard] = [null, null];
    this.lockBoard = false;
  }
  
  resetGame() {
    this.lockBoard = true;
    clearInterval(this.gameTimer);
    this.gameStarted = false;
    this.timeLeft = 60;
    this.timerDisplay.textContent = '60s';
    
    setTimeout(() => {
      this.cards.forEach(card => {
        card.classList.remove('flipped', 'matched');
        card.querySelector('span').textContent = '❓';
      });
      this.initGame();
      this.lockBoard = false;
    }, 300);
  }
  
  gameLost() {
    clearInterval(this.gameTimer);
    this.gameStarted = false;
    this.lockBoard = true;
    
    const gameContainer = document.getElementById('memoryGame');
    const message = document.createElement('div');
    message.className = 'game-message';
    const loseIcon = document.createElement('i');
    loseIcon.className = 'fas fa-times-circle';
    message.appendChild(loseIcon);
    message.appendChild(document.createElement('br'));
    message.appendChild(document.createTextNode('Waktu Habis!\nKamu Kalah, Coba Lagi!'));
    gameContainer.appendChild(message);
    
    setTimeout(() => {
      message.remove();
      this.resetGame();
    }, 2500);
  }
  
  showWinMessage() {
    clearInterval(this.gameTimer);
    this.gameStarted = false;
    
    const gameContainer = document.getElementById('memoryGame');
    const message = document.createElement('div');
    message.className = 'game-message';
    const winIcon = document.createElement('i');
    winIcon.className = 'fas fa-check-circle';
    message.appendChild(winIcon);
    message.appendChild(document.createElement('br'));
    message.appendChild(document.createTextNode(`Selamat! Semua Pasangan Cocok!\nSisa Waktu: ${this.timeLeft}s`));
    gameContainer.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2500);
  }
}

// ===== SIMON SAYS GAME =====
class SimonSaysGame {
  constructor() {
    this.buttons = {
      red: document.getElementById('simonRed'),
      blue: document.getElementById('simonBlue'),
      green: document.getElementById('simonGreen'),
      yellow: document.getElementById('simonYellow')
    };
    this.scoreDisplay = document.getElementById('simonScore');
    this.startBtn = document.getElementById('simonStart');
    this.sequence = [];
    this.playerSequence = [];
    this.level = 0;
    this.isPlaying = false;
    this.isPlayerTurn = false;
    
    this.sounds = {
      red: 261.63,    // C4
      blue: 329.63,   // E4
      green: 392.00,  // G4
      yellow: 493.88  // B4
    };
    
    this.startBtn.addEventListener('click', () => this.startGame());
    
    Object.keys(this.buttons).forEach(color => {
      this.buttons[color].addEventListener('click', () => {
        if (this.isPlayerTurn) {
          this.handlePlayerInput(color);
        }
      });
    });
  }
  
  startGame() {
    this.sequence = [];
    this.level = 0;
    this.isPlaying = true;
    this.scoreDisplay.textContent = '0';
    this.nextRound();
  }
  
  nextRound() {
    this.level++;
    this.playerSequence = [];
    this.scoreDisplay.textContent = this.level;
    
    const colors = ['red', 'blue', 'green', 'yellow'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.sequence.push(randomColor);
    
    this.playSequence();
  }
  
  async playSequence() {
    this.isPlayerTurn = false;
    
    for (let i = 0; i < this.sequence.length; i++) {
      await this.sleep(600);
      await this.flashButton(this.sequence[i]);
    }
    
    this.isPlayerTurn = true;
  }
  
  async flashButton(color) {
    const button = this.buttons[color];
    button.classList.add('active', 'flash');
    this.playSound(this.sounds[color]);
    
    await this.sleep(400);
    
    button.classList.remove('active', 'flash');
  }
  
  handlePlayerInput(color) {
    this.playerSequence.push(color);
    this.flashButton(color);
    
    const currentIndex = this.playerSequence.length - 1;
    
    if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
      this.endGame();
      return;
    }
    
    if (this.playerSequence.length === this.sequence.length) {
      this.isPlayerTurn = false;
      setTimeout(() => this.nextRound(), 1000);
    }
  }
  
  endGame() {
    this.isPlaying = false;
    this.isPlayerTurn = false;
    
    const gameContainer = document.getElementById('simonGame');
    const message = document.createElement('div');
    message.className = 'game-message';
    const icon = document.createElement('i');
    icon.className = 'fas fa-times-circle';
    message.appendChild(icon);
    message.appendChild(document.createElement('br'));
    message.appendChild(document.createTextNode(`Game Over!\nLevel: ${this.level}`));
    gameContainer.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2500);
  }
  
  playSound(frequency) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ===== REACTION TIME GAME =====
class ReactionTimeGame {
  constructor() {
    this.gameContainer = document.getElementById('reactionGame');
    this.message = document.getElementById('reactionMessage');
    this.scoreDisplay = document.getElementById('reactionScore');
    this.startBtn = document.getElementById('reactionStart');
    this.isWaiting = false;
    this.isReady = false;
    this.startTime = 0;
    this.bestTime = null;
    this.timeout = null;
    
    this.startBtn.addEventListener('click', () => this.startGame());
    this.gameContainer.addEventListener('click', () => this.handleClick());
  }
  
  startGame() {
    if (this.isWaiting || this.isReady) return;
    
    this.isWaiting = true;
    this.isReady = false;
    
    this.gameContainer.classList.remove('reaction-ready');
    this.gameContainer.classList.add('reaction-waiting');
    
    const waitIcon = document.createElement('i');
    waitIcon.className = 'fas fa-hourglass-half';
    this.message.innerHTML = '';
    this.message.appendChild(waitIcon);
    this.message.appendChild(document.createElement('br'));
    this.message.appendChild(document.createTextNode('Tunggu...'));
    
    const randomDelay = 2000 + Math.random() * 3000;
    
    this.timeout = setTimeout(() => {
      this.showReady();
    }, randomDelay);
  }
  
  showReady() {
    this.isWaiting = false;
    this.isReady = true;
    this.startTime = Date.now();
    
    this.gameContainer.classList.remove('reaction-waiting');
    this.gameContainer.classList.add('reaction-ready');
    
    const readyIcon = document.createElement('i');
    readyIcon.className = 'fas fa-bolt';
    this.message.innerHTML = '';
    this.message.appendChild(readyIcon);
    this.message.appendChild(document.createElement('br'));
    this.message.appendChild(document.createTextNode('KLIK SEKARANG!'));
  }
  
  handleClick() {
    if (this.isWaiting && !this.isReady) {
      clearTimeout(this.timeout);
      this.isWaiting = false;
      
      const tooFastIcon = document.createElement('i');
      tooFastIcon.className = 'fas fa-exclamation-triangle';
      this.message.innerHTML = '';
      this.message.appendChild(tooFastIcon);
      this.message.appendChild(document.createElement('br'));
      this.message.appendChild(document.createTextNode('Terlalu Cepat!'));
      
      this.gameContainer.classList.remove('reaction-waiting');
      
      setTimeout(() => {
        const clickIcon = document.createElement('i');
        clickIcon.className = 'fas fa-mouse-pointer';
        this.message.innerHTML = '';
        this.message.appendChild(clickIcon);
        this.message.appendChild(document.createElement('br'));
        this.message.appendChild(document.createTextNode('Klik "Main" untuk mulai'));
      }, 1500);
      
      return;
    }
    
    if (this.isReady) {
      const reactionTime = Date.now() - this.startTime;
      this.isReady = false;
      
      this.gameContainer.classList.remove('reaction-ready');
      
      if (this.bestTime === null || reactionTime < this.bestTime) {
        this.bestTime = reactionTime;
        const bestSeconds = (this.bestTime / 1000).toFixed(3);
        this.scoreDisplay.textContent = bestSeconds + 's';
      }
      
      const resultIcon = document.createElement('i');
      resultIcon.className = 'fas fa-stopwatch';
      this.message.innerHTML = '';
      this.message.appendChild(resultIcon);
      this.message.appendChild(document.createElement('br'));
      const seconds = (reactionTime / 1000).toFixed(3);
      this.message.appendChild(document.createTextNode(`${seconds}s`));
      
      setTimeout(() => {
        const clickIcon = document.createElement('i');
        clickIcon.className = 'fas fa-mouse-pointer';
        this.message.innerHTML = '';
        this.message.appendChild(clickIcon);
        this.message.appendChild(document.createElement('br'));
        this.message.appendChild(document.createTextNode('Klik "Main" untuk coba lagi'));
      }, 2000);
    }
  }
}

// Initialize games when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new FlappyBirdGame();
  new ClickSpeedGame();
  new TapTheBallGame();
  new MemoryGame();
  new SimonSaysGame();
  new ReactionTimeGame();
});
