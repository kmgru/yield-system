'use strict';

// ▼ IRR（内部収益率）を年単位で計算（2分法）
function calcIRR(cashflows) {
  let low = -0.9999;
  let high = 1.0;
  let mid = 0;

  for (let i = 0; i < 100; i++) {
    mid = (low + high) / 2;
    const npv = calcNPV(cashflows, mid);
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return mid;
}

// ▼ 年単位NPV
function calcNPV(cashflows, annualRate) {
  let total = 0;
  for (let t = 0; t < cashflows.length; t++) {
    total += cashflows[t] / Math.pow(1 + annualRate, t + 1);
  }
  return total;
}
/* ▼カンマ処理関数 */
function parseNumber(str) {
  return Number(str.replace(/,/g, '')) || 0;
}
function formatNumber(num) {
  return num.toLocaleString('ja-JP');
}

function calcDisplay() {
  const A = parseNumber(document.querySelector('input.A').value); // 月額保険料
  const T = Number(document.querySelector('input.T').value); // 払込年数
  const Y = parseNumber(document.querySelector('input.Y').value); // 年金額
  const D = Number(document.querySelector('input.D').value); // 据置年数

  const resultDiv = document.getElementById('result');

  const h3 = document.createElement('h3');
  h3.textContent = `年齢　年利`;
  resultDiv.appendChild(h3);


  let firstRed = false;
  for (let age = 65; age <= 100; age++) {
    const receiveYears = age - 64;
    const cashflows = [];

    // 払込期（年単位キャッシュフロー）
    for (let i = 0; i < T; i++) cashflows.push(-A * 12);
    // 据置期間（0円）
    for (let i = 0; i < D; i++) cashflows.push(0);
    // 受給期
    for (let i = 0; i < receiveYears; i++) cashflows.push(Y);

    const irr = calcIRR(cashflows) * 100;
    const p = document.createElement('p');
    p.textContent = `${age}歳 : ${irr.toFixed(2)}%`;
    if (!firstRed && irr > 0) {
      p.style.color = 'red';
      firstRed = true;
    }

    resultDiv.appendChild(p);
  }
}

document.querySelectorAll('input.A, input.Y').forEach(input => {
  input.addEventListener('input', e => {
    const num = parseNumber(e.target.value);
    e.target.value = formatNumber(num);
    calcDisplay();
  });
});
document.querySelectorAll('input.T, input.D').forEach(input => {
  input.addEventListener('input', calcDisplay);
});

window.addEventListener('load', calcDisplay);
