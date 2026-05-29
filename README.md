# SpendSmart — Expense Tracker

A full stack expense tracker with a Node.js + Express REST API backend and vanilla JS frontend.

## Features
- ➕ Add income & expense transactions
- 🗑️ Delete transactions
- 🔍 Filter by income / expense
- 💰 Live balance, income, expense summary
- 🗄️ REST API with JSON file database
- 📱 Responsive design

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** JSON file storage
- **API:** REST (GET, POST, DELETE)

## Project Structure
```
expense-tracker/
├── backend/
│   ├── server.js      # Express server + API routes
│   ├── data.json      # Database
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/transactions | Get all transactions |
| POST | /api/transactions | Add new transaction |
| DELETE | /api/transactions/:id | Delete transaction |
| GET | /api/summary | Get balance summary |

## How to Run
```bash
cd backend
npm install
npm start
```
Then open `frontend/index.html` in your browser.

## Live Demo
_Coming soon_
