
class Game {
  constructor() {
    const rawTime = localStorage.getItem("gameTime");
    console.log(rawTime);
    console.log(localStorage.getItem("gameTime"));
    const parsedTime = Number(rawTime);
    this.totalTime = Number.isFinite(parsedTime) && parsedTime > 0 ? Math.floor(parsedTime) : 60;

    this.numUfos = parseInt(localStorage.getItem("ufoCount")) || 1;
    this.doubleSpeed = localStorage.getItem("doubleSpeed") === "true";

    this.score = 0;
    this.timeLeft = this.totalTime;
    this.hnav = 220;
    this.active = true;
    this.timerId = null;

    this.container = document.getElementById("container");
    this.pointsEl = document.getElementById("points");
    this.timeEl = document.getElementById("timePlay");

    this.missile = new Missile(document.getElementById("missile"), this);
    this.ufos = [];
    this.createUfos(this.numUfos);

    document.onkeydown = (e) => this.keyboardController(e);

    this.startTimer();
  }

  createUfos(count) {
    for (let i = 0; i < count; i++) {
      const ufoEl = document.createElement("img");
      ufoEl.src = "imgs/ufo.png";
      ufoEl.classList.add("ufo");
      ufoEl.style.position = "absolute";
      ufoEl.style.width = "60px";
      ufoEl.style.height = "60px";
      ufoEl.style.left = Math.random() * (window.innerWidth - 60) + "px";
      ufoEl.style.bottom = Math.random() * (window.innerHeight - this.hnav - 60) + "px";
      this.container.appendChild(ufoEl);

      const ufo = new UFO(ufoEl, this);
      ufo.start();
      this.ufos.push(ufo);
    }
  }

  startTimer() {
    if (!Number.isFinite(this.timeLeft) || this.timeLeft <= 0) this.timeLeft = 60;
    this.updateTimeDisplay();

    this.timerId = setInterval(() => {
      this.timeLeft--;
      if (!Number.isFinite(this.timeLeft)) this.timeLeft = 0;
      this.updateTimeDisplay();

      if (this.timeLeft <= 0) {
        clearInterval(this.timerId);
        this.endGame();
      }
    }, 1000);
  }

  updateTimeDisplay() {
    this.timeEl.textContent = Number.isFinite(this.timeLeft) ? `${this.timeLeft}(s)` : "0(s)";
  }

  endGame() {
    this.active = false;
    clearInterval(this.timerId);

    this.ufos.forEach((ufo) => ufo.stop());
    if (this.missile.interval) clearInterval(this.missile.interval);

    let finalScore = this.calculateFinalScore();
    this.pointsEl.textContent = finalScore;
    this.timeEl.textContent = "FIN";

    setTimeout(() => {
      alert(`⏰ ¡Tiempo agotado!\nPuntuación final: ${finalScore}`);
    }, 500);
    
  }

  calculateFinalScore() {
    let finalScore = this.score;
    const minutes = this.totalTime / 60;
    if (this.numUfos > 1) finalScore -= (this.numUfos - 1) * 50;
    if (this.doubleSpeed) finalScore += 250;

    return Math.max(0, Math.round(finalScore));
  }


  keyboardController(e) {
    if (!this.active) return;
    switch (e.key) {
      case "ArrowRight":
        this.missile.move("right");
        break;
      case "ArrowLeft":
        this.missile.move("left");
        break;
      case " ":
        this.missile.fire();
        break;
    }
  }

  updateScore(points) {
    this.score += points;
    this.pointsEl.textContent = this.score;
  }

  handleUfoHit(ufo) {
    ufo.element.src = "imgs/explosion.gif";
    setTimeout(() => {
      if (this.container.contains(ufo.element)) this.container.removeChild(ufo.element);
      const idx = this.ufos.indexOf(ufo);
      if (idx !== -1) this.ufos.splice(idx, 1);

      this.createUfos(1);
    }, 800);

    this.updateScore(100);
  }
}


class UFO {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.interval = null;
    this.speed = 5;
    this.speedMultiplier = 1;
    this.direction = 1;
  }

  start() {
    this.interval = setInterval(() => this.move(), 25);
  }

  move() {
    if (!this.game.active) return;

    let left = parseInt(this.element.style.left);
    left += this.speed * this.speedMultiplier * this.direction;

    if (left > window.innerWidth - 60 || left < 0) {
      this.direction *= -1;
      left += this.direction * (this.speed * this.speedMultiplier);
    }

    this.element.style.left = left + "px";
  }

  stop() {
    clearInterval(this.interval);
  }
}


class Missile {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.interval = null;
    this.inFlight = false;
    this.speed = 10;
  }

  move(dir) {
    if (this.inFlight || !this.game.active) return;

    const step = 15;
    let left = parseInt(this.element.style.left);
    const width = parseInt(this.element.style.width);
    const limit = window.innerWidth;

    if (dir === "right" && left + width < limit) left += step;
    if (dir === "left" && left > 0) left -= step;

    this.element.style.left = left + "px";
  }

  fire() {
    if (this.inFlight || !this.game.active) return;
    this.inFlight = true;
    this.interval = setInterval(() => this.launch(), 20);
  }

  launch() {
    const uLimit = window.innerHeight - this.game.hnav;
    let vpos = parseInt(this.element.style.bottom) || 10;
    const step = this.speed;

    const nextVpos = vpos + step;
    const increment = Math.max(1, Math.floor(step / 2));
    let hit = false;

    for (let delta = increment; delta <= step; delta += increment) {
      const intermediate = vpos + delta;
      this.element.style.bottom = intermediate + "px";

      if (this.checkCollision()) {
        hit = true;
        break;
      }
    }

    if (hit) {
      clearInterval(this.interval);
      this.inFlight = false;
      this.element.style.bottom = "10px";
    } else if (nextVpos > uLimit) {
      clearInterval(this.interval);
      this.inFlight = false;
      this.element.style.bottom = "10px";
      this.game.updateScore(-25);
    } else {
      this.element.style.bottom = nextVpos + "px";
    }
  }

  checkCollision() {
    const rectMissile = this.element.getBoundingClientRect();

    for (const ufo of this.game.ufos) {
      const rectUfo = ufo.element.getBoundingClientRect();
      const overlap = !(
        rectUfo.right < rectMissile.left ||
        rectUfo.left > rectMissile.right ||
        rectUfo.bottom < rectMissile.top ||
        rectUfo.top > rectMissile.bottom
      );

      if (overlap) {
        this.game.handleUfoHit(ufo);
        return true;
      }
    }
    return false;
  }
}

window.onload = () => { new Game()};
