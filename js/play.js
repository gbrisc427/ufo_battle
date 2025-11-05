
class Missile {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.speed = 10;
    this.inFlight = false;
    this.interval = null;
  }

  move(direction) {
    if (this.inFlight) return;

    const currentLeft = parseInt(this.element.style.left) || 0;
    const width = parseInt(this.element.style.width) || 0;
    const step = 15;
    const rightLimit = window.innerWidth;

    if (direction === "right" && currentLeft + width + step < rightLimit) {
      this.element.style.left = currentLeft + step + "px";
    } else if (direction === "left" && currentLeft - step >= 0) {
      this.element.style.left = currentLeft - step + "px";
    }
  }

  fire() {
    if (this.inFlight) return;
    this.inFlight = true;
    this.interval = setInterval(() => this.launch(), 20);
  }

  launch() {
    const uLimit = window.innerHeight - this.game.hnav;
    const vpos = parseInt(this.element.style.bottom) || 10;

    if (this.game.ufo && this.checkCollision()) {
      clearInterval(this.interval);
      this.inFlight = false;
      this.element.style.bottom = "10px";
      this.game.updateScore(100);
      this.game.explodeUFO();
    } else if (vpos > uLimit) {
      clearInterval(this.interval);
      this.inFlight = false;
      this.element.style.bottom = "10px";
      this.game.updateScore(-25);
    } else {
      this.element.style.bottom = vpos + this.speed + "px";
    }
  }

  checkCollision() {
    const rectUFO = this.game.ufo.element.getBoundingClientRect();
    const rectMissile = this.element.getBoundingClientRect();

    return !(
      rectUFO.right < rectMissile.left ||
      rectUFO.left > rectMissile.right ||
      rectUFO.bottom < rectMissile.top ||
      rectUFO.top > rectMissile.bottom
    );
  }
}

class UFO {
  constructor(element, game) {
    this.element = element;
    this.game = game;
    this.speed = 5;
    this.interval = null;
    this.direction = 1;
  }

  start() {
    this.interval = setInterval(() => this.move(), 25);
  }

  move() {
    const rightLimit = window.innerWidth;
    const pos = parseInt(this.element.style.left) || 0;
    const width = parseInt(this.element.style.width) || 60;

    if (pos + width + this.speed > rightLimit || pos + this.speed < 0) {
      this.direction *= -1;
    }
    this.element.style.left = pos + this.speed * this.direction + "px";
  }

  explode() {
    clearInterval(this.interval);
    this.element.src = "imgs/explosion.gif";

    setTimeout(() => {
      this.remove();
      this.game.spawnUFO();
    }, 1000);
  }

  remove() {
    clearInterval(this.interval);
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

class Game {
  constructor() {
    this.score = 0;
    this.hnav = 220; // altura del menú
    this.container = document.getElementById("container");
    this.pointsEl = document.getElementById("points");

    this.missile = new Missile(document.getElementById("missile"), this);
    this.ufo = new UFO(document.getElementById("ufo"), this);

    this.initControls();
    this.ufo.start();
  }

  initControls() {
    document.addEventListener("keydown", (e) => this.handleKey(e));
  }

  handleKey(e) {
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

  explodeUFO() {
    this.ufo.explode();
  }

  spawnUFO() {
    const newUfo = document.createElement("img");
    const left = parseInt(Math.random() * window.innerWidth);
    const bottom = parseInt(Math.random() * (window.innerHeight - this.hnav));

    newUfo.src = "imgs/ufo.png";
    newUfo.id = "ufo";
    newUfo.style.position = "absolute";
    newUfo.style.left = `${left}px`;
    newUfo.style.bottom = `${bottom}px`;
    newUfo.style.width = "60px";
    newUfo.style.height = "60px";

    this.container.appendChild(newUfo);
    this.ufo = new UFO(newUfo, this);
    this.ufo.start();
  }
}


window.onload = () => new Game();
