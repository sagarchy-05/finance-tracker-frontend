# 💰 AI-Powered Financial Tracker

An intelligent and user-friendly financial tracking web app that helps users take control of their expenses and income. This app provides advanced AI-generated insights, dynamic charts, personalized budgets, and secure authentication — all packed into a responsive interface.

## 🌐 Live Demo

👉 [View the App](https://track-your-own-finances.vercel.app/)

---

## ✨ Features

### 🔐 Authentication

- JWT-based secure login and signup
- Email verification via SMTP
- Protected routes with AuthContext
- Resend verification email support

### 💸 Transaction Management

- Add, edit, and delete income/expense entries
- Real-time budget checks: Prevent overspending
- Category-based classification
- Date and description fields
- Responsive modal with validation and toast alerts

### 📊 Data Visualization

- **Category-wise totals** (Pie Chart)
- **Monthly spending trends** (Bar Chart)
- **Budget vs. Actual** (Progress Bars)
- **Daily Expense Summary** (Line Chart)
- Charts auto-update as data changes
- Export charts to PDF
- Optional: Dark mode toggle (coming soon)

### 🎯 Budget Management

- Set monthly budget per category
- Auto-updates when transactions are added/edited
- Alerts when limits are exceeded
- View, update, or delete budgets

### 🧠 AI-Powered Insights

- Utilizes Falcon-7B from Hugging Face to analyze spending patterns
- Generates high-quality, personalized financial advice in bullet points
- Filters low-quality or repetitive insights automatically

---

## 🛠️ Tech Stack

### Frontend

- **React + Vite**
- **Bootstrap 5** (Responsive UI)
- **Axios** for HTTP requests
- **Chart.js / Recharts** for data visualization
- **React Context API** for auth management

### Backend

- **Express.js**
- **MongoDB + Mongoose**
- **JWT** for secure authentication
- **Nodemailer + SMTP** for email verification
- **Falcon-7B** via Hugging Face Inference API for insights

---

## 👤 Author

Built with ❤️ by Sagar
