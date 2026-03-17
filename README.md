# 🚀 SharingSystem — Fast & Anonymous File Sharing Platform

SharingSystem is a modern file-sharing web application that allows users to upload files and instantly generate secure, shareable links — without requiring login.

---

## ✨ Key Features

* ⚡ **Instant File Uploads** (Multer + MongoDB / AWS S3)
* 🔗 **Shareable Download Links**
* 🔐 **Optional Authentication (JWT)**
* 👤 **Guest & User Modes**
* 📅 **File Expiry Support**
* 📊 **Dashboard to Manage Files**
* 📤 **Preview & Download Files**
* 🔔 **Real-time Notifications (Toast UI)**

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Redux Toolkit
* React Router

### Backend

* Node.js + Express
* MongoDB + Mongoose
* Multer (file handling)
* JWT (authentication)

---

## 📂 Project Structure

client/ → React frontend
server/ → Node.js backend

---

## ⚙️ Run Locally

```bash
# Clone repo
git clone https://github.com/himanshukumar8/sharing-system

# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm start
```

---

## 🔐 Environment Variables

Create a `.env` file inside `server/`:

```
PORT=6600
MONGODB_URL=your_mongo_url
JWT_SECRET=your_secret
```

---

## 🌐 Live Demo

https://sharingsystem-himanshu.vercel.app/

Note: Backend is hosted on Render (free tier), so initial API requests may take ~30 seconds due to cold start.

---

## 👨‍💻 Author

Himanshu Kumar

* GitHub: https://github.com/himanshukumar8
* LinkedIn: https://www.linkedin.com/in/himanshuhhk/

---

## ⭐ Notes

This project demonstrates full-stack development using MERN, including file handling, authentication, and real-world deployment structure.
