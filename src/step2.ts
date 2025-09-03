const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const uiState = {
  hovered: null as string | null,

  mouseJustClicked: false,
  mouse: { x: 0, y: 0 },
  ctx: null as CanvasRenderingContext2D | null,

  theme: {
    // borderColor: "#333",
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

function button(
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
): boolean {
  const id = `button-${text}`;
  const hovered =
    uiState.mouse.x >= x &&
    uiState.mouse.x <= x + width &&
    uiState.mouse.y >= y &&
    uiState.mouse.y <= y + height;

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

(function tick() {
  const ctx = canvas.getContext("2d")!;
  const canvasRect = canvas.getBoundingClientRect();

  {
    // setup ui state
    uiState.ctx = ctx;
  }

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

  // app ui stuff here
  {
    // red square with text
    const rect = { width: 100, height: 100 };
    ctx.fillStyle = "red";
    ctx.fillRect(
      (canvasRect.width - rect.width) / 2,
      (canvasRect.height - rect.height) / 2,
      rect.width,
      rect.height,
    );
    ctx.fillStyle = "white";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Hello world!", canvasRect.width / 2, canvasRect.height / 2);
  }

  if (button("Click me!", 20, 20, 100, 40)) {
    console.log("clicked");
  }

  {
    // reset ui state
    uiState.mouseJustClicked = false;
  }

  requestAnimationFrame(tick);
})();
