# 🌐 Console-Based Web Browser Simulation (C++)

A console-based C++ application that simulates the internal working of a web browser using Object-Oriented Programming (OOP) principles. Developed as part of the **OOP coursework at NIT Silchar (CSE Department)**.

---

## 📌 Project Overview

This project demonstrates how a real web browser operates internally — including tab management, page rendering, and navigation history — without using the internet.

All content is simulated within the console environment.

🎯 **Key Objective:**
To apply core OOP concepts in a clean, modular, and scalable design.

---

## 🚀 Key Features

* 🗂️ Multi-tab browsing system
* 🔄 Back and forward navigation using stacks
* 🌐 Dynamic page type handling (HTML, Image, Video)
* 🧠 Polymorphic rendering system
* 🖥️ Console-based interactive interface
* 🎨 Optional frontend simulation (HTML)

---

## 👥 Team Contributions

| Member   | Role              | Responsibilities                                 |
| -------- | ----------------- | ------------------------------------------------ |
| Person 1 | Browser System    | `Browser.h/cpp`, `main.cpp`, frontend simulation |
| Person 2 | Navigation System | `Tab`, `History` (stack-based navigation)        |
| Person 3 | Page System       | `WebPage` hierarchy (HTML, Image, Video)         |
| Person 4 | Integration       | Makefile, README, report, demo                   |

---

## 🏗️ System Architecture

```
Browser
├── manages → Tab[]
│   ├── contains → WebPage* (polymorphic)
│   │   ├── HTMLPage
│   │   ├── ImagePage
│   │   └── VideoPage
│   └── uses → History
│       ├── backStack
│       └── forwardStack
```

---

## 🧩 OOP Concepts Implemented

| Concept           | Implementation                              |
| ----------------- | ------------------------------------------- |
| **Encapsulation** | Private data members with controlled access |
| **Abstraction**   | User interacts via simple commands          |
| **Inheritance**   | Derived classes from `WebPage`              |
| **Polymorphism**  | Runtime binding using `render()`            |
| **Composition**   | Browser → Tabs → WebPages + History         |

---

## 📁 Project Structure

```
web-browser-simulation-cpp/
├── src/
│   ├── WebPage.h / .cpp
│   ├── HTMLPage.h / .cpp
│   ├── ImagePage.h / .cpp
│   ├── VideoPage.h / .cpp
│   ├── History.h / .cpp
│   ├── Tab.h / .cpp
│   ├── Browser.h / .cpp
│   └── main.cpp
├── frontend/
│   └── index.html
├── docs/
│   └── ProjectReport.pdf
├── Makefile
└── README.md
```

---

## ⚙️ Compilation & Execution

### 🔹 Using Makefile

```bash
make
./browser
```

### 🔹 Manual Compilation

```bash
g++ -std=c++11 -o browser src/main.cpp src/Browser.cpp src/Tab.cpp src/History.cpp \
src/WebPage.cpp src/HTMLPage.cpp src/ImagePage.cpp src/VideoPage.cpp

./browser
```

---

## 💻 Available Commands

| Command      | Description           |
| ------------ | --------------------- |
| `open <url>` | Open a webpage        |
| `back`       | Go to previous page   |
| `forward`    | Go to next page       |
| `newtab`     | Open a new tab        |
| `tabs`       | Show all tabs         |
| `history`    | Show browsing history |
| `exit`       | Exit browser          |

---

## 🔍 URL Type Detection

| Pattern                | Page Type | Output               |
| ---------------------- | --------- | -------------------- |
| `.html`, `.htm`        | HTMLPage  | Loading HTML content |
| `.jpg`, `.png`, `.gif` | ImagePage | Displaying image     |
| `.mp4`, `.mkv`, `.avi` | VideoPage | Streaming video      |

---

## 🎮 Sample Execution

```
=== Web Browser Simulation ===

> open index.html
[HTML PAGE] Loading: index.html

> open photo.jpg
[IMAGE PAGE] Displaying: photo.jpg

> back
Navigating back...

> forward
Navigating forward...

> newtab
Switched to Tab 2
```

---

## 🌐 Frontend Demo

A simple UI version is available:

📁 `frontend/index.html`

* Simulates browser UI
* Includes tabs, address bar, and navigation buttons
* Uses same underlying logic conceptually

---

## ⚠️ Limitations

* ❌ No real internet access
* ❌ Static simulated content
* ❌ Console-based (except frontend demo)

---

## 🎓 Academic Context

This project was developed as part of:

**Course:** Object-Oriented Programming
**Institute:** NIT Silchar
**Batch:** 2024

---

## 📜 License

This project is intended for academic and educational purposes only.

---

## ⭐ Future Improvements

* Add real HTTP requests (using libraries like cURL)
* GUI using Qt or web-based interface
* Bookmark system
* Download manager simulation

---

## 🙌 Acknowledgment

Special thanks to faculty and peers for guidance and support throughout the project.

