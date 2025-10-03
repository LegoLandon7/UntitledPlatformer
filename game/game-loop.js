let lastTime = performance.now(); // store initial time
let fps = 0;

function gameLoop(currentTime) {
    // Calculate Delta
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Calculate FPS
    fps = 1 / delta;

    // Show FPS
    fpsLabel.textContent = "FPS: " + Math.round(fps);

    //#region Logic

    update();
    
    // Draw map
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    mainMap.drawAll(ctx);

    //#endregion

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);