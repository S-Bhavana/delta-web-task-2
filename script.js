const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: 200,
    y: 200,
    width: 40,
    height: 40,
    speed: 5,
    health: 100
};

let enemies = [];

let bullets = [];
let loot = [];
let score = 0;
let currency = 0;
let gameTimer = 120;

let wall = {
    x: 350,
    y: 200,
    width: 200,
    height: 40
};

let door = {
    x: canvas.width - 80,
    y: canvas.height/2 - 50,
    width: 50,
    height: 100
};

let gameOver = false;
let isPaused = false;
let gameWon = false;

let speedBoostActive = false;
let speedBoostTimer = 0;
let shopOpen = false;

let currentRoom = 1;
let player_position_x = 0;
let player_position_y = 0;

let keys = {};
let mouseX = 0;
let mouseY = 0;

document.addEventListener("keydown", function(event) {

    keys[event.key.toLowerCase()] = true;

    if(event.key.toLowerCase() === "p"){
        isPaused = !isPaused;
    }

    if(event.key.toLowerCase() === "b"){
    shopOpen = !shopOpen;
}

    if(event.key.toLowerCase() === "r" && gameOver || gameWon){
    restartGame();
}

if(shopOpen){

    if(event.key === "1"){

        if(currency >= 20){

            currency -= 20;

            player.health += 20;

            if(player.health > 100){
                player.health = 100;
            }
        }
    }

    if(event.key === "2"){

        if(currency >= 30){

            currency -= 30;

            player.speed += 1;
        }
    }

    if(shopOpen){

    if(event.key === "3"){

        if(currency >= 40){

            currency -= 40;

            speedBoostActive = true;

            speedBoostTimer = 600;

            player.speed = 10;
        }
    }
}
}

});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

canvas.addEventListener("mousemove", function(event){

    mouseX = event.clientX;
    mouseY = event.clientY;

});

canvas.addEventListener("click", function(){

    let dx = mouseX - player.x;
    let dy = mouseY - player.y;

    let distance =
        Math.sqrt(dx*dx + dy*dy);

    bullets.push({

        x: player.x + 20,
        y: player.y + 20,

        vx: (dx/distance) * 8,
        vy: (dy/distance) * 8,

        size: 8

    });

});

setInterval(function(){

    if(!gameOver){
        gameTimer--;
    }

},1000);

function drawPlayer() {
    ctx.fillStyle = "blue";
    ctx.fillRect( player.x,  player.y, player.width, player.height);
}

function drawEnemies(){

    for(let enemy of enemies){

          if(enemy.state === "dead"){
            continue;
        }

        ctx.fillStyle = "red";

        ctx.fillRect( enemy.x, enemy.y, enemy.width, enemy.height);

        ctx.fillStyle = "white";
        ctx.font = "12px Arial";

        ctx.fillText( enemy.state, enemy.x, enemy.y - 10);
    }

}

function drawWall(){

    ctx.fillStyle = "gray";

    ctx.fillRect( wall.x, wall.y, wall.width, wall.height);

}

function drawDoor(){

     let aliveEnemies = enemies.filter(e => e.state !== "dead");

    if(aliveEnemies.length > 0){

        ctx.fillStyle = "red";

    }
    else{

    ctx.fillStyle = "green";
    }

    ctx.fillRect( door.x, door.y,  door.width, door.height );

}

function updateEnemies(){

    for(let enemy of enemies){

if(enemy.health <= 0 && enemy.state !== "dead"){

    enemy.state = "dead";

    score += 10;
    currency += 5;

     loot.push({
        x: enemy.x,
        y: enemy.y,
        value: 10
    });
    console.log("Loot Dropped");
}

if(enemy.state === "dead"){
    continue;
}

        // Skip dead enemies
        if(enemy.health <= 0){
            enemy.state = "dead";
            continue;
        }

        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;

        let distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if(enemy.state === "idle"){

    if(distance < 300){
        enemy.state = "alert";
        enemy.timer = 0;
    }
}

if(enemy.state === "alert"){

    enemy.timer++;

    if(enemy.timer > 60){
        enemy.state = "chase";
    }
}

        // Chase player

        if(enemy.state === "idle"){

    if(distance < 250){
        enemy.state = "chase";
    }
}

else if(enemy.state === "chase"){

    enemy.x += dx / distance;
    enemy.y += dy / distance;

}

   // Attack player when touching
        if(
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ){
            player.health -= 0.2;
        }
    }
}

function updateBullets(){

    for(let bullet of bullets){

        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        for(let enemy of enemies){

    if(enemy.state === "dead") continue;

    if(
    bullet.x < wall.x + wall.width &&
    bullet.x + bullet.size > wall.x &&
    bullet.y < wall.y + wall.height &&
    bullet.y + bullet.size > wall.y
){
    bullet.vy = -bullet.vy;
}

    if(
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.size > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.size > enemy.y
    ){

        enemy.health -= 10;

        bullet.x = -1000;
        bullet.y = -1000;
    
    }

}

    }

}

function drawBullets(){

    ctx.fillStyle = "yellow";

    for(let bullet of bullets){

        ctx.fillRect( bullet.x, bullet.y, bullet.size, bullet.size);

    }

}

function drawLoot(){

    console.log(loot.length);

    ctx.fillStyle = "gold";

    for(let item of loot){

        ctx.beginPath();

        ctx.arc( item.x, item.y, 10, 0, Math.PI * 2 );

        ctx.fill();
    }
}

