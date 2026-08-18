let accessGranted = false;
const secretPassword = "MUSIC"; // Change this to your chosen password

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

    let player = { x: 50, y: 150, radius: 12, velocity: 0, gravity: 0.4, jump: -6 };
    let notes = [];
    let score = 0;
    let gameActive = true;
    let spawnTimer = 0;

    window.addEventListener("touchstart", function(e) {
        if (!gameActive) resetGame();
        else player.velocity = player.jump;
    }, { passive: true });

    window.addEventListener("mousedown", function(e) {
        if (gameActive) player.velocity = player.jump;
        else resetGame();
    });

    function resetGame() {
        player.y = 150;
        player.velocity = 0;
        notes = [];
        score = 0;
        gameActive = true;
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (gameActive) {
            player.velocity += player.gravity;
            player.y += player.velocity;

            if (player.y + player.radius > canvas.height) {
                player.y = canvas.height - player.radius;
                gameActive = false;
            }
            if (player.y - player.radius < 0) {
                player.y = player.radius;
                player.velocity = 0;
            }

            spawnTimer++;
            if (spawnTimer % 90 === 0) {
                let gapY = Math.random() * (canvas.height - 100) + 20;
                notes.push({ x: canvas.width, y: gapY, radius: 10, passed: false });
            }

            for (let i = notes.length - 1; i >= 0; i--) {
                notes[i].x -= 2.5;

                ctx.beginPath();
                ctx.arc(notes[i].x, notes[i].y, notes[i].radius, 0, Math.PI * 2);
                ctx.fillStyle = "#00f0ff";
                ctx.fill();
                ctx.closePath();

                let distX = player.x - notes[i].x;
                let distY = player.y - notes[i].y;
                let distance = Math.sqrt(distX * distX + distY * distY);

                if (distance < player.radius + notes[i].radius) {
                    gameActive = false;
                }

                if (!notes[i].passed && notes[i].x < player.x) {
                    notes[i].passed = true;
                    score++;
                }

                if (notes[i].x < -20) notes.splice(i, 1);
            }
        }

        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ff60b5";
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText("Score: " + score, 20, 30);

        if (!gameActive) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.fillStyle = "#ff60b5";
            ctx.font = "bold 24px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("GG! Stream Over", canvas.width / 2, canvas.height / 2 - 10);
            
            ctx.fillStyle = "#fff";
            ctx.font = "14px sans-serif";
            ctx.fillText("Tap screen to drop the beat again", canvas.width / 2, canvas.height / 2 + 25);
            ctx.textAlign = "left";
        }

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
}
