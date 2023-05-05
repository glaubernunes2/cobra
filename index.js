const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controles = document.querySelectorAll(".controles i");

let gameOver = false;
let comidaX, foodY;
let cobraX = 5, cobraY = 5;
let velocidadeX = 0, velocidadeY = 0;
let corpoCobra = [];
let setIntervalId;
let score = 0;

// Obtenha pontuação alta do armazenamento local

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// Passe um aleatório entre 1 e 30 como posição de alimento

const posicaoComida = () => {
    comidaX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const mensagemGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Preciona OK para continuar...");
    location.reload();
}

// Alterar o valor da velocidade com base no pressionamento da tecla

const mudacaDirecao = e => {
    if (e.key === "ArrowUp" && velocidadeY != 1) {
        velocidadeX = 0;
        velocidadeY = -1;
    } else if (e.key === "ArrowDown" && velocidadeY != -1) {
        velocidadeX = 0;
        velocidadeY = 1;
    } else if (e.key === "ArrowLeft" && velocidadeX != 1) {
        velocidadeX = -1;
        velocidadeY = 0;
    } else if (e.key === "ArrowRight" && velocidadeX != -1) {
        velocidadeX = 1;
        velocidadeY = 0;
    }
}

// Alterar direção em cada clique de tecla

controles.forEach(button => button.addEventListener("click", () => mudacaDirecao({ key: button.dataset.key })));

const inicioGame = () => {
    if (gameOver) return mensagemGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${comidaX}"></div>`;

    // Quando cobra come comida
    if (cobraX === comidaX && cobraY === foodY) {
        posicaoComida();
        corpoCobra.push([foodY, comidaX]); //Adicionar comida à matriz do corpo da cobra
        score++;
        highScore = score >= highScore ? score : highScore; // se score > high score => high score = score

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    // Atualizar Snake Head
    cobraX += velocidadeX;
    cobraY += velocidadeY;

    // Valores de avanço de elementos no corpo da cobra por um

    for (let i = corpoCobra.length - 1; i > 0; i--) {
        corpoCobra[i] = corpoCobra[i - 1];
    }

    corpoCobra[0] = [cobraX, cobraY];

    // Verifique se o corpo da cobra está fora da parede ou não

    if (cobraX <= 0 || cobraX > 30 || cobraY <= 0 || cobraY > 30) {
        return gameOver = true;
    }

    // Adicione div para cada parte do corpo da cobra

    for (let i = 0; i < corpoCobra.length; i++) {
        html += `<div class="head" style="grid-area: ${corpoCobra[i][1]} / ${corpoCobra[i][0]}"></div>`;
        // Verifique se a cabeça da cobra atingiu o corpo ou não
        if (i !== 0 && corpoCobra[0][1] === corpoCobra[i][1] && corpoCobra[0][0] === corpoCobra[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

posicaoComida();
setIntervalId = setInterval(inicioGame, 100);
document.addEventListener("keyup", mudacaDirecao);