# ⏱️ MERN Time Tracker

![Netlify Status](https://img.shields.io/netlify/YOUR_NETLIFY_SITE_ID?label=Frontend%20Deploy&style=for-the-badge&logo=netlify)
![Render](https://img.shields.io/badge/Backend-Render-blue?style=for-the-badge&logo=render)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)
![Express](https://img.shields.io/badge/Backend-Express-lightgrey?style=for-the-badge&logo=express)
![License](https://img.shields.io/github/license/yourusername/mern-time-tracker?style=for-the-badge)

A full-stack time tracking web app built with the **MERN stack (MongoDB, Express, React, Node.js)**.  
It helps freelancers and developers track their work sessions by client, log hours, and generate invoices — all with a modern dashboard UI built with **Tailwind CSS** and **Framer Motion**.

---

## 🌐 Live Demo
- **Frontend (Netlify):** [https://yourapp.netlify.app](https://yourapp.netlify.app)
- **Backend (Render):** [https://mern-time-tracker-backend.onrender.com](https://mern-time-tracker-backend.onrender.com)

---

## 🚀 Features
- 🔐 **User Authentication (JWT)** — secure register/login  
- 👥 **Client Management** — track clients with hourly rates  
- ⏱️ **Time Tracker** — start/stop work sessions in real time  
- 📝 **Session Notes** — add notes & tags to your sessions  
- 💰 **Invoice Generator** — auto-calculate billable hours  
- 🧠 **Smart Dashboard** — daily stats & summaries  
- 🎨 **UI/UX** — TailwindCSS + Framer Motion animations  

---

## ⚙️ Technologies Used

| Layer | Technology |
|-------|-------------|
| Frontend | React, TailwindCSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JSON Web Tokens (JWT) |
| Deployment | Netlify (frontend), Render (backend) |

---

## 🧱 Project Structure

```
mern-time-tracker/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── middleware/
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

---

## 🧩 Setup & Installation

### Clone and Install
```bash
git clone https://github.com/yourusername/mern-time-tracker.git
cd mern-time-tracker
```

**Backend setup**
```bash
cd backend
npm install
```

**Frontend setup**
```bash
cd ../frontend
npm install
```

---

## 🔑 Environment Variables

In `/backend/.env`:
```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 🧠 Local Development

### Option 1 — Run separately
```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

### Option 2 — Run both with one command
At project root, install concurrently:
```bash
npm install concurrently
```

Then create `package.json` in root:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\""
  }
}
```

Run both:
```bash
npm run dev
```

---

## 🌍 Deployment Guide

### 🖥️ Frontend on Netlify
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `dist` or `build`
- Add `_redirects` file inside `public`:
  ```
  /* /index.html 200
  ```

### ⚙️ Backend on Render
- **Root Directory:** `backend`
- **Start Command:** `node server.js`
- Add environment variables in Render dashboard:
  - `MONGO_URI`
  - `JWT_SECRET`
  - `PORT` (optional)

---

## 📸 Screenshots (Optional)
| Dashboard | Timer | Invoices |
|------------|--------|----------|
| ![Dashboard](https://placehold.co/600x300?text=Dashboard) | ![Timer](https://placehold.co/600x300?text=Timer) | ![Invoices](https://placehold.co/600x300?text=Invoices) |

---

## 🤝 Contributing
Contributions are welcome!  
Feel free to open an issue or submit a pull request for improvements.

---

## 🧑‍💻 Author
**Naimul Islam**  
📧 [your.email@example.com](mailto:your.email@example.com)  
🌐 [yourportfolio.com](https://yourportfolio.com)  
💼 [LinkedIn](https://linkedin.com/in/yourprofile)  
🧰 [GitHub](https://github.com/yourusername)
