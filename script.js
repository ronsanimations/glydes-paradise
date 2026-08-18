let accessGranted = false;
const secretPassword = "MUSIC"; // Keep your secret password

while (!accessGranted) {
    let userPass = prompt("Welcome to Glyde's Paradise!\nEnter the secret password to play:");
    
    if (userPass === null) {
        document.body.innerHTML = "<h2 style='text-align:center; margin-top:40%; color:#ff60b5;'>Locked! Grab the key from the Discord channel next stream! 🎧</h2>";
        break;
    } else if (userPass.trim().toUpperCase() === secretPassword) {
        accessGranted = true;
    } else {
        alert("Incorrect key! Double-check the stream or server.");
    }
}

if (accessGranted) {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Map Settings (10 columns x 8 rows of tiles)
    const TILE_SIZE = 40;
    const MAP_COLS = 10;
    const MAP_ROWS = 8;

    // 0 = Empty floor (dark), 1 = Cute barrier/wall (pink block)
    const gameMap = [,
 ,
 ,
 ,
 ,
 ,
 ,
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    // Character Player
    let player = {
        x: 80,  // Start position X
        y: 80,  // Start position Y
        size: 14,
        speed: 4,
        color: "#ff60b5"
    };

    // Mobile Friendly Control Handling (Tracks screen presses)
    let moveDirection = null;

    // Clear background and draw map structures
    function drawMap() {
        for (let r = 0; r < MAP_ROWS; r++) {
            for (let c = 0; c < MAP_COLS; c++) {
                if (gameMap[r][c] === 1) {
                    ctx.fillStyle = "rgba(255, 96, 181, 0.15)"; // Translucent wall block
                    ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    ctx.strokeStyle = "#ff60b5";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                } else {
                    ctx.fillStyle = "#1e1e2a"; // Floor tile color
                    ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }

    // Check if the player is hitting a wall tile
    function checkCollision(nextX, nextY) {
        // Check 4 corners of character circle
        let points = [
            {x: nextX - player.size, y: nextY - player.size},
            {x: nextX + player.size, y: nextY - player.size},
            {x: nextX - player.size, y: nextY + player.size},
            {x: nextX + player.size, y: nextY + player.size}
        ];

        for (let p of points) {
            let cellX = Math.floor(p.x / TILE_SIZE);
            let cellY = Math.floor(p.y / TILE_SIZE);
            
            // Out of bounds or hitting a wall value (1)
            if (cellX < 0 || cellX >= MAP_COLS || cellY < 0 || cellY >= MAP_ROWS) return true;
            if (gameMap[cellY][cellX] === 1) return true;
        }
        return false;
    }

    // Touch handlers: Reading screen coordinates to guide movement
    window.addEventListener("touchstart", handleTouch, { passive: false });
    window.addEventListener("touchmove", handleTouch, { passive: false });
    window.addEventListener("touchend", () => { moveDirection = null; });

    // Click handlers for desktop testing
    window.addEventListener("mousedown", handleMouse);
    window.addEventListener("mouseup", () => { moveDirection = null; });

    function handleTouch(e) {
        e.preventDefault();
        let rect = canvas.getBoundingClientRect();
        let touchX = e.touches[0].clientX - rect.left;
        let touchY = e.touches[0].clientY - rect.top;
        calculateDirection(touchX, touchY);
    }

    function handleMouse(e) {
        let rect = canvas.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;
        calculateDirection(mouseX, mouseY);
    }

    function calculateDirection(targetX, targetY) {
        // Calculate position relative to player's current spot
        let deltaX = targetX - player.x;
        let deltaY = targetY - player.y;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            moveDirection = deltaX > 0 ? "RIGHT" : "LEFT";
        } else {
            moveDirection = deltaY > 0 ? "DOWN" : "UP";
        }
    }

    // Move player based on touch directions
    function updatePlayer() {
        let nextX = player.x;
        let nextY = player.y;

        if (moveDirection === "UP") nextY -= player.speed;
        if (moveDirection === "DOWN") nextY += player.speed;
        if (moveDirection === "LEFT") nextX -= player.speed;
        if (moveDirection === "RIGHT") nextX += player.speed;

        if (!checkCollision(nextX, nextY)) {
            player.x = nextX;
            player.y = nextY;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updatePlayer();
        drawMap();

        // Draw character (Cute glowing DJ avatar base)
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Instructional Tip Display
        ctx.fillStyle = "#ffffff99";
        ctx.font = "12px sans-serif";
        ctx.fillText("Press & slide side-to-side to wander", 20, 25);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
