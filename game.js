const welcomeContainer = document.getElementById('welcome-container');
const newGameButton = document.getElementById('new-game-button');
const gameContainer = document.getElementById('game-container');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const directions = ['left', 'right', 'up', 'down'];

let game; // Declare game as a global variable

// Create a new game when the "New Game" button is clicked
newGameButton.addEventListener('click', () => {
    welcomeContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    buttons.style.display = 'flex';
    game = new Game(); // Create the game object here
    game.start();
});

class Game {
    constructor() {
        this.player = this.createPlayer();
        this.goal = this.createGoal();
        this.stars = this.createStars(5);
        this.buttons = [button1, button2];
        this.changeDirections();
        this.currentDirection = button1.direction;
        this.movementDirection = button1.direction;
        this.speed = { x: 0.25, y: 0.25 };
    }


    createPlayer() {
        const player = document.createElement('div');
        player.style.position = 'absolute';
        player.style.width = '10%';
        player.style.height = '10%';
        player.style.backgroundColor = 'blue';
        player.style.top = '45%';
        player.style.left = '45%';
        gameContainer.appendChild(player);
        return player;
    }

    createGoal() {
        const goal = document.createElement('div');
        goal.style.position = 'absolute';
        goal.style.width = '10%';
        goal.style.height = '10%';
        goal.style.backgroundColor = 'green';
        goal.style.top = Math.floor(Math.random() * 80) + 10 + '%';
        goal.style.left = Math.floor(Math.random() * 80) + 10 + '%';
        gameContainer.appendChild(goal);
        return goal;
    }

    createStars(numStars) {
        const stars = [];
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = '5%';
            star.style.height = '5%';
            star.style.backgroundColor = 'yellow';
            star.style.borderRadius = '50%';
            star.style.top = Math.floor(Math.random() * 90) + '%';
            star.style.left = Math.floor(Math.random() * 90) + '%';
            gameContainer.appendChild(star);
            stars.push(star);
        }
        return stars;
    }

    start() {
        this.gameLoop = setInterval(() => {
            this.update();
            this.render();
        }, 1000 / 60);
    }

    move() {
        const currentPosition = {
            left: parseFloat(this.player.style.left),
            top: parseFloat(this.player.style.top),
        };

        if (this.movementDirection === 'left' || this.movementDirection === 'right') {
            currentPosition.left += this.movementDirection === 'left' ? -this.speed.x : this.speed.x;

            if (currentPosition.left < 0) {
                currentPosition.left = 0;
                this.movementDirection = 'right';
            } else if (currentPosition.left > 90) {
                currentPosition.left = 90;
                this.movementDirection = 'left';
            }
        } else {
            currentPosition.top += this.movementDirection === 'up' ? -this.speed.y : this.speed.y;

            if (currentPosition.top < 0) {
                currentPosition.top = 0;
                this.movementDirection = 'down';
            } else if (currentPosition.top > 90) {
                currentPosition.top = 90;
                this.movementDirection = 'up';
            }
        }

        this.player.style.left = currentPosition.left + '%';
        this.player.style.top = currentPosition.top + '%';
    }

    checkWinCondition() {
        if (this.stars.length === 0) {
            const playerRect = this.player.getBoundingClientRect();
            const goalRect = this.goal.getBoundingClientRect();

            if (
                playerRect.left < goalRect.right &&
                playerRect.right > goalRect.left &&
                playerRect.top < goalRect.bottom &&
                playerRect.bottom > goalRect.top
            ) {
                clearInterval(this.gameLoop);
                this.showWinMessage();
            }
        }
    }

    showWinMessage() {
        const winMessage = document.createElement('div');
        winMessage.innerHTML = 'You Won!';
        winMessage.style.position = 'absolute';
        winMessage.style.fontSize = '2em';
        winMessage.style.color = 'red';
        winMessage.style.top = '50%';
        winMessage.style.left = '50%';
        winMessage.style.transform = 'translate(-50%, -50%)';
        gameContainer.appendChild(winMessage);
    }

    update() {
        this.move();

        this.checkCollisionWithStars();
        this.checkWinCondition(); // Add this line
    }

    changeDirections() {
        const newDirections = [...directions];
        this.buttons.forEach((button, i) => {
            const randomIndex = Math.floor(Math.random() * newDirections.length);
            button.direction = newDirections[randomIndex];
            button.innerText = this.getArrowSymbol(newDirections[randomIndex]);
            newDirections.splice(randomIndex, 1);
        });
    }

    getArrowSymbol(direction) {
        switch (direction) {
            case 'left':
                return '←';
            case 'right':
                return '→';
            case 'up':
                return '↑';
            case 'down':
                return '↓';
            default:
                return '';
        }
    }

    checkCollisionWithStars() {
        this.stars.forEach((star, index) => {
            const playerRect = this.player.getBoundingClientRect();
            const starRect = star.getBoundingClientRect();

            if (
                playerRect.left < starRect.right &&
                playerRect.right > starRect.left &&
                playerRect.top < starRect.bottom &&
                playerRect.bottom > starRect.top
            ) {
                gameContainer.removeChild(star);
                this.stars.splice(index, 1);
            }
        });
    }

    render() {
        // Render game elements on the screen
    }
}


button1.addEventListener('click', () => {
    game.currentDirection = button1.direction;
    game.movementDirection = button1.direction;
    game.changeDirections();
});

button2.addEventListener('click', () => {
    game.currentDirection = button2.direction;
    game.movementDirection = button2.direction;
    game.changeDirections();
});