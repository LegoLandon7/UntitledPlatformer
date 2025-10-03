function update(dt) {
    // Dev camera controls
    const move = 100 * dt;

    if (keys["arrowdown"]) {
        camPos.y += move;
    }
    if (keys["arrowup"]) {
        camPos.y -= move;
    }
    if (keys["arrowleft"]) {
        camPos.x -= move;
    }
    if (keys["arrowright"]) {
        camPos.x += move;
    }
}