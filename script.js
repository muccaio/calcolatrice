const display = document.getElementById('display');
const historyDiv = document.getElementById('history');
let history = [];

document.getElementById('theme-toggle').onclick = () => {
  const body = document.body;
  body.classList.toggle('dark');
  body.classList.toggle('light');
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn.textContent = body.classList.contains('dark') ? '🌞 Chiaro' : '🌙 Scuro';
};

document.getElementById('clear-history').onclick = () => {
  history = [];
  localStorage.removeItem('calc-history');
  renderHistory();
};

function append(value) {
  display.value += value;
  display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
  display.value = '';
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

function factorial(n) {
  n = Math.floor(n);
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) {
    res *= i;
  }
  return res;
}

function calculate() {
  if (!display.value) return;
  try {
    let expr = display.value
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/cbrt/g, 'Math.cbrt')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log')
      .replace(/exp/g, 'Math.exp')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sinh/g, 'Math.sinh')
      .replace(/cosh/g, 'Math.cosh')
      .replace(/tanh/g, 'Math.tanh')
      .replace(/pi/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/\^/g, '**')
      .replace(/(\d+)!/g, (_, n) => `factorial(${n})`);

    let result = Function('factorial', `return ${expr}`)(factorial);

    if (!isFinite(result)) throw Error();

    history.unshift({ expr: display.value, result });
    localStorage.setItem('calc-history', JSON.stringify(history));
    renderHistory();
    display.value = result;
  } catch {
    display.value = 'Errore';
  }
}

function renderHistory() {
  historyDiv.innerHTML = '';
  history.forEach((h) => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `<span>${h.expr}</span><span>= ${h.result}</span>`;
    div.onclick = () => (display.value = h.expr);
    historyDiv.appendChild(div);
  });
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (/[\d+\-*/().^!]/.test(key)) {
    append(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  }
});

window.onload = () => {
  const saved = localStorage.getItem('calc-history');
  if (saved) {
    history = JSON.parse(saved);
    renderHistory();
  }
};
