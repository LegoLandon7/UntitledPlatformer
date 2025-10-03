function update() {
    // Dev camera controls
    if (keys["arrowdown"]) {
        camPos.y += 1;
    }
    if (keys["arrowup"]) {
        camPos.y -= 1;
    }
    if (keys["arrowleft"]) {
        camPos.x -= 1;
    }
    if (keys["arrowright"]) {
        camPos.x += 1;
    }

    // else camPos = playerPos;
}