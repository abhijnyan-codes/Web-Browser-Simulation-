# 🌐 Web-Based Browser Simulation (C++ Backend + JS Frontend)

A full-stack web-based browser simulation that mimics the internal working of a real browser using a **C++ backend server** and a **JavaScript frontend UI**.

Developed as part of **OOP coursework at NIT Silchar**, this project evolved from a console-based system into a fully interactive web application.

---

## 📌 Project Overview

This project demonstrates how a web browser works internally:

* Tab management
* Back/forward navigation using stacks
* Page rendering simulation
* Frontend-backend communication
* Real-time weather integration

The frontend communicates with the C++ backend using HTTP requests, making it a **hybrid system combining systems programming and web development**.

---

## 🚀 Key Features

* 🗂️ Multi-tab browsing system
* 🔄 Back and forward navigation (stack-based logic in C++)
* 🌐 Dynamic page type handling (HTML, Image, Video)
* 🧠 Object-Oriented backend design
* 💻 Interactive web UI (HTML, CSS, JavaScript)
* 🌦️ Real-time weather using geolocation API
* 📍 Automatic location detection
* 🎨 Dynamic weather icons based on conditions
* ⭐ Custom shortcuts system
* 🕘 History panel with live updates

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)
        ↓ fetch()
C++ Backend Server (httplib)
        ↓
Tab + History + Page System
```

---

## 🧩 OOP Concepts Implemented (Backend)

| Concept       | Implementation                              |
| ------------- | ------------------------------------------- |
| Encapsulation | Private data members with controlled access |
| Abstraction   | API endpoints used by frontend              |
| Inheritance   | WebPage → HTMLPage, ImagePage, VideoPage    |
| Polymorphism  | Runtime binding using render()              |
| Composition   | Browser → Tabs → History → Pages            |

---

## 📁 Project Structure

```
project-root/
├── Backend/
│   ├── server.cpp
│   ├── Browser.cpp / .h
│   ├── Tab.cpp / .h
│   ├── History.cpp / .h
│   ├── WebPage.cpp / .h
│   └── ...
│
├── Frontend/
│   ├── index.html
│   ├── style.css
│   ├── index.js
│
├── README.md
└── .gitignore
```

---

## ⚙️ How to Run

### 🔹 Step 1: Start Backend (C++ Server)

```bash
cd Backend
g++ server.cpp -o server -std=gnu++17 -lws2_32 -pthread
./server
```

---

### 🔹 Step 2: Run Frontend

* Open `Frontend/index.html` using Live Server (VS Code)
  **OR**
* Open directly in browser

---

### 🔹 Step 3: Use the Browser UI

* Open tabs
* Navigate using address bar
* Use back/forward
* View history
* Check weather widget

---

## 🌦️ Weather Feature

* Uses **Geolocation API** to detect user location
* Fetches weather from **Open-Meteo API**
* Converts weather codes to dynamic icons
* Displays:

  * Temperature 🌡️
  * Location 📍
  * Weather condition 🌦️

---

## 🔍 Sample Workflow

```
1. Open new tab
2. Click shortcut (YouTube)
3. Navigate to another page
4. Use back/forward
5. View history panel
6. See real-time weather update
```

---

## ⚠️ Limitations

* ❌ Not a real browser (simulated rendering)
* ❌ No actual internet page loading
* ❌ Limited to predefined page types
* ⚠️ Geolocation accuracy may vary

---

## ⭐ Future Improvements

* Add real HTTP requests (cURL integration)
* Bookmark system
* Download manager simulation
* UI animations & transitions
* Authentication system
* Deploy as a web application

---

## 🎓 Academic Context

* **Course:** Object-Oriented Programming
* **Institute:** NIT Silchar
* **Batch:** 2024

---

## 👥 Team Members

* **Abhijnyan Saikia**
* **Anushya Rai**
* **Alindo Sarker Duranto**
* **Gaurav Gope**

NIT Silchar

---

## ⭐ If you like this project

Give it a ⭐ on GitHub and share your feedback!
