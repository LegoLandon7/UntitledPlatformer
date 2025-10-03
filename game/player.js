export function update(dt) {
    // Dev camera controls
    if (keys["arrowdown"]) {
        camPos.y += 1 * dt;
    }
    if (keys["arrowup"]) {
        camPos.y -= 1 * dt;
    }
    if (keys["arrowleft"]) {
        camPos.x -= 1 * dt;
    }
    if (keys["arrowright"]) {
        camPos.x += 1 * dt;
    }

    // else camPos = playerPos;
}