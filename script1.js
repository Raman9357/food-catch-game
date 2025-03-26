const gameArea = document.querySelector(".game-area");
const basket = document.getElementById("basket");
const dishName = document.getElementById("dish-name");
const ingredientList = document.getElementById("ingredient-list");
const collectedList = document.getElementById("collected-list");
const scoreDisplay = document.getElementById("score");

const panel = document.querySelector(".game-starter");
const losePanel = document.querySelector(".lose-panel");
const winPanel = document.querySelector(".win-panel");
const playButton = document.querySelector("#play-game");
const goBackButton = document.querySelector("#play-game");

let score = 0;
let speed = 2.0;
let collectedIngredients = new Set();
let basketSpeed = 0;
let basketPosition = gameArea.clientWidth / 2;
let keys = {};

let gameActive = false;

const foodImages = {
    Bun: "assets/images/carrots2.png",
    A: "assets/images/lettuce1.png",
    P: "assets/images/potatoes1.png",
    C: "assets/images/cheese1.png",
    D: "assets/images/garlic1.png",
    // E: "assets/images/eggs2.png",
    // F: "assets/images/onion1.png",
    // G: "assets/images/spring_onion2.png",
    // H: "assets/images/cucumber2.png",
    // I: "assets/images/spinach1.png",
    // J: "assets/images/rotten_cheese1.png",
    // K: "assets/images/rotten_spinach1.png",
    // L: "assets/images/rotten_potatotoes1.png",
    // M: "assets/images/rotten_eggs.png",
    // N: "assets/images/rotten_lettuce1.png",
    // O: "assets/images/rotten_garlic1.png",
};

const dishes = [
    { name: "Carrot Rainbow", ingredients: ["Bun", "A", "P", "C"] },
    { name: "Pizza", ingredients: ["D", "C"] },
];

let currentDish = {};


let maxIngredientsOnScreen = 5;
let activeIngredients = 0;

function startGame() {
    panel.style.display = "none";
    winPanel.style.display = "none";
    losePanel.style.display = "none";
    gameActive = true;
    // currentDish = dishes[Math.floor(Math.random() * dishes.length)];
    currentDish = dishes[0];
    dishName.textContent = currentDish.name;
    ingredientList.innerHTML = "";
    collectedList.innerHTML = "";
    collectedIngredients.clear();
    activeIngredients = 0;

    basketPosition = gameArea.clientWidth / 2;
    basket.style.left = basketPosition + "px";
    basketSpeed = 0;
    keys = {};
    currentDish.ingredients.forEach(ing => {
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.src = foodImages[ing];
        img.alt = ing;
        li.appendChild(img);
        ingredientList.appendChild(li);
    });

    spawnIngredient();
}


function spawnIngredient() {

    if (!gameActive) return;
    if (activeIngredients >= maxIngredientsOnScreen) {
        setTimeout(spawnIngredient, 1000);
        return;
    }

    const ingredients = Object.keys(foodImages);
    let ingredientType = ingredients[Math.floor(Math.random() * ingredients.length)];

    let ingredient = document.createElement("img");
    ingredient.classList.add("ingredient");
    ingredient.src = foodImages[ingredientType];
    ingredient.dataset.type = ingredientType;
    ingredient.style.position = "absolute";
    ingredient.style.left = Math.random() * (gameArea.clientWidth - 40) + "px";
    ingredient.style.top = "0px";
    gameArea.appendChild(ingredient);

    activeIngredients++;

    function fall() {

        if (!gameActive) return;
        let topPosition = parseFloat(ingredient.style.top || 0);
        if (topPosition < gameArea.clientHeight - 50) {
            ingredient.style.top = topPosition + speed + "px";
            requestAnimationFrame(fall);
        } else {
            checkCatch(ingredient);
        }
    }
    requestAnimationFrame(fall);

    setTimeout(spawnIngredient, 800);
}


function checkCatch(ingredient) {
    let basketRect = basket.getBoundingClientRect();
    let ingredientRect = ingredient.getBoundingClientRect();

    let overlapX = ingredientRect.left < basketRect.right && ingredientRect.right > basketRect.left;
    let overlapY = ingredientRect.bottom >= basketRect.top && ingredientRect.top <= basketRect.bottom;

    if (overlapX && overlapY) {
        let ingredientType = ingredient.dataset.type;

        if (currentDish.ingredients.includes(ingredientType)) {
            if (!collectedIngredients.has(ingredientType)) {
                collectedIngredients.add(ingredientType);
                updateChecklist();
                score += 10;
                scoreDisplay.textContent = score;
            }
        } else {
            score -= 5;
            scoreDisplay.textContent = score;
        }

        if (score == 0) {
            gameActive = false;
            losePanel.style.display = "flex";
        }
    }

    ingredient.remove();
    activeIngredients--;
}

function updateChecklist() {
    collectedList.innerHTML = "";
    collectedIngredients.forEach(ing => {
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.src = foodImages[ing];
        li.appendChild(img);
        collectedList.appendChild(li);
    });


    if (collectedIngredients.size === currentDish.ingredients.length) {
        gameActive = false;
        winPanel.style.display = "flex";
    }
}


let isMoving = false;

function moveBasketSmoothly() {

    if (!gameActive) {
        isMoving = false;
        return;
    }
    if (!keys["ArrowLeft"] && !keys["ArrowRight"]) {
        isMoving = false;
        return;
    }

    if (keys["ArrowLeft"] && basketPosition > 0) {
        basketSpeed = -2.5;
    } else if (keys["ArrowRight"] && basketPosition < gameArea.clientWidth - basket.clientWidth) {
        basketSpeed = 2.5;
    } else {
        basketSpeed = 0;
    }

    basketPosition += basketSpeed;
    basket.style.left = basketPosition + "px";

    requestAnimationFrame(moveBasketSmoothly);
}


document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (!isMoving) {
        isMoving = true;
        moveBasketSmoothly();
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

if (playButton && panel) {
    playButton.addEventListener("click", startGame);
}

if (playButton && losePanel) {
    playButton.addEventListener("click", startGame);
}

if (playButton && winPanel) {
    playButton.addEventListener("click", startGame);
}


// startGame();
