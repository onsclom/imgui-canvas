import * as UI from "./ui";

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const buttonWidth = 150;
const buttonHeight = 40;

const buttonsArea = {
  x: 20,
  y: 110,
  width: 200 + buttonWidth,
  height: 200 + buttonHeight,
};

function generateRandomButtons() {
  return Array.from({ length: 10 }).map((_, i) => ({
    text: `Button ${i + 1}`,
    x: Math.random() * (buttonsArea.width - buttonWidth) + buttonsArea.x,
    y: Math.random() * (buttonsArea.height - buttonHeight) + buttonsArea.y,
    dx: Math.random() * 2 - 1,
    dy: Math.random() * 2 - 1,
    width: buttonWidth,
    height: buttonHeight,
  }));
}

const state = {
  randomButtons: generateRandomButtons(),
  animateButtons: false,
  events: [] as string[],
};

let lastTime = performance.now();
(function tick() {
  console.time("tick");
  const now = performance.now();
  const dt = now - lastTime;
  lastTime = now;

  const ctx = canvas.getContext("2d")!;
  const canvasRect = canvas.getBoundingClientRect();

  UI.start(ctx);

  {
    // support high-dpi screens
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  {
    // background
    ctx.fillStyle = "#777";
    ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
  }

  for (const btn of state.randomButtons) {
    if (state.animateButtons) {
      btn.x += btn.dx * dt * 0.1;
      btn.y += btn.dy * dt * 0.1;
      if (
        btn.x < buttonsArea.x ||
        btn.x + btn.width > buttonsArea.x + buttonsArea.width
      ) {
        btn.dx *= -1;
        btn.x = Math.max(btn.x, buttonsArea.x);
        btn.x = Math.min(btn.x, buttonsArea.x + buttonsArea.width - btn.width);
      }
      if (
        btn.y < buttonsArea.y ||
        btn.y + btn.height > buttonsArea.y + buttonsArea.height
      ) {
        btn.dy *= -1;
        btn.y = Math.max(btn.y, buttonsArea.y);
        btn.y = Math.min(
          btn.y,
          buttonsArea.y + buttonsArea.height - btn.height,
        );
      }
    }

    if (UI.button(btn.text, btn.x, btn.y, btn.width, btn.height)) {
      console.log("clicked", btn.text);
      state.events.push(`clicked ${btn.text}`);
    }
  }

  if (UI.button("randomize buttons", 20, 20, buttonWidth, buttonHeight)) {
    state.randomButtons = generateRandomButtons();
  }

  UI.checkbox(
    "animate buttons",
    20,
    80,
    20,
    UI.reference(state, "animateButtons"),
  );

  UI.window("test window", 300, 200, 200, 200, () => {
    if (UI.button("click me", 10, 10, 100, 30)) {
      state.events.push("first window button clicked");
    }
  });

  UI.window("events", 550, 200, 200, 200, () => {
    ctx.fillStyle = UI.state.theme.textColor;
    ctx.font = UI.state.theme.font;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    for (let i = 0; i < state.events.length; i++) {
      const text = state.events[i]!;
      ctx.fillText(text, 10, 10 + i * 20);
    }
  });

  UI.end(dt);

  console.timeEnd("tick");
  requestAnimationFrame(tick);
})();
