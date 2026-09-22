let steps = Number(localStorage.getItem("steps")) || 0;
let points = Number(localStorage.getItem("points")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

let today = new Date().toDateString();
let lastDate = localStorage.getItem("lastDate");

// Reset today's steps if the date has changed
if (lastDate !== today) {
    steps = 0;
    localStorage.setItem("steps", steps);
    localStorage.setItem("lastDate", today);
}

const rewards = [
    { name: "🍟 Chichirya", cost: 150 },
    { name: "🥟 5 pcs Siomai", cost: 200 },
    { name: "🍔 Burger", cost: 350 },
    { name: "🍟 Fries", cost: 400 },
    { name: "💵 ₱200", cost: 600 },
    { name: "💵 ₱300", cost: 750 },
    { name: "🎧 New Earbuds", cost: 1500 }
];

function saveData() {
    localStorage.setItem("steps", steps);
    localStorage.setItem("points", points);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("lastDate", today);
}

function updateDisplay() {
    document.getElementById("steps").textContent = steps;
    document.getElementById("points").textContent = points;

    let progress = steps % 8000;
    let percentage = (progress / 8000) * 100;

    document.getElementById("progress").style.width = percentage + "%";
    document.getElementById("progressText").textContent =
        progress + " / 8000 steps";

    displayRewards();
    displayHistory();
}

function addSteps() {
    let amount = prompt("How many steps did you walk?");

    if (amount === null) return;

    amount = Number(amount);

    if (!Number.isInteger(amount) || amount <= 0) {
        alert("Please enter a valid number of steps.");
        return;
    }

    let oldPoints = Math.floor(steps / 200);

    steps += amount;

    let newPoints = Math.floor(steps / 200);
    let earned = newPoints - oldPoints;

    points += earned;

    history.unshift({
        type: "earned",
        steps: amount,
        points: earned,
        date: new Date().toLocaleString()
    });

    saveData();
    updateDisplay();

    alert(
        "You added " + amount + " steps!\n" +
        "You earned " + earned + " point(s)."
    );
}

function displayRewards() {
    const container = document.getElementById("rewards");
    container.innerHTML = "";

    rewards.forEach((reward, index) => {
        const div = document.createElement("div");
        div.className = "reward";

        div.innerHTML = `
            <h3>${reward.name}</h3>
            <p>${reward.cost} points</p>
            <button onclick="redeem(${index})">Redeem</button>
        `;

        container.appendChild(div);
    });
}

function redeem(index) {
    const reward = rewards[index];

    if (points < reward.cost) {
        const needed = reward.cost - points;

        alert(
            "Not enough points! 😭\n\n" +
            "You need " + needed + " more point(s)."
        );

        return;
    }

    const confirmRedeem = confirm(
        "Redeem " + reward.name + " for " +
        reward.cost + " points?"
    );

    if (!confirmRedeem) return;

    points -= reward.cost;

    history.unshift({
        type: "redeemed",
        reward: reward.name,
        points: reward.cost,
        date: new Date().toLocaleString()
    });

    saveData();
    updateDisplay();

    alert(
        "🎉 Redeemed!\n\n" +
        reward.name +
        "\n\nRemaining points: " +
        points
    );
}

function displayHistory() {
    const container = document.getElementById("history");
    container.innerHTML = "";

    if (history.length === 0) {
        container.innerHTML = "<p>No history yet.</p>";
        return;
    }

    history.slice(0, 20).forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";

        if (item.type === "earned") {
            div.innerHTML =
                "🚶 +" + item.steps + " steps → +" +
                item.points + " points<br>" +
                "<small>" + item.date + "</small>";
        } else {
            div.innerHTML =
                "🎁 Redeemed " + item.reward +
                " → -" + item.points +
                " points<br>" +
                "<small>" + item.date + "</small>";
        }

        container.appendChild(div);
    });
}

updateDisplay();
