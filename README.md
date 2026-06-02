# delta-web-task-2

# DArk : Echo Sector

- This is my code for task 2 of delta inductions 2026(WEB DEVELOPMENT)

- DArk : Echo Sector is a top-down combat game built using HTML, CSS, JavaScript, and the HTML Canvas API.

## Features

### Player

* WASD movement
* Mouse aiming
* Mouse shooting
* Health system
* Score tracking

### Enemies

* Enemy bots with health
* Idle, Chase, Attack, and Death states
* Player detection and combat

### Combat System

* Projectile shooting
* Enemy damage system
* Player damage system
* Bullet collision detection

### Room System

* Multiple rooms
* Door-based room transitions
* Different enemy counts per room

### HUD

* Health display
* Score display
* Timer display
* Current room display
* Enemy count display

### Controls

| Key        | Action         |
| ---------- | -------------- |
| W          | Move Up        |
| A          | Move Left      |
| S          | Move Down      |
| D          | Move Right     |
| Mouse      | Aim            |
| Left Click | Shoot          |
| P          | Pause / Resume |
| R          | Restart Game   |



## Rendering Flow

The game is rendered using the HTML Canvas API.

Rendering order:

1. Clear canvas
2. Draw walls
3. Draw doors
4. Draw player
5. Draw enemies
6. Draw bullets
7. Draw HUD
8. Draw room information



## Game Loop Structure

The game uses a continuous game loop:

main_game_loop()

The loop performs:

* Player updates
* Enemy updates
* Bullet updates
* Collision checks
* Rendering
* Win/Lose checks

The loop runs using:

requestAnimationFrame()



## State Management

Game state is stored using global variables:

* player
* enemies
* bullets
* score
* gameTimer
* currentRoom
* gameOver

Player position is stored in:

* player_position_x
* player_position_y

---

## Collision Detection

The game uses rectangle-based collision detection (AABB).

Collision checks include:

* Player vs Wall
* Player vs Enemy
* Bullet vs Enemy
* Player vs Door
* Bullet vs Wall



