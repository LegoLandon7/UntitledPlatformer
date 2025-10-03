//#region Settings

const tileSize = 32;
const zoom = 1;

//#endregion

//#region Keys

const keys = {};

window.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    // Prevent arrow key normal behavior
    if (["arrowup","arrowdown","arrowleft","arrowright"].includes(e.key.toLowerCase())) {
        e.preventDefault();
    }
});

window.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});

//#endregion

//#region HTML

// Canvas
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

// Labels
fpsLabel = document.getElementById("fps");

//#endregion

//#region Screen

let internalWidth, internalHeight;

function updateDimensions() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Keep drawing buffer in sync with display size
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    internalWidth = Math.floor(canvas.width);
    internalHeight = Math.floor(canvas.height);

    // Zooming
    let zoomX = internalWidth / (20 * tileSize);
    let zoomY = internalHeight / (15 * tileSize);

    zoom = Math.min(zoomX, zoomY);

}

window.addEventListener("resize", updateDimensions);
updateDimensions();

//#endregion

//#region Classes

class vec2 {
    // Point 2d class
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Add
    add(p) {
        if (p instanceof vec2) return new vec2(this.x + p.x, this.y + p.y);
        else return new vec2(this.x + p, this.y + p);
    }

    // Subtract
    sub(p) {
        if (p instanceof vec2) return new vec2(this.x - p.x, this.y - p.y);
        else return new vec2(this.x - p, this.y - p);
    }

    // Multiply
    mul(p) {
        if (p instanceof vec2) return new vec2(this.x * p.x, this.y * p.y);
        else return new vec2(this.x * p, this.y * p);
    }

    // Divide
    div(p) {
        if (p instanceof vec2) return new vec2(this.x / p.x, this.y / p.y);
        else return new vec2(this.x / p, this.y / p);
    }

    // Distance
    distanceTo(p) { return Math.hypot(this.x - p.x, this.y - p.y); }

    // Length
    length() { return Math.hypot(this.x, this.y); }

    // Normal
    normalize() {
        let len = this.length();
        if (len === 0) return new vec2(0, 0);
        return this.mul(1 / len);
    }

    // Rotate by angle (radians)
    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new vec2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    // Dot product
    dot(p) { return this.x * p.x + this.y * p.y; }
}

// Variables
camPos = new vec2(0, 0);
playerPos = new vec2(0, 0);

class CollisionBox {
    // Collision box
    constructor(offset = new vec2(), shape = "rect", width = 0, height = 0, radius = 0) {
        this.offset = offset; // Offset from parent position
        this.shape = shape;   // "rect" or "circle"
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.pos = new vec2(); // Actual world position
    }

    // Sync position from parent
    updateFromParent(parent) {
        this.pos = parent.pos.add(this.offset);
    }

    // Collision
    collidesWith(collider) {
        if (this.shape === "rect" && collider.shape === "rect") {
            // Rectangle - Rectangle
            return (
                this.pos.x < collider.pos.x + collider.width &&
                this.pos.x + this.width > collider.pos.x &&
                this.pos.y < collider.pos.y + collider.height &&
                this.pos.y + this.height > collider.pos.y
            );
        } else if (this.shape === "circle" && collider.shape === "circle") {
            // Circle - Circle
            let dist = this.pos.distanceTo(collider.pos);
            return dist < (this.radius + collider.radius);
        } else if (
            (this.shape === "rect" && collider.shape === "circle") ||
            (this.shape === "circle" && collider.shape === "rect")
        ) {
            // Rectangle - Circle
            let rect = this.shape === "rect" ? this : collider;
            let circle = this.shape === "circle" ? this : collider;

            let closeX = Math.max(rect.pos.x, Math.min(circle.pos.x, rect.pos.x + rect.width));
            let closeY = Math.max(rect.pos.y, Math.min(circle.pos.y, rect.pos.y + rect.height));

            let distX = circle.pos.x - closeX;
            let distY = circle.pos.y - closeY;

            return (distX * distX + distY * distY) < (circle.radius * circle.radius);
        } else {
            // Unsupported shape combination
            console.error(`Cannot collide shapes: ${this.shape} vs ${collider.shape}`);
            return false;
        }
    }
}

// GameObject class
class GameObject {
    constructor(x = 0, y = 0, texture = "resources/blank.png", collisionBox = null) {
        // World position (tile -> pixel)
        this.pos = new vec2(x * tileSize, y * tileSize);

        // Collision box
        this.collisionBox = collisionBox;
        if (this.collisionBox) this.collisionBox.updateFromParent(this);

        // Texture
        this.texture = new Image();
        this.texture.src = texture;
        this.loaded = false;
        this.texture.onload = () => {
            this.loaded = true;
            this.updateCollisionBox();
        };
    }

    // Update collision box to match current position
    updateCollisionBox() {
        if (this.collisionBox) this.collisionBox.updateFromParent(this);
    }

    // Check collision with another GameObject
    collidesWith(other) {
        this.updateCollisionBox();
        other.updateCollisionBox();
        if (this.collisionBox && other.collisionBox) {
            return this.collisionBox.collidesWith(other.collisionBox);
        }
        return false;
    }

    // Draw the object
    draw(ctx) {
    // Scale
    const drawX = (this.pos.x - camPos.x) * zoom;
    const drawY = (this.pos.y - camPos.y) * zoom;
    const drawW = this.texture.width * zoom;
    const drawH = this.texture.height * zoom;

    // Culling
    if (
        drawX + drawW > 0 &&
        drawX < internalWidth &&
        drawY + drawH > 0 &&
        drawY < internalHeight
    ) {
        if (this.loaded) {
            // Draw
            ctx.drawImage(this.texture, drawX, drawY, drawW, drawH);
        }
    }
}

}

/*
Example object initialization ->

let ball = new GameObject(
    1, 1, "ball.png",
    new CollisionBox(new vec2(16,16), "circle", 0, 0, 16) // circle radius 16
);

let crate = new GameObject(
    2, 1, "crate.png",
    new CollisionBox(new vec2(8,8), "rect", 48, 48) // rect width & height 48
);
*/

// GridMap class
class GridMap {
    map = [];

    static objectCount = 0;

    update() {
        GridMap.objectCount = this.map.length;
    }
    // Add object
    add(obj) {
        this.map.push(obj);
        this.update();
    }

    // Remove object
    remove(obj) {
        const idx = this.map.indexOf(obj);
        if (idx !== -1) this.map.splice(idx, 1);
        this.update();
    }

    // Draw all objects
    drawAll(ctx) {
        for (let obj of this.map) {
            obj.draw(ctx);
        }
    }
}

//#endregion

//#region Map

let mainMap = new GridMap();

//test
const groundWidth = 100;
const groundHeight = 5;

// CHAT GPT FOR TESTING ->

// Loop over each column
const groundTop = 5; // height of the grass "surface" in tiles

for (let x = 0; x < groundWidth; x++) {
    for (let y = 0; y < groundHeight; y++) {
        let texture;
        if (y === groundTop) {
            texture = "resources/grass.png"; // grass at the surface
        } else if (y > groundTop) {
            texture = "resources/dirt.png"; // everything below is dirt
        } else {
            continue; // skip air above
        }

        let block = new GameObject(x, y, texture);
        mainMap.add(block);
    }
}

// Draw all blocks
mainMap.drawAll(ctx);

//#endregion

//#region Game

// code code code more code

//#endregion