// Improved gameplay mechanics and sound handling
let move_speed = 3, gravity = 0.5;
let fish_dy = 0;
let fish = document.querySelector('.fish');
let img = document.getElementById('fish-1');
let sound_point = new Audio('sounds/point.mp3');
let sound_die = new Audio('sounds/die.mp3');

let fish_props = fish.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
img.style.display = 'none';

let high_score = localStorage.getItem('highScore') || 0;
document.getElementById('high-score-display').innerText = high_score;

const bgMusic = document.getElementById('bg-music');
const muteButton = document.getElementById('mute-button');
const muteButtonGameOver = document.getElementById('mute-button-gameover');

// Play background music on interaction
document.addEventListener('click', () => {
    if (bgMusic.paused) {
        bgMusic.play(); 
    }
});

muteButton.disabled = false;

// Start game logic
document.querySelector('.start-button').addEventListener('click', () => {
    document.getElementById('start-modal').style.display = 'none';
    img.style.display = 'block';
    fish.style.top = '40vh';
    game_state = 'Play';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    play();
    bgMusic.play();
    muteButton.disabled = false;
});

// Toggle mute functionality
function toggleMute(button) {
    if (bgMusic.muted) {
        bgMusic.muted = false;
        button.textContent = 'Mute';
    } else {
        bgMusic.muted = true;
        button.textContent = 'Unmute';
    }
}

muteButton.addEventListener('click', () => toggleMute(muteButton));
muteButtonGameOver.addEventListener('click', () => toggleMute(muteButtonGameOver));

// Handle jump action
function handleJump() {
    if (game_state === 'Play') {
        fish_dy = -7.6;
    }
}

document.addEventListener('click', handleJump);
document.addEventListener('touchstart', handleJump);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') handleJump();
});

// End game logic
function endGame() {
    game_state = 'End';
    sound_die.play(); // Ensure the die sound is played when the game ends
    document.getElementById('final-score').innerText = score_val.innerHTML;
    if (parseInt(score_val.innerHTML) > high_score) {
        high_score = parseInt(score_val.innerHTML);
        localStorage.setItem('highScore', high_score);
    }
    document.getElementById('high-score').innerText = high_score;
    document.getElementById('game-over-modal').style.display = 'flex';
}

document.querySelector('.play-again-button').addEventListener('click', () => {
    document.getElementById('game-over-modal').style.display = 'none';
    window.location.reload();
});

// Main game loop
function play() {
    function move() {
        if (game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            fish_props = fish.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (fish_props.left < pipe_sprite_props.left + pipe_sprite_props.width && fish_props.left + fish_props.width > pipe_sprite_props.left && fish_props.top < pipe_sprite_props.top + pipe_sprite_props.height && fish_props.top + fish_props.height > pipe_sprite_props.top) {
                    img.style.display = 'none';
                    sound_die.play();
                    endGame();
                    return;
                } else {
                    if (pipe_sprite_props.right < fish_props.left && pipe_sprite_props.right + move_speed >= fish_props.left && element.increase_score == '1') {
                        score_val.innerHTML = +score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    function apply_gravity() {
        if (game_state != 'Play') return;
        fish_dy += gravity;

        if (fish_props.top <= 0 || fish_props.bottom >= background.bottom) {
            sound_die.play(); // Play die sound when the fish hits the ground
            endGame();
            return;
        }
        fish.style.top = fish_props.top + fish_dy + 'px';
        fish_props = fish.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 25; 

    function create_pipe() {
        if (game_state != 'Play') return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

// Handle offline and online states
window.addEventListener('offline', () => {
    document.getElementById('offline-error').style.display = 'block';
});

window.addEventListener('online', () => {
    document.getElementById('offline-error').style.display = 'none';
});