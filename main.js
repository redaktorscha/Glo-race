const score = document.createElement('div'),
    start = document.querySelector('.start'),
    game = document.querySelector('.game'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div'),
    sound = document.createElement('div');

car.classList.add('car');
score.classList.add('score');
sound.classList.add('sound');


start.addEventListener('click', (e) => startGame(e));

document.addEventListener('keydown', (e) => startRun(e));
document.addEventListener('keyup', (e) => stopRun(e));

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
}

const setting = {
    start: false,
    score: 0,
    //speed: 3,
    enemies: 5,
    traffic: 3,
    bestScore: parseInt(localStorage.getItem('bestScore')),
}



function getQuantityElements(heightElement) {
    return Math.floor(document.documentElement.clientHeight / heightElement);
}

function getRandImg() {
    let randInt = Math.floor(Math.random() * setting.enemies);
    let url = `en${randInt}.png`;
    return `transparent url('./image/${url}') center / cover no-repeat`;
}

function startGame(event) {
    let levelBtn = event.target;
    setting.speed = +levelBtn.id;

    start.classList.add('hide');
    gameArea.classList.remove('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(80) - 1; i++) { //вот тут одна из полосок получалась слишком длинной (видимо, одна лишняя)

        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 103) + 'px';
        line.y = i * 103;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.top = enemy.y + 'px';
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        let img = getRandImg();
        //console.log(img);
        enemy.style.background = img;
        //enemy.style.background = `transparent url('./image/en.png') center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.top = 'auto';
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.bottom = 10 + 'px';
    game.appendChild(score);
    game.appendChild(sound);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    playMusic();
    requestAnimationFrame(playGame);
};

function playGame() {

    if (setting.start) {
        setting.score += setting.speed;
        score.innerHTML = `SCORE: <br>${setting.score}`;
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }

}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';
        //console.log('line.y: ', line.y);
        if (line.y >= document.documentElement.clientHeight) {
            line.y = -80;

        }
    });
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach(enemy => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            console.warn('ДТП');
            const player = document.getElementById('plr');
            if (player) {
                player.remove();
            }
            let best = setting.bestScore < setting.score ? setting.score : setting.bestScore;

            localStorage.setItem("bestScore", best);
            console.log(localStorage['bestScore']);

            if (setting.score > setting.bestScore) {
                score.textContent = `NEW RECORD! ${localStorage['bestScore']}`;
            }
            setting.start = false;
            start.classList.remove('hide');
            gameArea.classList.add('hide');
        }

        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y >= document.documentElement.clientHeight) {
            enemy.y = -100 * setting.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    })
}

function startRun(event) {
    event.preventDefault();
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
}

function stopRun(event) {
    event.preventDefault();
    keys[event.key] = false;
}

function playMusic() {
    const music = document.createElement('audio');
    music.id = 'plr';
    music.controls = 'controls';
    music.src = './music/audio.mp3';
    music.type = 'audio/mpeg';
    sound.appendChild(music);
    music.play();
}