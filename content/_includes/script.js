const tmpl = `<div 
data-num="NUM" data-color="COLOR"
data-receive="update"></div>`;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class State {
  constructor() {
    this.min = 0;
    this.max = 4;
    this.matches = 0;
    this.targetColor = randInt(
      this.min,
      this.max,
    );
  }
}
const s = new State();

window.PageContent = class {
  async start(_event, el) {
    for (let c = 0; c < 100; c += 1) {
      const fr = {
        "NUM": c,
        "COLOR": randInt(0, 2),
      };
      const cell = this.api.useTemplate(tmpl, fr);
      el.appendChild(cell);
    }
    await sleep(1000);
    this.api.forward(null, "tickUpdate");
  }

  status(_event, el) {
    if (s.matches === 100) {
      el.innerHTML = "SOLID";
    }
  }

  async tickUpdate() {
    s.matches = 0;
    this.api.forward(null, "update");
    this.api.forward(null, "status");
    await sleep(1000);
    this.tickUpdate();
  }

  async update(_event, el) {
    const checkColor = parseInt(el.dataset.color, 10);
    if (checkColor !== s.targetColor) {
      await sleep(randInt(300, 800));
      el.dataset.color = randInt(s.min, s.max);
    } else {
      s.matches += 1;
    }
  }
};
