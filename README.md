# Smart UPI Expense Analyzer & Money Saving Assistant

LIVE SERVER LINK : https://mreshma-16.github.io/Smart-UPI-Expense-Analyzer/login.html

A web-based application that analyzes UPI transactions and sends smart notifications to help users control unnecessary spending and save money.

---

## What It Does

When you make a UPI payment, the app gives you smart saving tips. For example:

- You pay ₹350 for food delivery → **"Cooking at home could save around ₹200."**
- You buy coffee for ₹180 → **"You've spent ₹900 on coffee this month. Reducing one coffee per week could save ₹2,000+ per year."**
- You buy something late at night → **"Was this purchase necessary? Waiting 24 hours before buying can reduce impulse spending."**

---

## Features

1. **Login System** — Sign in with Username, Email, Mobile number or use Google/GitHub login.
2. **UPI Transaction Detection** — Reads UPI transaction SMS or imported bank statements (CSV).
3. **Expense Categorization** — Auto-classifies expenses into Food, Shopping, Travel, Bills, Entertainment, Education, Medical, Others.
4. **Smart Notifications** — Gives personalized saving advice based on your spending patterns.
5. **AI Financial Coach** — Analyzes spending habits, detects weekend spikes, flags late-night purchases.
6. **Budget Tracker** — Set monthly and daily spending limits with visual progress bars.
7. **Savings Goals** — Plan and track savings targets (e.g., save for a Laptop in 6 months).
8. **Impulse Buy Cooldown** — 24-hour waiting timer to prevent impulse purchases.
9. **Weekly Challenges** — Fun saving challenges to build better money habits.
10. **Light/Dark Theme** — Toggle between clean light and dark modes.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| HTML | Page structure |
| CSS | Styling and themes |
| JavaScript | App logic and interactivity |
| Chart.js (CDN) | Graphs and charts |
| Lucide Icons (CDN) | UI icons |
| localStorage | Data storage (no backend needed) |

---

## How to Run

### Method 1: Direct Open (Easiest)
1. Download or clone this project.
2. Open the `login.html` file in any web browser (Chrome, Edge, Firefox).
3. That's it! The app runs directly in your browser.

### Method 2: Using a Local Server
```bash
cd "smart UPI savings assistant"
npm install
npm run dev
```
The app will open at `http://localhost:3000`.

---

## Project Structure

```
smart UPI savings assistant/
├── login.html      → Login page (entry point)
├── index.html      → Main dashboard
├── styles.css      → All styling (light & dark themes)
├── app.js          → Main application logic
├── data.js         → localStorage database helper
├── parser.js       → SMS text parser engine
├── ai-coach.js     → AI spending analysis engine
├── charts.js       → Chart.js graph builder
├── package.json    → Project config
└── README.md       → This file
```

---

## How to Use

1. **Open `login.html`** → Enter your name, email, and mobile number → Click "Create Account & Enter".
2. **Dashboard** → View your spending overview, charts, and AI tips.
3. **Simulate Payment** → Click "Simulate Payment" button to test with sample transactions.
4. **Transactions Tab** → Log manual UPI payments or import CSV bank statements.
5. **AI Insights Tab** → View detailed spending analysis and financial health score.
6. **Savings Planner Tab** → Set budgets, create savings goals, and take weekly challenges.
7. **Logout** → Click the Logout button in the sidebar to sign out.

---

## Deploy on GitHub Pages (Free Hosting)

1. Push the code to a GitHub repository.
2. Go to **Settings → Pages → Branch: main → Save**.
3. Your app will be live at: `https://yourusername.github.io/your-repo-name/login.html`

---

## Note

This is a **client-side only** project built for academic/mini-project purposes. All data is stored in the browser's localStorage. No backend server or database is required.

---

## Author

Built as a Smart UPI Savings Assistant mini-project.
