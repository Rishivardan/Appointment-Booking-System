# 📅 Appointment Booking System

A full-stack Appointment Booking application built using **FastAPI**, **MongoDB Atlas**, and **React (Vite)**.
This project allows users to create, view, and manage appointments through a modern web interface.

---

## 🚀 Tech Stack

### 🔹 Backend

* FastAPI
* Python
* MongoDB Atlas
* PyMongo
* Uvicorn

### 🔹 Frontend

* React
* Vite
* JavaScript
* Fetch API

### 🔹 Deployment

* Backend: Render
* Database: MongoDB Atlas

---

## 📂 Project Structure

```
appointment-booking/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Features

* Create appointments
* View all appointments
* Backend API with FastAPI
* MongoDB Atlas cloud database
* RESTful API structure
* CORS enabled for frontend-backend communication
* Environment variable configuration

---

## 🧠 How It Works

1. React frontend sends HTTP requests to FastAPI backend.
2. FastAPI processes the request.
3. Data is stored/retrieved from MongoDB Atlas.
4. Response is sent back to frontend.
5. UI updates dynamically.

---

## 🛠️ Setup Instructions

### 🔹 1. Clone Repository

```bash
git clone https://github.com/your-username/appointment-booking.git
cd appointment-booking
```

---

## 🔹 Backend Setup

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Create virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create `.env` file

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment_db?retryWrites=true&w=majority
```

### 5. Run backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

API Docs available at:

```
http://localhost:8000/docs
```

---

## 🔹 Frontend Setup

### 1. Navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```
VITE_API_URL=http://localhost:8000
```

### 4. Run frontend

```bash
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

## 🌍 Deployment

* Backend deployed on Render
* MongoDB hosted on MongoDB Atlas
* Frontend can be deployed on Vercel / Netlify / Render

To deploy:

1. Set environment variables in hosting platform
2. Update `VITE_API_URL` to deployed backend URL
3. Redeploy frontend

---

## 🔐 Environment Variables

### Backend

| Variable  | Description                  |
| --------- | ---------------------------- |
| MONGO_URI | MongoDB Atlas connection URI |

### Frontend

| Variable     | Description          |
| ------------ | -------------------- |
| VITE_API_URL | Backend API base URL |

---

## 📌 Future Improvements

* User authentication (JWT)
* Update/Delete appointments
* Protected routes
* Date & time validation
* Pagination
* Better UI styling
* Production-level error handling

---

## 👨‍💻 Author

V.RISHIVARDAN
