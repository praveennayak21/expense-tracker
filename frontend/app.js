// ===========================
//  SPENDSMART — app.js
// ===========================

const API = "https://expense-tracker-2e6q.onrender.com";

// ---- Fetch summary ----
async function loadSummary() {
  try {
    const res  = await fetch(`${API}/summary`);
    const data = await res.json();
    document.getElementById("balance").textContent = `₹${data.balance}`;
    document.getElementById("income").textContent  = `₹${data.income}`;
    document.getElementById("expense").textContent = `₹${data.expense}`;
  } catch {
    document.getElementById("balance").textContent = "Server offline";
  }
}

// ---- Fetch transactions ----
async function loadTransactions(filter = "all") {
  const list = document.getElementById("transactionsList");
  list.innerHTML = `<div class="loading">Loading…</div>`;

  try {
    const res  = await fetch(`${API}/transactions`);
    const data = await res.json();

    const filtered = filter === "all" ? data : data.filter(t => t.type === filter);

    if (!filtered.length) {
      list.innerHTML = `<div class="empty">No transactions yet. Add one above!</div>`;
      return;
    }

    list.innerHTML = "";
    filtered.forEach(tx => list.appendChild(createTxItem(tx)));
  } catch {
    list.innerHTML = `<div class="empty">⚠️ Cannot connect to server. Make sure it's running!</div>`;
  }
}

// ---- Create transaction element ----
function createTxItem(tx) {
  const sign = tx.type === "income" ? "+" : "-";
  const div  = document.createElement("div");
  div.className = `transaction-item ${tx.type}`;
  div.innerHTML = `
    <div class="tx-left">
      <span class="tx-text">${escapeHTML(tx.text)}</span>
      <span class="tx-meta">${getCategoryEmoji(tx.category)} ${tx.category} · ${tx.date}</span>
    </div>
    <div class="tx-right">
      <span class="tx-amount">${sign}₹${tx.amount.toLocaleString()}</span>
      <button class="btn-delete" data-id="${tx.id}" title="Delete">✕</button>
    </div>
  `;

  div.querySelector(".btn-delete").addEventListener("click", () => deleteTransaction(tx.id));
  return div;
}

// ---- Add transaction ----
async function addTransaction() {
  const text     = document.getElementById("fieldText").value.trim();
  const amount   = document.getElementById("fieldAmount").value;
  const category = document.getElementById("fieldCategory").value;
  const type     = document.getElementById("fieldType").value;
  const msg      = document.getElementById("formMsg");

  if (!text || !amount) {
    showMsg("⚠️ Please fill in all fields!", "error");
    return;
  }
  if (parseFloat(amount) <= 0) {
    showMsg("⚠️ Amount must be greater than 0!", "error");
    return;
  }

  try {
    const res = await fetch(`${API}/transactions`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ text, amount, category, type })
    });

    if (res.ok) {
      showMsg("✅ Transaction added!", "success");
      document.getElementById("fieldText").value   = "";
      document.getElementById("fieldAmount").value = "";
      loadTransactions(document.getElementById("filterType").value);
      loadSummary();
    } else {
      showMsg("❌ Failed to add. Try again.", "error");
    }
  } catch {
    showMsg("❌ Server offline. Start the backend!", "error");
  }
}

// ---- Delete transaction ----
async function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;

  try {
    const res = await fetch(`${API}/transactions/${id}`, { method: "DELETE" });
    if (res.ok) {
      loadTransactions(document.getElementById("filterType").value);
      loadSummary();
    }
  } catch {
    alert("Cannot connect to server!");
  }
}

// ---- Helpers ----
function showMsg(text, type) {
  const msg = document.getElementById("formMsg");
  msg.textContent = text;
  msg.className   = `form-msg ${type}`;
  setTimeout(() => { msg.textContent = ""; msg.className = "form-msg"; }, 3000);
}

function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function getCategoryEmoji(cat) {
  const map = {
    salary: "💼", freelance: "💻", food: "🍔",
    housing: "🏠", transport: "🚗", entertainment: "🎬",
    health: "💊", other: "📦"
  };
  return map[cat] || "📦";
}

// ---- Event listeners ----
document.getElementById("btnAdd").addEventListener("click", addTransaction);

document.getElementById("fieldAmount").addEventListener("keydown", e => {
  if (e.key === "Enter") addTransaction();
});

document.getElementById("filterType").addEventListener("change", e => {
  loadTransactions(e.target.value);
});

// ---- Init ----
loadSummary();
loadTransactions();
