/*
"game" loop setup:
- handling high dpi
- using raf
- centering a "div" using math
*/

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

(function tick() {
  const ctx = canvas.getContext("2d")!;
  const canvasRect = canvas.getBoundingClientRect();

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

  requestAnimationFrame(tick);
})();
