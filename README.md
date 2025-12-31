# 🌌 Quantum Digital Twin Platform

> **Revolutionizing Operations through Voice-Enabled Quantum Optimization**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tech: React](https://img.shields.io/badge/Tech-React-blue.svg)](https://reactjs.org/)
[![Tech: Flask](https://img.shields.io/badge/Tech-Flask-lightgrey.svg)](https://flask.palletsprojects.com/)
[![Quantum: Qiskit](https://img.shields.io/badge/Quantum-Qiskit-purple.svg)](https://qiskit.org/)

## 🎯 Project Overview

Quantum Digital Twin Platform creates live virtual copies of physical operations (Hospitals & Warehouses) and leverages quantum-inspired algorithms to solve complex optimization problems in real-time. 

Users interact through a **Voice-First Interface** to instantly optimize patient flow, bed allocation, and warehouse logistics routing.

### 🚀 Key Features

- **🗣️ Voice Control Interface** - Natural language command processing powered by Google Gemini and ElevenLabs TTS.
- **⚡ Quantum Optimization Engine** - QAOA algorithms implemented via Qiskit for high-complexity resource allocation.
- **📊 3D Real-time Visualization** - Interactive Three.js digital twins showing live occupancy and movement.
- **📈 Advanced Observability** - Real-time metrics dashboard tracking optimization accuracy, system latency, and cost savings.
- **📂 Custom Data Support** - Upload your own datasets via CSV to initialize digital twins for any facility.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Three.js (React Three Fiber), Tailwind CSS, Framer Motion
- **Backend:** Python Flask, Qiskit (Quantum Computing), Google Generative AI (Gemini)
- **Voice:** ElevenLabs API (Polished Text-to-Speech)
- **Deployment:** Ready for Google Cloud (Vertex AI)

---

## 🏁 Quick Start

### 1️⃣ One-Click Setup
We provide setup scripts to automate dependency installation for both frontend and backend.

- **Windows:**
  ```powershell
  ./setup.bat
  ```
- **Mac/Linux:**
  ```bash
  chmod +x setup.sh && ./setup.sh
  ```

### 2️⃣ Launch the Platform
Once setup is complete, use the startup scripts to launch both servers simultaneously.

- **Windows:** `start.bat`
- **Mac/Linux:** `./start.sh`

**Access the dashboard:** [http://localhost:3000](http://localhost:3000)

---

## 🎮 Demo Guide

### 🎙️ Try Voice Commands
Click the microphone button in the bottom-right and try:
- *"Optimize hospital bed allocation"*
- *"Show me warehouse metrics"*
- *"How many beds are currently occupied in the hospital?"*
- *"Switch to warehouse view"*

### 🧪 manual Control
Navigate to the **Control Panel** to:
- Manually edit data points to see 3D models update in real-time.
- Start a **Live Simulation** to mimic active IoT sensor data.
- Upload custom datasets from the `sample_data/` folder.

---

## 🔬 How the Quantum Engine Works

The platform utilizes **QAOA (Quantum Approximate Optimization Algorithm)** to solve Combinatorial Optimization problems:
1. **Hospital Mode:** Solves the *Bed Assignment Problem* to minimize patient wait times and maximize throughput.
2. **Warehouse Mode:** Solves the *Traveling Salesperson Problem (TSP)* for path optimization of picking robots.

The engine uses a classical fallback system to ensure 100% uptime even when quantum hardware is unavailable.

---

## 🏆 Hackathon Integration Credits
- **Google Cloud:** Vertex AI integration points for model scaling.
- **ElevenLabs:** Premium voice synthesis for the AI assistant.

---

**Built with ❤️ for the Hackathon Excellence.**
