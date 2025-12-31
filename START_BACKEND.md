# Starting the Quantum Platform Backend

The backend is built with Flask and requires Python installed.

## Prerequisites
- Python 3.8+
- Dependencies listed in `requirements.txt`

## Quick Start

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server:**
   ```bash
   python app.py
   ```

4. **Verification:**
   You should see output similar to:
   ```
   * Running on http://127.0.0.1:5000
   ```

## Troubleshooting

### "python: command not found"
- Use `python3` instead: `python3 app.py`

### "Module not found" errors
- Re-run: `pip install -r requirements.txt`

### Port 5000 already in use
- Close other programs using port 5000. Under Windows, you can use `netstat -ano | findstr :5000` to find the process ID and then `taskkill /PID <PID> /F` to kill it.

## Backend Features
- **Real-time Data API**: Serves hospital and warehouse digital twin data.
- **Quantum Optimization**: Integrates with Qiskit for route and allocation optimization.
- **AI Integration**: Ready for Google Gemini and ElevenLabs (configure keys in `app.py`).
- **Data Upload**: Supports CSV uploads for custom state initialization.