function updateLoot(){

    for(let i = loot.length - 1; i >= 0; i--){

        let item = loot[i];

        if(

            player.x < item.x + 10 &&
            player.x + player.width > item.x &&
            player.y < item.y + 10 &&
            player.y + player.height > item.y

        ){

            currency += item.value;

            loot.splice(i,1);
        }
    }
}

function drawHUD(){

    ctx.fillStyle = "white";

    ctx.font = "24px Arial";
    
    ctx.fillText(
        "Player Health: " + Math.floor(player.health),
        20,
        30
    );

    ctx.fillText( "Enemies Alive: " +  enemies.filter(e => e.state !== "dead").length,  20,  60);

    ctx.fillText( "Score: " + score, 20, 90);

    ctx.fillText( "X: " + Math.floor(player_position_x), 20, 120);

    ctx.fillText("Y: " + Math.floor(player_position_y),20,150 );

    ctx.fillText("Time: " + gameTimer,20,210);

    ctx.fillText("Currency: " + currency,20,270);

    ctx.fillText("Speed Boost: " + (speedBoostActive ? "ON" : "OFF"),20,300);

    console.log(player_position_x, player_position_y);

}

function drawRoomText(){

    ctx.fillStyle = "white";

    ctx.font = "30px Arial";

    ctx.fillText("Room " + currentRoom, canvas.width - 180, 40);

}

function drawShop(){

    if(!shopOpen){
        return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(150,100,500,300);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";

    ctx.fillText( "SHOP", 320, 150);

    ctx.font = "20px Arial";

    ctx.fillText("1 - Heal +20 HP (20 Coins)",180,220);

    ctx.fillText( "3 - Speed Boost (40 Coins)", 180, 320);
    ctx.fillText("2 - Speed Upgrade (30 Coins)",180,270);

    ctx.fillText("Currency: " + currency,180,330);
}

function updatePlayer() {

    let oldX = player.x;
    let oldY = player.y;

    if (keys["w"]) {
        player.y -= player.speed;
    }

    if (keys["s"]) {
        player.y += player.speed;
    }

    if (keys["a"]) {
        player.x -= player.speed;
    }

    if (keys["d"]) {
        player.x += player.speed;
    }

    if(
        player.x < wall.x + wall.width &&
        player.x + player.width > wall.x &&
        player.y < wall.y + wall.height &&
        player.y + player.height > wall.y
    ){
        player.x = oldX;
        player.y = oldY;
    }


    if(

    player.x < door.x + door.width &&
    player.x + player.width > door.x &&
    player.y < door.y + door.height &&
    player.y + player.height > door.y
){

    currentRoom++;

    player.x = 100;
    player.y = 100;

}
    player_position_x = player.x;
    player_position_y = player.y;
}

function darkSpaceVector_add(a,b){
    return a + b;
}

function darkSpaceVector_subtract(a,b){
    return a - b;
}

function darkSpaceVector_normalize(value,max){
    return value / max;
}

   function spawnEnemies(){

    enemies = [];

    let count = rooms[currentRoom - 1].enemyCount;

    for(let i = 0; i < count; i++){

        enemies.push({

            x: 200 + Math.random() * 500,
            y: 100 + Math.random() * 300,

            width: 40,
            height: 40,

            health: 100,

            state: "idle",

            timer: 0
        });
    }
}

function main_game_loop() {

    let aliveEnemies = enemies.filter(enemy => enemy.state !== "dead");

if(aliveEnemies.length === 0){

    gameWon = true;

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "lime";
    ctx.font = "50px Arial";

    ctx.fillText("YOU WIN",canvas.width/2 - 120,canvas.height/2
    );

     ctx.fillText( "Final Score: " + score, canvas.width/2 - 100, canvas.height/2 + 60);

    requestAnimationFrame(main_game_loop);

 return;
}

    if(player.health <= 0){
    gameOver = true;
}

if(gameTimer <= 0){
    gameOver = true;
}

if(gameOver){

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";

    ctx.fillText( "GAME OVER", canvas.width/2 - 150, canvas.height/2);

     ctx.font = "25px Arial";

      ctx.fillText("Final Score: " + score,canvas.width/2 - 80,canvas.height/2 + 50 );

ctx.fillText( "Press R To Restart", canvas.width/2 - 120, canvas.height/2 + 90);
    requestAnimationFrame(main_game_loop);
    return;
}

if(isPaused){

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";

    ctx.fillText("PAUSED", canvas.width/2 - 100,  canvas.height/2);

    requestAnimationFrame(main_game_loop);
    return;
}

 ctx.clearRect( 0, 0, canvas.width, canvas.height);

    if(speedBoostActive){

    speedBoostTimer--;

    if(speedBoostTimer <= 0){

        speedBoostActive = false;

        player.speed = 5;
    }
}

    updatePlayer();
    updateEnemies();
    updateBullets();
    updateLoot();

    drawWall();
    drawDoor();

    drawPlayer();
    drawEnemies();
    drawBullets();
    drawLoot();
    drawHUD();
    drawRoomText();
    drawShop();

    requestAnimationFrame(main_game_loop);
}

function restartGame(){

    player.health = 100;

    score = 0;
    currency = 0;

    gameTimer = 120;

    currentRoom = 1;

    gameOver = false;
    gameWon = false;

    player.x = 200;
    player.y = 200;

    spawnEnemies();
}

let rooms = [

{
    enemyCount: 2
},

{
    enemyCount: 3
},

{
    enemyCount: 4
}

];
spawnEnemies();
main_game_loop();
