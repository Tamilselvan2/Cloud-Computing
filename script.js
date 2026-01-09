const display = document.getElementById('display');
const historyList = document.getElementById('history-list');
let rollNumber = "";

function startApp() {
    const input = document.getElementById('roll-input').value;
    if (input.trim() === "") {
        alert("Please enter a valid Roll Number");
        return;
    }
    rollNumber = input;
    document.getElementById('auth-overlay').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    document.getElementById('student-display').innerText = `ID: ${rollNumber}`;
    loadHistory();
}

function appendToDisplay(value) {
    if (display.value === "0" || display.value === "Error") display.value = "";
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        const expression = display.value;
        const result = eval(expression); // Using eval for simplicity; in production, use a math library
        
        if (expression !== "" && result !== undefined) {
            saveHistory(expression, result);
            display.value = result;
        }
    } catch (e) {
        display.value = "Error";
    }
}

function saveHistory(exp, res) {
    const history = JSON.parse(localStorage.getItem(`history_${rollNumber}`)) || [];
    const entry = { exp, res, time: new Date().toLocaleTimeString() };
    history.unshift(entry); // Add to start
    localStorage.setItem(`history_${rollNumber}`, JSON.stringify(history.slice(0, 10))); // Keep last 10
    updateHistoryUI(history);
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(`history_${rollNumber}`)) || [];
    updateHistoryUI(history);
}

function updateHistoryUI(history) {
    if (history.length === 0) return;
    historyList.innerHTML = history.map(item => `
        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <div class="text-xs text-slate-500">${item.time}</div>
            <div class="text-sm text-slate-300">${item.exp}</div>
            <div class="text-lg font-semibold text-blue-400">= ${item.res}</div>
        </div>
    `).join('');
}

function clearHistory() {
    localStorage.removeItem(`history_${rollNumber}`);
    historyList.innerHTML = '<p class="text-slate-500 text-sm italic">No recent calculations</p>';
}