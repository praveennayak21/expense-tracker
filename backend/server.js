// ===========================
//  EXPENSE TRACKER — server.js
// ===========================

const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");

const app  = express();
const PORT = 3000;
const DB   = path.join(__dirname, "data.json");

// ---- Middleware ----
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

// ---- Helper: read/write DB ----
function readDB() {
  if (!fs.existsSync(DB)) {
    fs.writeFileSync(DB, JSON.stringify({ transactions: [] }));
  }
  return JSON.parse(fs.readFileSync(DB));
}

function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// ---- ROUTES ----

// GET all transactions
app.get("/api/transactions", (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

// POST new transaction
app.post("/api/transactions", (req, res) => {
  const { text, amount, category, type } = req.body;

  if (!text || amount === undefined || !category || !type) {
    return res.status(400).json({ error: "All fields required" });
  }

  const db = readDB();
  const newTransaction = {
    id:       Date.now().toString(),
    text,
    amount:   parseFloat(amount),
    category,
    type,     // "income" or "expense"
    date:     new Date().toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric"
              })
  };

  db.transactions.unshift(newTransaction);
  writeDB(db);
  res.status(201).json(newTransaction);
});

// DELETE transaction
app.delete("/api/transactions/:id", (req, res) => {
  const db = readDB();
  const before = db.transactions.length;
  db.transactions = db.transactions.filter(t => t.id !== req.params.id);

  if (db.transactions.length === before) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  writeDB(db);
  res.json({ message: "Deleted successfully" });
});

// GET summary
app.get("/api/summary", (req, res) => {
  const db = readDB();
  const income  = db.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = db.transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  res.json({
    income:  income.toFixed(2),
    expense: expense.toFixed(2),
    balance: (income - expense).toFixed(2)
  });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
