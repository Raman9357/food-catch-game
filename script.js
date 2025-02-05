const gameArea = document.querySelector(".game-area");
const basket = document.getElementById("basket");
const dishName = document.getElementById("dish-name");
const ingredientList = document.getElementById("ingredient-list");
const collectedList = document.getElementById("collected-list");
const scoreDisplay = document.getElementById("score");

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
    currentDish = dishes[Math.floor(Math.random() * dishes.length)];
    dishName.textContent = currentDish.name;
    ingredientList.innerHTML = "";
    collectedList.innerHTML = "";
    collectedIngredients.clear();
    activeIngredients = 0;

    currentDish.ingredients.forEach(ing => {
        let li = document.createElement("li");
        li.textContent = foodImages[ing];
        ingredientList.appendChild(li);
    });

    spawnIngredient();
    moveBasketSmoothly();
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
            alert("Wrong ingredient! You lose points!");
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
        alert(`You completed the ${currentDish.name}!`);
        startGame();
    }
}

function moveBasketSmoothly() {
    if (keys["ArrowLeft"] && basketPosition > 0) {
        basketSpeed = Math.max(basketSpeed - 0.3, -2.5);
    } else if (keys["ArrowRight"] && basketPosition < gameArea.clientWidth - basket.clientWidth) {
        basketSpeed = Math.min(basketSpeed + 0.3, 2.5);
    }
    // else {
    //     basketSpeed *= 0.9;
    // }

    basketPosition += basketSpeed;
    basket.style.left = basketPosition + "px";

    requestAnimationFrame(moveBasketSmoothly);
}

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

startGame();
