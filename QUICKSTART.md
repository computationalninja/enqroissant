# 🚀 Quick Start Guide

Follow these steps to get the Quantum Digital Twin Platform running in minutes.

## 📦 Prerequisites

- **Node.js** (v18.0.0 or higher)
- **Python** (v3.9 or higher)
- **Git**

## 🛠️ Step 1: Environment Setup

We've simplified the setup process with automated scripts.

### Windows
```powershell
./setup.bat
```

### Mac / Linux
```bash
chmod +x setup.sh
./setup.sh
```

*This will install all npm packages and python dependencies.*

## 🏃 Step 2: Launch the Servers

You need to run both the **Frontend (Vite)** and **Backend (Flask)**.

### Using Startup Scripts (Recommended)
- **Windows:** Double-click `start.bat`
- **Mac/Linux:** Run `./start.sh`

### Manual Start (Alternative)
If you prefer separate terminals:

**Terminal 1 (Backend):**
```bash
cd backend
python app.py
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 🌐 Step 3: Access the Dashboard

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

---

## 💡 Pro Tips for Judges/Demo

1. **Dashboard Overload**: Start on the Home page to see the live monitoring charts updating every 2 seconds.
2. **Interactive 3D**: Go to the **Hospital** or **Warehouse** tabs. You can rotate (left-click), zoom (scroll), and pan (right-click) the 3D models.
3. **Voice First**: The AI assistant (purple button, bottom-right) is the star! Ask it questions about the data you see on screen.
4. **Custom Data**: Use the **Settings/Control Panel** to upload the CSV files found in the `sample_data/` folder.

## 🐛 Common Fixes

- **CORS Errors**: Ensure the backend is running on `localhost:5000`.
- **Node Modules**: If the frontend fails to build, delete `node_modules` and re-run `npm install`.
- **Python Path**: If `python` doesn't work, try `python3`.

---

Happy Optimizing! 🌌
