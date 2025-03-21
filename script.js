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

let score = 0;
let speed = 2.0;
let collectedIngredients = new Set();
let basketSpeed = 0;
let basketPosition = gameArea.clientWidth / 2;
let keys = {};

const foodImages = {
    Bun: "🟠",
    L: "🥬",
    T: "🍅",
    C: "🧀",
    D: "🍞",
};

const dishes = [
    { name: "Burger", ingredients: ["Bun", "L", "T", "C"] },
    { name: "Pizza", ingredients: ["D", "C"] },
];

let currentDish = {};


let maxIngredientsOnScreen = 5;
let activeIngredients = 0;

function startGame() {
    panel.style.display = "none";
    currentDish = dishes[Math.floor(Math.random() * dishes.length)];
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
        li.textContent = foodImages[ing];
        ingredientList.appendChild(li);
    });

    spawnIngredient();
}


function spawnIngredient() {
    if (activeIngredients >= maxIngredientsOnScreen) {
        setTimeout(spawnIngredient, 1000);
        return;
    }

    const ingredients = Object.keys(foodImages);
    let ingredientType = ingredients[Math.floor(Math.random() * ingredients.length)];

    let ingredient = document.createElement("div");
    ingredient.classList.add("ingredient");
    ingredient.textContent = foodImages[ingredientType];
    ingredient.dataset.type = ingredientType;
    ingredient.style.left = Math.random() * (gameArea.clientWidth - 40) + "px";
    gameArea.appendChild(ingredient);

    activeIngredients++;

    function fall() {
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

                // if (score % 50 === 0) {
                //     speed += 0.2;
                // }
            }
        } else {
            score -= 5;
            scoreDisplay.textContent = score;
            // alert("Wrong ingredient! You lose points!");
        }

        if (score == 0) {
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
        li.textContent = foodImages[ing];
        collectedList.appendChild(li);
    });

    if (collectedIngredients.size === currentDish.ingredients.length) {
        // alert(`You completed the ${currentDish.name}!`);
        winPanel.style.display = "flex";
        // startGame();
    }
}

let isMoving = false;

function moveBasketSmoothly() {
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
