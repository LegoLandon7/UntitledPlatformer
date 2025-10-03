// Initialize player
playerObject = new GameObject(1, -1, "player.png",
     new CollisionBox(new vec2(0, 0), "rect", tileSize, tileSize));

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

    playerObject.pos = camPos;
    playerObject.draw(ctx);
}