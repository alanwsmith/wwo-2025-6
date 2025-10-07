const cellTmpl = `<div 
data-num="NUM" data-color="COLOR"
data-receive="update"></div>`;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class State {
  constructor() {
    this.matches = 0;
    this.targetColor = randomInt(0, 4);
  }
}
const s = new State();

window.PageContent = class {
  async start(_event, el) {
    for (let c = 0; c < 100; c += 1) {
      const fr = {
        "NUM": c,
        "COLOR": randomInt(0, 2),
      };
      const cell = this.api.useTemplate(cellTmpl, fr);
      el.appendChild(cell);
    }
    await sleep(2000);
    this.api.forward(null, "tickUpdate");
  }

  status(_event, el) {
    el.innerHTML = "UPDATED";
  }

  async tickUpdate() {
    s.matches = 0;
    this.api.forward(null, "update");
    this.api.forward(null, "status");
    await sleep(2000);
    this.tickUpdate();
  }

  update(_event, el) {
    console.log(el.dataset.color);
    console.log(el.dataset.num);
  }
};
