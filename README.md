# 🌐 Web Browser Simulation (C++ OOP + Frontend UI)

A web browser simulation built using **C++ and Object-Oriented Programming (OOP)** concepts, with an additional **frontend interface for visualization**.

> 📍 Developed as part of OOP coursework at NIT Silchar

---

## 📌 Overview

This project simulates how a real web browser works internally, including:

- Tab management  
- Page rendering  
- Navigation history  

The **core logic is implemented in C++**, where all browser functionalities are handled using classes and objects.

A simple **HTML-based frontend** is also included to visually represent browser components like tabs and address bar.

> ⚠️ The frontend is for demonstration only and is not connected to the C++ backend.

---

## 🚀 Features

- 🗂️ Multi-tab system  
- 🔄 Back & Forward navigation (using stacks)  
- 🌐 Automatic page type detection  
- 🧠 Runtime polymorphism using `render()`  
- 🖥️ C++ backend logic  
- 🎨 Frontend UI simulation  

---

## 🏗️ Architecture

```
Browser
│
├── Tabs
│   ├── WebPage (Base Class)
│   │   ├── HTMLPage
│   │   ├── ImagePage
│   │   └── VideoPage
│   │
│   └── History
│       ├── Back Stack
│       └── Forward Stack
```

---

## 🧩 OOP Concepts Used

- **Encapsulation** → Data hidden using private members  
- **Abstraction** → Simple user commands  
- **Inheritance** → Page types derived from WebPage  
- **Polymorphism** → `render()` behaves differently  
- **Composition** → Browser → Tabs → Pages  

---

## 📁 Folder Structure

```
src/
├── Browser
├── Tab
├── History
├── WebPage
├── HTMLPage
├── ImagePage
├── VideoPage

frontend/
└── index.html
```

---

## ⚙️ Run the Project

### Compile

```bash
g++ -std=c++11 -o browser src/*.cpp
```

### Run

```bash
./browser
```

---

## 💻 Commands

| Command        | Action              |
|----------------|--------------------|
| open <url>     | Open page          |
| back           | Go back            |
| forward        | Go forward         |
| newtab         | New tab            |
| tabs           | Show tabs          |
| history        | Show history       |
| exit           | Exit browser       |

---

## 🎮 Example

```
> open index.html
[HTML PAGE] Loading...

> open image.jpg
[IMAGE PAGE] Displaying...

> back
Navigating back...
```

---

## 🌐 Frontend (UI Demo)

- Browser-like interface  
- Tabs and address bar  
- Visual simulation only  

⚠️ Not connected to backend logic

---

## ⚠️ Limitations

- No real internet access  
- No backend-frontend integration  
- Rendering is simulated  

---

## 🚀 Future Scope

- Connect frontend with backend  
- Add real HTTP requests  
- GUI improvements  
- Download manager  

---

## 🎓 Academic Info

- **Course:** Object-Oriented Programming  
- **Institute:** NIT Silchar  
- **Year:** 2024  

---

## 📜 License

For academic use only.
