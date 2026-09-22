const motivationalQuotes = [
    "Small steps every day add up to big results.",
    "You don't have to be perfect. You just have to keep going.",
    "Your future self will thank you for what you do today.",
    "Consistency beats motivation.",
    "One step at a time. Keep moving forward.",
    "Progress is still progress, no matter how small.",
    "Discipline is choosing what you want most over what you want now.",
    "You are capable of more than you think.",
    "Don't stop when you're tired. Stop when you're done.",
    "Every step counts.",
    "A little progress each day adds up to a lot.",
    "You don't need to feel motivated to make progress.",
    "Keep showing up for yourself.",
    "Your only competition is who you were yesterday.",
    "Start where you are. Keep moving.",
    "Hard days count too. Keep going.",
    "Believe in the progress you cannot see yet.",
    "The goal isn't perfection. The goal is consistency.",
    "Future you is built by what you do today.",
    "You've got this. One day at a time."
];

function displayDailyQuote() {
    let dayNumber = Math.floor(
        new Date().getTime() / (1000 * 60 * 60 * 24)
    );

    let quoteIndex = dayNumber % motivationalQuotes.length;

    document.getElementById("dailyQuote").textContent =
        motivationalQuotes[quoteIndex];
}

let steps = Number(localStorage.getItem("steps")) || 0;
let points = Number(localStorage.getItem("points")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];

let walletBalance = Number(localStorage.getItem("walletBalance")) || 0;
let totalEarned = Number(localStorage.getItem("totalEarned")) || 0;
let totalWithdrawn = Number(localStorage.getItem("totalWithdrawn")) || 0;

let today = new Date().toDateString();
let lastDate = localStorage.getItem("lastDate");

// Reset today's steps if the date has changed
let bonusClaimed = localStorage.getItem("bonusClaimed") === "true";

if (lastDate !== today) {
    steps = 0;
    bonusClaimed = false;

    localStorage.setItem("steps", steps);
    localStorage.setItem("lastDate", today);
    localStorage.setItem("bonusClaimed", "false");
}

const rewards = [
    { name: "💵 ₱20 Spending Money", cost: 85 },
    { name: "💵 ₱50 Spending Money", cost: 210 },
    { name: "💵 ₱100 Spending Money", cost: 420 },
    { name: "💵 ₱200 Spending Money", cost: 840 },
    { name: "💵 ₱500 Spending Money", cost: 2100 }
];

function saveData() {
    localStorage.setItem("steps", steps);
    localStorage.setItem("points", points);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("lastDate", today);
    localStorage.setItem("bonusClaimed", bonusClaimed);

    localStorage.setItem("walletBalance", walletBalance);
    localStorage.setItem("totalEarned", totalEarned);
    localStorage.setItem("totalWithdrawn", totalWithdrawn);
}

function updateWalletDisplay() {
    document.getElementById("walletBalance").textContent =
        walletBalance.toFixed(2);

    document.getElementById("totalEarned").textContent =
        totalEarned.toFixed(2);

    document.getElementById("totalWithdrawn").textContent =
        totalWithdrawn.toFixed(2);
}

function updateDisplay() {
    document.getElementById("steps").textContent = steps;
    document.getElementById("points").textContent = points;

    let progress = steps % 8000;
    let percentage = (progress / 8000) * 100;

    document.getElementById("progress").style.width = percentage + "%";
    document.getElementById("progressText").textContent =
        progress + " / 8000 steps";
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
    let bonusEarned = false;

if (steps >= 8000 && !bonusClaimed) {
    points += 10;
    bonusClaimed = true;
    bonusEarned = true;

    history.unshift({
        type: "bonus",
        points: 10,
        date: new Date().toLocaleString()
    });
}

    history.unshift({
        type: "earned",
        steps: amount,
        points: earned,
        date: new Date().toLocaleString()
    });

    saveData();
    updateDisplay();

    if (bonusEarned) {
    alert(
        "🎉 Daily Goal Reached!\n\n" +
        "You earned " + earned + " point(s) from your steps.\n" +
        "🎁 +10 bonus points!"
    );
} else {
    alert(
        "You added " + amount + " steps!\n" +
        "You earned " + earned + " point(s)."
    );
}
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

    // Get the money amount from the reward
    const moneyAmount = Number(
        reward.name.replace("💵 ₱", "").replace(" Spending Money", "")
    );

    // Add money to wallet
    walletBalance += moneyAmount;
    totalEarned += moneyAmount;

    history.unshift({
        type: "redeemed",
        reward: reward.name,
        points: reward.cost,
        money: moneyAmount,
        date: new Date().toLocaleString()
    });

        saveData();
    updateDisplay();
    updateWalletDisplay();

    if (document.getElementById("rewardsSection").style.display === "block") {
        document.getElementById("rewardsPoints").textContent = points;
        displayRewards();
    }

    alert(
        "🎉 Redeemed!\n\n" +
        reward.name +
        "\n\n💰 Added to Wallet: ₱" +
        moneyAmount.toFixed(2) +
        "\n\nRemaining points: " +
        points +
        "\nWallet Balance: ₱" +
        walletBalance.toFixed(2)
    );
}

function withdrawMoney() {
    if (walletBalance <= 0) {
        alert("Your wallet is empty.");
        return;
    }

    let amount = prompt(
        "How much would you like to withdraw?\n\n" +
        "Available: ₱" + walletBalance.toFixed(2)
    );

    if (amount === null) return;

    amount = Number(amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    if (amount > walletBalance) {
        alert("You don't have enough money in your wallet.");
        return;
    }

    const confirmWithdraw = confirm(
        "Withdraw ₱" + amount.toFixed(2) + " from your wallet?"
    );

    if (!confirmWithdraw) return;

    walletBalance -= amount;
    totalWithdrawn += amount;

    history.unshift({
        type: "withdrawn",
        amount: amount,
        date: new Date().toLocaleString()
    });

    saveData();
    updateWalletDisplay();

    alert(
        "💸 Withdrawal recorded!\n\n" +
        "Amount: ₱" + amount.toFixed(2) +
        "\nRemaining Wallet: ₱" + walletBalance.toFixed(2)
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
} else if (item.type === "bonus") {
    div.innerHTML =
        "🎯 Daily Goal Bonus → +" +
        item.points + " points<br>" +
        "<small>" + item.date + "</small>";
} else {
    div.innerHTML =
        "🎁 Redeemed " + item.reward +
        " → -" + item.points + " points<br>" +
        "<small>" + item.date + "</small>";
}
        
        container.appendChild(div);
    });
}

function toggleMenu() {
    const menu = document.getElementById("sideMenu");
    menu.classList.toggle("open");
}

function showSection(section) {
    toggleMenu();

    if (section === "wallet") {
        document.getElementById("dashboardSection").style.display = "none";
        document.getElementById("walletSection").style.display = "none";
        document.getElementById("rewardsSection").style.display = "none";

        document.getElementById("walletSection").style.display = "block";

        updateWalletDisplay();

    } else if (section === "rewards") {
        document.getElementById("dashboardSection").style.display = "none";
        document.getElementById("walletSection").style.display = "none";
        document.getElementById("rewardsSection").style.display = "block";

        document.getElementById("rewardsPoints").textContent = points;

        displayRewards();

    } else {
        alert("This section is coming soon!");
    }
}

function showDashboard() {
    document.getElementById("walletSection").style.display = "none";
    document.getElementById("rewardsSection").style.display = "none";
    document.getElementById("dashboardSection").style.display = "block";

    updateDisplay();
}

displayDailyQuote();
updateDisplay();
updateWalletDisplay();
