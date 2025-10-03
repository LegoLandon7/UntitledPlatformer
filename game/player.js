// Initialize player
let playerObject = new GameObject(new vec2(1, -1), "resources/player.png",
     new CollisionBox(new vec2(0, 0), "rect", tileSize, tileSize));

function update(dt) {
    const move = 350 * dt;

    let grav = 0;

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

    // set camera relative to player
    camPos.x = playerPos.x - internalWidth / (2 * zoom);
    camPos.y = playerPos.y - internalHeight / (2 * zoom);

    // draw player
    playerObject.pos = playerPos;
    playerObject.draw(ctx);
}