// Initialize player
let playerObject = new GameObject(new vec2(1, -1), "resources/player.png",
     new CollisionBox(new vec2(0, 0), "rect", tileSize, tileSize));

function update(dt) {
    /* Dev camera controls
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
    */
    if (keys["arrowdown"]) {
        playerPos.y += move;
    }
    if (keys["arrowup"]) {
        playerPos.y -= move;
    }
    if (keys["arrowleft"]) {
        playerPos.x -= move;
    }
    if (keys["arrowright"]) {
        playerPos.x += move;
    }

    playerPos = camPos;
    playerObject.pos = playerPos.convertToTiles();
    playerObject.draw(ctx);
}