---
# 🌐 Console-Based Web Browser Simulation (C++)

A console-based C++ application that simulates the internal working of a web browser using Object-Oriented Programming (OOP) principles. Developed as part of the **OOP coursework at NIT Silchar (CSE Department)**.

---

## 📌 Project Overview

This project demonstrates how a real web browser operates internally — including tab management, page rendering, and navigation history — without using the internet.

All content is simulated within the console environment.

🎯 **Key Objective:**
To apply core OOP concepts in a clean, modular, and scalable design.

---

## 🚀 Key Features

* 🗂️ Multi-tab browsing system
* 🔄 Back and forward navigation using stacks
* 🌐 Dynamic page type handling (HTML, Image, Video)
* 🧠 Polymorphic rendering system
* 🖥️ Console-based interactive interface
* 🎨 Optional frontend simulation (HTML)

---

## 👥 Team Contributions

| Member   | Role              | Responsibilities                                 |
| -------- | ----------------- | ------------------------------------------------ |
| Person 1 | Browser System    | `Browser.h/cpp`, `main.cpp`, frontend simulation |
| Person 2 | Navigation System | `Tab`, `History` (stack-based navigation)        |
| Person 3 | Page System       | `WebPage` hierarchy (HTML, Image, Video)         |
| Person 4 | Integration       | Makefile, README, report, demo                   |

---

## 🏗️ System Architecture

```
Browser
├── manages → Tab[]
│   ├── contains → WebPage* (polymorphic)
│   │   ├── HTMLPage
│   │   ├── ImagePage
│   │   └── VideoPage
│   └── uses → History
│       ├── backStack
│       └── forwardStack
```

---

## 🧩 OOP Concepts Implemented

| Concept           | Implementation                              |
| ----------------- | ------------------------------------------- |
| **Encapsulation** | Private data members with controlled access |
| **Abstraction**   | User interacts via simple commands          |
| **Inheritance**   | Derived classes from `WebPage`              |
| **Polymorphism**  | Runtime binding using `render()`            |
| **Composition**   | Browser → Tabs → WebPages + History         |

---

## 📁 Project Structure

```
web-browser-simulation-cpp/
├── src/
│   ├── WebPage.h / .cpp
│   ├── HTMLPage.h / .cpp
│   ├── ImagePage.h / .cpp
│   ├── VideoPage.h / .cpp
│   ├── History.h / .cpp
│   ├── Tab.h / .cpp
│   ├── Browser.h / .cpp
│   └── main.cpp
├── frontend/
│   └── index.html
├── docs/
│   └── ProjectReport.pdf
├── Makefile
└── README.md
```

---

## ⚙️ Compilation & Execution

### 🔹 Using Makefile

```bash
make
./browser
```

### 🔹 Manual Compilation

```bash
g++ -std=c++11 -o browser src/main.cpp src/Browser.cpp src/Tab.cpp src/History.cpp \
src/WebPage.cpp src/HTMLPage.cpp src/ImagePage.cpp src/VideoPage.cpp

./browser
```

---

## 💻 Available Commands

| Command      | Description           |
| ------------ | --------------------- |
| `open <url>` | Open a webpage        |
| `back`       | Go to previous page   |
| `forward`    | Go to next page       |
| `newtab`     | Open a new tab        |
| `tabs`       | Show all tabs         |
| `history`    | Show browsing history |
| `exit`       | Exit browser          |

---

## 🔍 URL Type Detection

| Pattern                | Page Type | Output               |
| ---------------------- | --------- | -------------------- |
| `.html`, `.htm`        | HTMLPage  | Loading HTML content |
| `.jpg`, `.png`, `.gif` | ImagePage | Displaying image     |
| `.mp4`, `.mkv`, `.avi` | VideoPage | Streaming video      |

---

## 🎮 Sample Execution

```
=== Web Browser Simulation ===

> open index.html
[HTML PAGE] Loading: index.html

> open photo.jpg
[IMAGE PAGE] Displaying: photo.jpg

> back
Navigating back...

> forward
Navigating forward...

> newtab
Switched to Tab 2
```

---

## 🌐 Frontend Demo

A simple UI version is available:

📁 `frontend/index.html`

* Simulates browser UI
* Includes tabs, address bar, and navigation buttons
* Uses same underlying logic conceptually

---

## ⚠️ Limitations

* ❌ No real internet access
* ❌ Static simulated content
* ❌ Console-based (except frontend demo)

---

## 🎓 Academic Context

This project was developed as part of:

**Course:** Object-Oriented Programming
**Institute:** NIT Silchar
**Batch:** 2024

---

## 📜 License

This project is intended for academic and educational purposes only.

---

## ⭐ Future Improvements

* Add real HTTP requests (using libraries like cURL)
* GUI using Qt or web-based interface
* Bookmark system
* Download manager simulation

---

## 🙌 Acknowledgment

Special thanks to faculty and peers for guidance and support throughout the project.

---
