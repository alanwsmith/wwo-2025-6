const tmpl = `<div data-receive="shuffle|update"></div>`;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class State {
  constructor() {
    this.matches = 0;
    this.max = 4;
    this.min = 0;
    this.sleep = 900;
  }
}
const s = new State();

window.PageContent = class {
  shuffle(_event, el) {
    const color = randInt(s.min, s.max);
    if (color !== 0) {
      el.classList.add("padded");
    }
    el.dataset.color = color;
  }

  async start(_event, el) {
    this.updateColors();
    for (let c = 0; c < 100; c += 1) {
      const cell = this.api.useTemplate(tmpl, {});
      await el.appendChild(cell);
    }
    this.api.forward(null, "shuffle");
    await sleep(2000);
    this.api.forward(null, "tickUpdate");
  }

  status(_event, el) {
    if (s.matches === 100) {
      el.innerHTML = "SOLID";
    } else {
      el.innerHTML = "NOT SOLID";
    }
  }

  async tickUpdate() {
    if (s.matches === 100) {
      await sleep(2000);
      this.api.forward(null, "shuffle");
      this.updateColors();
    }
    s.matches = 0;
    this.api.forward(null, "update");
    this.api.forward(null, "status");
    await sleep(s.sleep);
    this.tickUpdate();
  }

  async update(_event, el) {
    const checkColor = parseInt(el.dataset.color, 10);
    if (checkColor !== 0) {
      await sleep(randInt(0, s.sleep - 700));
      el.dataset.color = randInt(s.min, s.max);
    } else {
      el.classList.remove("padded");
      s.matches += 1;
    }
  }

  updateColors() {
    const c = randInt(0, 70) / 100;
    for (let color = 0; color < 4; color += 1) {
      const l = randInt(40, 80);
      const h = randInt(0, 360);
      document.documentElement.style.setProperty(
        `--color-${color}`,
        `oklch(${l}% ${c} ${h})`,
      );
    }
  }
};
