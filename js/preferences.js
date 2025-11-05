
class PreferencesManager {
  constructor() {
    this.form = document.getElementById("preferences-form");
    this.nUfosInput = document.getElementById("nUfos");
    this.timeInput = document.getElementById("time");
    this.doubleSpeedInput = document.getElementById("doubleSpeed");
    this.messageEl = document.getElementById("save-message");

    this.ufoNKey = "ufo_num";
    this.timeKey = "gameTime";
    this.dSpeedKey = "doubleSpeed"

    this.init();
  }

  init() {
    this.loadPreferences();
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.savePreferences();
    });
  }

  loadPreferences() {
    const nUfos = localStorage.getItem(this.ufoNKey) || 5;
    const gameTime = localStorage.getItem(this.timeKey) || 60;
    const doubleSpeed = localStorage.getItem(this.dSpeedKey) || false;

    this.nUfosInput.value = nUfos;
    this.timeInput.value = gameTime;
    this.doubleSpeedInput.checked = doubleSpeed;
  }

  savePreferences() {
    const prefs = {
      nUfos: parseInt(this.nUfosInput.value),
      time: parseInt(this.timeInput.value),
      doubleSpeed: this.doubleSpeedInput.checked,
    };

    
    localStorage.setItem(this.ufoNKey, this.nUfosInput.value);
    localStorage.setItem(this.timeKey, this.timeInput.value);
    localStorage.setItem(this.dSpeedKey, this.doubleSpeedInput.value);

    this.showMessage("AJUSTES GUARDADOS CORRECTAMENTE", "#ff00ff");
  }

  showMessage(text, color) {
    this.messageEl.textContent = text;
    this.messageEl.style.color = color;
    this.messageEl.style.display = "block";
    this.messageEl.classList.add("glow");

    setTimeout(() => {
      this.messageEl.style.display = "none";
      this.messageEl.classList.remove("glow");
    }, 2000);
  }
}

window.onload = () => new PreferencesManager();
