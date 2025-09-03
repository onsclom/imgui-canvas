const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const uiState = {
  hovered: null as string | null, // last frames hovered
  nextHovered: null as string | null, // running hover on current frame

  mouseJustClicked: false,
  mouse: { x: 0, y: 0 },
  ctx: null as CanvasRenderingContext2D | null,

  theme: {
    hoveredBackground: "#777",
    unhoveredBackground: "#555",
    textColor: "#eee",
  },
};

document.body.addEventListener("mousemove", (e) => {
  uiState.mouse.x = e.clientX;
  uiState.mouse.y = e.clientY;
});
document.body.addEventListener("mousedown", (e) => {
  uiState.mouseJustClicked = true;
});

function registerUi(
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const hovered =
    uiState.mouse.x >= x &&
    uiState.mouse.x <= x + width &&
    uiState.mouse.y >= y &&
    uiState.mouse.y <= y + height;

  if (hovered) {
    uiState.nextHovered = id;
  }
}

function button(
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  const id = `button-${text}`;
  registerUi(id, x, y, width, height);

  const hovered = uiState.hovered === id;

  // draw button
  const ctx = uiState.ctx;
  if (ctx) {
    ctx.fillStyle = hovered
      ? uiState.theme.hoveredBackground
      : uiState.theme.unhoveredBackground;
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = uiState.theme.textColor;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x + width / 2, y + height / 2);
  }

  if (hovered) {
    uiState.hovered = id;
    return uiState.mouseJustClicked;
  }
  return false;
}

type Pointer<T> = { get: () => T; set: (v: T) => void };

function checkbox(
  label: string,
  x: number,
  y: number,
  size: number,
  pointerValue: Pointer<boolean>,
) {
  const id = `checkbox-${label}`;
  registerUi(id, x, y, size, size);

  const hovered = uiState.hovered === id;

  const clicked = hovered && uiState.mouseJustClicked;
  const prevChecked = pointerValue.get();
  if (clicked) {
    pointerValue.set(!prevChecked);
  }
  const checked = pointerValue.get();

  // TODO draw
  const ctx = uiState.ctx;
  if (ctx) {
    ctx.fillStyle = uiState.theme.unhoveredBackground;
    ctx.fillRect(x, y, size, size);
    if (checked) {
      ctx.fillStyle = uiState.theme.textColor;
      ctx.fillRect(x + size * 0.2, y + size * 0.2, size * 0.6, size * 0.6);
    }
    ctx.fillStyle = uiState.theme.textColor;
    ctx.font = "16px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + size + 8, y + size / 2);
  }
}

function startUi(ctx: CanvasRenderingContext2D) {
  uiState.ctx = ctx;
}

function endUi() {
  uiState.hovered = uiState.nextHovered;
  uiState.nextHovered = null;
  uiState.mouseJustClicked = false;
}

const buttonWidth = 150;
const buttonHeight = 40;
function generateRandomButtons() {
  return Array.from({ length: 10 }).map((_, i) => ({
    text: `Button ${i + 1}`,
    x: Math.random() * 200 + 100,
    y: Math.random() * 200 + 100,
    width: buttonWidth,
    height: buttonHeight,
  }));
}
let randomButtons = generateRandomButtons();

(function tick() {
  const ctx = canvas.getContext("2d")!;
  const canvasRect = canvas.getBoundingClientRect();

  startUi(ctx);

  {
    // support high-dpi screens
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }

  {
    // background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
  }

  for (const btn of randomButtons) {
    if (button(btn.text, btn.x, btn.y, btn.width, btn.height)) {
      console.log("clicked", btn.text);
    }
  }

  if (button("randomize buttons", 20, 20, buttonWidth, buttonHeight)) {
    randomButtons = generateRandomButtons();
  }

  endUi();

  requestAnimationFrame(tick);
})();
