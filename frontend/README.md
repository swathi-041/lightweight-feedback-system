# 📝 Lightweight Feedback System

A simple, secure platform for managers to share structured feedback with employees.

---

## 🚀 Features

- 🔐 **Authentication** with role-based access (Manager & Employee)
- 🧑‍💼 **Manager Dashboard** with feedback stats and submission
- 👨‍🔧 **Employee Timeline** with feedback history
- 📌 **Feedback** includes strengths, improvements, sentiment & tags
- ✅ Acknowledgement system for employees
- 💬 Comments from employees on feedback
- 📦 Dockerized Python (FastAPI) backend

---

## 🧑‍💻 Tech Stack

| Layer     | Tech               |
|-----------|--------------------|
| Frontend  | React + Tailwind   |
| Backend   | FastAPI (Python)   |
| Database  | MongoDB Atlas      |
| Auth      | JWT                |
| DevOps    | Docker             |

---

## ⚙️ Getting Started (Local)

### ✅ Prerequisites

- Node.js + npm
- Python 3.10+
- Docker (for backend)

---

### 1. Clone the Repo

```bash
git clone https://github.com/swathi-041/lightweight-feedback-system
cd lightweight-feedback-system
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Runs on: [http://localhost:3000](http://localhost:3000)

---

### 3. Backend Setup

```bash
cd backend
cp .env.example .env  # or create .env manually
docker build -t feedback-backend .
docker run -p 8000:8000 feedback-backend
```

Runs on: [http://localhost:8000](http://localhost:8000)

---

### 4. MongoDB Setup

Use **MongoDB Atlas**, and paste your connection string in `.env` file like:

```ini
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/feedbackdb
```

---

## 📄 API Endpoints

### 🔐 Auth
- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login user

### 📌 Feedback
- `POST /api/feedback/` – Submit feedback
- `GET /api/feedback/employee` – View employee feedback
- `GET /api/feedback/manager` – View manager dashboard
- `PUT /api/feedback/comment/{id}` – Add employee comment
- `PUT /api/feedback/acknowledge/{id}` – Acknowledge feedback

---

## 🐳 Docker Info

**Dockerfile:** Located at `/backend/Dockerfile`

### 🛠 Build:

```bash
docker build -t feedback-backend .
```

### 🚀 Run:

```bash
docker run -p 8000:8000 feedback-backend
```

---

## 🙋‍♀️ Notes

- Auth is fully implemented using **JWT**
- All API routes are **protected**
- Role-based access is enforced on both **frontend** and **backend**

---

## 📬 Contact

**Built by**: SAMUDRALA SWATHI

> Feel free to reach out via GitHub or email if you'd like to collaborate or need support!
