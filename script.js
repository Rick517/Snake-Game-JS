function press(id) {

    if (levelId) {
        document.getElementById(`${levelId}`).classList.remove('active-container');
    } 
    
    if (levelId !== id) {
        levelId = id;
        document.getElementById(`${id}`).classList.add('active-container');
    } else {
        levelId = undefined;
    }
}

function generate(d) {
    let html = ""
    for (ii=0;ii<d;ii++) {
        for (jj=0;jj<d;jj++) {
            // coordinates as ids
            html += `<span id="(${ii},${jj})"></span>`;
        }
    }
    document.querySelector('main').innerHTML = html;
}

function reset() {
    alert(score);
    maxScoreElement = document.getElementById('max-score');
    let maxScore = parseInt(maxScoreElement.innerHTML[maxScoreElement.innerHTML.length - 1]);
    maxScoreElement.innerHTML = 'Max score: ' + String(Math.max(score, maxScore));
    scoreElement.innerHTML = 'Score: 0';

    document.querySelector('.window').style.opacity = 1;
    document.querySelector('.window').style.zIndex = 10;
    for (k=0;k<i;k++) {
        for (j=0;j<i;j++) {
            if (seen[k][j]) {
                document.getElementById((`(${k},${j})`)).classList.remove('blue-box');
            }
    }}
    document.getElementById(`(${b2},${b1})`).classList.remove('red-box');
    listeners(rem=true)

    // NOTE undefined - not null
    // TODO bonus efficiency implementing linking list
    seen = undefined, snake = undefined;

    result = undefined;

    x = undefined, y = undefined, b1 = undefined, b2 = undefined, score = 0;
    dir = undefined, starting = undefined;

    // NOTE we don't change i and speed because I don't unpush the button
}

// 1. I need random position 
function randomPosition() {
    // NOTE plus one because max(random) < 1
    b1 = Math.floor(Math.random() * i); b2 = Math.floor(Math.random() * i);
    while (b1 === x && b2 === y) { // x and y are initial position != initial berry
        b1 = Math.floor(Math.random() * i); b2 = Math.floor(Math.random() * i);
    }
}






function direction(event) {
    // NOTE coordinates are swapped because biggest index in the bottom corner
    // Additional conditions for not changing opposite direction
    let key = event.key;
    if (['ArrowUp', 'w', 'W'].includes(key)){
        dir = dir === undefined || dir[0] ? [0,-1] : dir;
    } else if (['ArrowDown', 's', 'S'].includes(key)){
        dir = dir === undefined || dir[0] ? [0,1] : dir;
    } else if (['ArrowLeft', 'a', 'A'].includes(key)){
        dir = dir === undefined || dir[1] ? [-1,0] : dir;
    } else if (['ArrowRight', 'd', 'D'].includes(key)){
        dir = dir === undefined || dir[1] ? [1,0] : dir;
    }

    if (!starting && dir !== undefined) {
        console.log('Direction is set as ', dir);
        starting = true;
        gaming()
    }
}

function listeners(rem=false) {
    if (rem) {
        document.removeEventListener('keydown', direction)
    } else {
        document.addEventListener('keydown', direction)
    }
}



// NOTE I must use the fuunction in main function in order to use global variables
function moving(t1, t2) {
    console.log('Game is playing before.', x, y, b1 ,b2)
    x += dir[0]; y += dir[1];
    console.log('Game is playing after.', x, y, b1 ,b2)

    // NOTE 0 <= x < i is true for javascript always!
    if (x < 0 || x >= i || y < 0 || y >= i || seen[y][x]) {
        result = score;
        console.log('Game over. Try again later :)')
        console.log('Wrong values are: ', x, y, i, seen)
        return 
    }

    // 2.5 Berry
    if (x === b1 && y === b2) {
        score++;
        scoreElement.innerHTML = 'Score: '+ String(score);
        document.getElementById(`(${b2},${b1})`).classList.remove('red-box');
        randomPosition();
        document.getElementById(`(${b2},${b1})`).classList.add('red-box');
    
    } else {

        [t1, t2] = snake.shift();
        console.log('Berries aren"t found. Here: ', t1, t2)
        document.getElementById(`(${t2},${t1})`).classList.remove('blue-box');
        seen[t2][t1] = 0;
    }

    snake.push([x,y]);
    document.getElementById(`(${y},${x})`).classList.add('blue-box');
    seen[y][x] = 1;
}



// 2. Movement
function gaming() {
    console.log('Initial x and y be like: ', x, y, 'Direction is ', dir)

    // 3. Time repeat
    let id = setInterval(
        () => {
            moving(null, null);
        
            if (result !== undefined) {
                console.log('Results are known. You are gone forever.')
                clearInterval(id);
                reset();
                return 
            }
        }, speed
    )  
}

// 4. Start function 
function start() {
    console.log('Values are: ', levelId, starting, seen, dir, result, snake, score, speed, i, b1, b2, x, y)

    let prevI = i;

    if (!levelId) {
        alert('Choose a level!')
        return
    } else {
        if (levelId === 'but-1') {
            i = 11;
            speed = '200';
        } else if (levelId === 'but-2') {
            i = 13;
            speed = '150';
        } else {
            i = 15;
            speed = '100';
        }
    }

    // NOTE we use capital letters - not ----
    document.querySelector('main').style.gridTemplateColumns = `repeat(${i}, 1fr)`;
    generate(i);

    // I use this because it's the fastest
    // NOTE that we cannot fill with arrays - they are same point
    // NOTE kk and ll are stored as variables
    seen = new Array(i);
    for (kk=0;kk<i;kk++) {
        seen[kk] = new Array(i);
        for (ll=0;ll<i;ll++) {
            seen[kk][ll] = 0;
        }
    }

    x = Math.floor(Math.random() * i); y = Math.floor(Math.random() * i);
    document.getElementById(`(${y},${x})`).classList.add('blue-box');
    snake = [[x,y]];

    seen[y][x] = 1;

    
    randomPosition();
    document.getElementById(`(${b2},${b1})`).classList.add('red-box');


    listeners()
    document.querySelector('.window').style.opacity = 0;
    document.querySelector('.window').style.zIndex = -1;

    console.log('Everything is ready!')
}



// TODO bonus efficiency implementing linking list
// NOTE variables are "undefined"
var levelId, starting, seen, dir, result, snake, score = 0, speed = '200', i = 11, b1, b2, x, y;

let scoreElement = document.getElementById('current-score');
generate(i)
