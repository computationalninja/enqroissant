from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import random
import time
import traceback
import csv
import io
from datetime import datetime, timedelta
from quantum_optimizer import QuantumOptimizer

import google.generativeai as genai
from elevenlabs.client import ElevenLabs

app = Flask(__name__)
# Configure CORS to allow all origins for development
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

optimizer = QuantumOptimizer()

# Configure APIs (User should set these env vars or replace values for demo)
# For demo purposes, we will use mock responses if keys are missing
GEMINI_API_KEY = "YOUR_GEMINI_KEY"
ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_KEY"

try:
    if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_KEY":
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel('gemini-pro')
        GEMINI_AVAILABLE = True
    else:
        GEMINI_AVAILABLE = False
except Exception as e:
    GEMINI_AVAILABLE = False
    print(f"Warning: Gemini API not available: {e}")

try:
    if ELEVENLABS_API_KEY and ELEVENLABS_API_KEY != "YOUR_ELEVENLABS_KEY":
        eleven = ElevenLabs(api_key=ELEVENLABS_API_KEY)
        ELEVENLABS_AVAILABLE = True
    else:
        ELEVENLABS_AVAILABLE = False
except Exception as e:
    ELEVENLABS_AVAILABLE = False
    print(f"Warning: ElevenLabs API not configured: {e}")

@app.route('/api/ai/chat', methods=['POST'])
def chat_with_gemini():
    """Chat using Google Gemini"""
    data = request.get_json()
    prompt = data.get('prompt', '')
    context = data.get('context', 'dashboard')
    
    if not prompt:
        return jsonify({'status': 'error', 'message': 'No prompt provided'}), 400

    if GEMINI_AVAILABLE:
        try:
            # Add context to prompt
            system_instruction = f"You are an AI assistant for a Quantum Digital Twin platform managing {context}. Keep responses concise and professional."
            response = gemini_model.generate_content(f"{system_instruction}\nUser: {prompt}")
            return jsonify({'status': 'success', 'response': response.text})
        except Exception as e:
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        # Mock response for demo
        responses = [
            f"Based on the {context} data, efficiency is up by 15%.",
            f"I've analyzed the {context} metrics. Operations are optimal.",
            f"Quantum optimization suggests reallocating resources in the {context}."
        ]
        return jsonify({'status': 'success', 'response': random.choice(responses)})

@app.route('/api/ai/speak', methods=['POST'])
def text_to_speech():
    """Generate speech using ElevenLabs"""
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'status': 'error', 'message': 'No text provided'}), 400

    if ELEVENLABS_AVAILABLE:
        try:
            audio = eleven.generate(
                text=text,
                voice="Rachel",
                model="eleven_monolingual_v1"
            )
            # Send audio bytes
            return send_file(
                io.BytesIO(b"".join(audio)),
                mimetype="audio/mpeg"
            )
        except Exception as e:
            print(f"ElevenLabs error: {e}")
            return jsonify({'status': 'error', 'message': str(e)}), 500
    else:
        return jsonify({'status': 'mock', 'message': 'ElevenLabs not configured'}), 200

# Mock data storage
metrics_data = {
    'activeOptimizations': 0,
    'responseTime': 0,
    'accuracy': 0,
    'errors': 0,
    'costSaved': 0,
    'energySaved': 0
}

hospital_stats = {
    'totalBeds': 100,
    'occupied': 65,
    'available': 35,
    'occupiedColor': '#ef4444',
    'labelPrefix': 'Room'
}

warehouse_stats = {
    'totalShelves': 50,
    'occupied': 30,
    'available': 20,
    'occupiedColor': '#f59e0b',
    'labelPrefix': 'S'
}

# Demo mode flag - when True, uses manual data instead of random
demo_mode = False
custom_mode = False
uploaded_data = {
    'hospital': [],
    'warehouse': []
}
current_dataset_info = {
    'type': None,
    'count': 0,
    'filename': None,
    'timestamp': None
}

chart_data = {
    'responseTimes': [],
    'accuracy': [],
    'errors': [],
    'costSaved': [],
    'energySaved': []
}

def generate_chart_data():
    """Generate mock time series data"""
    now = datetime.now()
    data_points = []
    
    for i in range(10):
        timestamp = now - timedelta(seconds=(9-i) * 2)
        data_points.append({
            'time': f'{(9-i) * 2}s',
            'value': random.randint(50, 150)
        })
    
    return data_points

@app.route('/api/metrics', methods=['GET'])
def get_metrics():
    """Get real-time metrics"""
    # Only update randomly if not in demo mode
    if not demo_mode:
        metrics_data['activeOptimizations'] = random.randint(5, 15)
        metrics_data['responseTime'] = random.randint(80, 150)
        metrics_data['accuracy'] = random.randint(92, 98)
        metrics_data['errors'] = random.randint(0, 5)
        metrics_data['costSaved'] = random.randint(80, 150)
        metrics_data['energySaved'] = random.randint(80, 150)
    
    return jsonify(metrics_data)

@app.route('/api/monitoring', methods=['GET'])
def get_monitoring():
    """Get monitoring chart data"""
    chart_data['responseTimes'] = generate_chart_data()
    chart_data['accuracy'] = [
        {'time': f'{i * 2}s', 'value': random.randint(90, 99)}
        for i in range(10)
    ]
    chart_data['errors'] = [
        {'time': f'{i * 2}s', 'value': random.randint(0, 8)}
        for i in range(10)
    ]
    
    return jsonify(chart_data)

@app.route('/api/hospital/stats', methods=['GET'])
def get_hospital_stats():
    """Get hospital statistics"""
    if not demo_mode and not custom_mode:
        hospital_stats['occupied'] = random.randint(60, 75)
        hospital_stats['available'] = hospital_stats['totalBeds'] - hospital_stats['occupied']
        if 'bedData' in hospital_stats:
            del hospital_stats['bedData']
    elif custom_mode and uploaded_data['hospital']:
        hospital_stats['bedData'] = uploaded_data['hospital']
        hospital_stats['totalBeds'] = len(uploaded_data['hospital'])
        occupied_count = sum(1 for bed in uploaded_data['hospital'] if bed.get('status', '').lower() in ['occupied', 'cleaning', 'critical'])
        hospital_stats['occupied'] = occupied_count
        hospital_stats['available'] = hospital_stats['totalBeds'] - hospital_stats['occupied']
    else:
        hospital_stats['available'] = hospital_stats['totalBeds'] - hospital_stats['occupied']
    
    if 'occupiedColor' not in hospital_stats:
        hospital_stats['occupiedColor'] = '#ef4444'
    if 'labelPrefix' not in hospital_stats:
        hospital_stats['labelPrefix'] = 'Room'
    
    return jsonify(hospital_stats)

@app.route('/api/warehouse/stats', methods=['GET'])
def get_warehouse_stats():
    """Get warehouse statistics"""
    if not demo_mode and not custom_mode:
        warehouse_stats['occupied'] = random.randint(25, 35)
        warehouse_stats['available'] = warehouse_stats['totalShelves'] - warehouse_stats['occupied']
        if 'shelfData' in warehouse_stats:
            del warehouse_stats['shelfData']
    elif custom_mode and uploaded_data['warehouse']:
        warehouse_stats['shelfData'] = uploaded_data['warehouse']
        warehouse_stats['totalShelves'] = len(uploaded_data['warehouse'])
        occupied_count = sum(1 for shelf in uploaded_data['warehouse'] if int(shelf.get('item_count', 0)) > 0)
        warehouse_stats['occupied'] = occupied_count
        warehouse_stats['available'] = warehouse_stats['totalShelves'] - warehouse_stats['occupied']
    else:
        warehouse_stats['available'] = warehouse_stats['totalShelves'] - warehouse_stats['occupied']
    
    if 'occupiedColor' not in warehouse_stats:
        warehouse_stats['occupiedColor'] = '#f59e0b'
    if 'labelPrefix' not in warehouse_stats:
        warehouse_stats['labelPrefix'] = 'S'
    
    return jsonify(warehouse_stats)

@app.route('/api/optimize', methods=['POST'])
def optimize():
    """Run quantum optimization"""
    data = request.get_json()
    optimization_type = data.get('type', 'hospital')
    
    try:
        # Simulate optimization processing time
        time.sleep(1)
        
        # Run quantum optimization
        result = optimizer.optimize(optimization_type)
        
        # Update metrics
        metrics_data['activeOptimizations'] += 1
        metrics_data['responseTime'] = result.get('response_time', random.randint(80, 150))
        metrics_data['accuracy'] = result.get('accuracy', random.randint(92, 98))
        
        return jsonify({
            'status': 'success',
            'message': f'Optimization completed for {optimization_type}',
            'result': result
        })
    except Exception as e:
        metrics_data['errors'] += 1
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/demo/update', methods=['POST'])
def update_demo_data():
    """Update demo data manually"""
    global demo_mode, hospital_stats, warehouse_stats, metrics_data
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'status': 'error', 'message': 'No data provided'}), 400
        
        # Validate and update hospital data
        if data.get('hospital'):
            hospital_data = data['hospital']
            try:
                if 'totalBeds' in hospital_data:
                    hospital_stats['totalBeds'] = int(hospital_data['totalBeds'])
                if 'occupied' in hospital_data:
                    hospital_stats['occupied'] = int(hospital_data['occupied'])
                if 'occupiedColor' in hospital_data:
                    hospital_stats['occupiedColor'] = str(hospital_data['occupiedColor'])
                if 'labelPrefix' in hospital_data:
                    hospital_stats['labelPrefix'] = str(hospital_data['labelPrefix'])
                hospital_stats['available'] = hospital_stats['totalBeds'] - hospital_stats['occupied']
            except (ValueError, TypeError) as e:
                return jsonify({'status': 'error', 'message': f'Hospital data error: {str(e)}'}), 400
        
        # Validate and update warehouse data
        if data.get('warehouse'):
            warehouse_data = data['warehouse']
            try:
                if 'totalShelves' in warehouse_data:
                    warehouse_stats['totalShelves'] = int(warehouse_data['totalShelves'])
                if 'occupied' in warehouse_data:
                    warehouse_stats['occupied'] = int(warehouse_data['occupied'])
                if 'occupiedColor' in warehouse_data:
                    warehouse_stats['occupiedColor'] = str(warehouse_data['occupiedColor'])
                if 'labelPrefix' in warehouse_data:
                    warehouse_stats['labelPrefix'] = str(warehouse_data['labelPrefix'])
                warehouse_stats['available'] = warehouse_stats['totalShelves'] - warehouse_stats['occupied']
            except (ValueError, TypeError) as e:
                return jsonify({'status': 'error', 'message': f'Warehouse data error: {str(e)}'}), 400
        
        # Validate and update metrics data
        if data.get('metrics'):
            m_data = data['metrics']
            try:
                if 'activeOptimizations' in m_data: metrics_data['activeOptimizations'] = int(m_data['activeOptimizations'])
                if 'responseTime' in m_data: metrics_data['responseTime'] = int(m_data['responseTime'])
                if 'accuracy' in m_data: metrics_data['accuracy'] = int(m_data['accuracy'])
                if 'errors' in m_data: metrics_data['errors'] = int(m_data['errors'])
            except (ValueError, TypeError) as e:
                return jsonify({'status': 'error', 'message': f'Metrics data error: {str(e)}'}), 400
        
        demo_mode = True
        return jsonify({'status': 'success', 'message': 'Demo data updated', 'data': {'hospital': hospital_stats, 'warehouse': warehouse_stats, 'metrics': metrics_data}})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/demo/reset', methods=['POST'])
def reset_demo_data():
    """Reset to random data mode"""
    global demo_mode, custom_mode, uploaded_data
    demo_mode = False
    custom_mode = False
    uploaded_data = {'hospital': [], 'warehouse': []}
    return jsonify({'status': 'success', 'message': 'Reset to random data mode'})

@app.route('/api/hospital/next-available', methods=['GET'])
def get_next_available_room():
    """Get next available room number"""
    available = hospital_stats['available']
    occupied = hospital_stats['occupied']
    if available > 0:
        return jsonify({'status': 'success', 'nextAvailableRoom': occupied + 1, 'totalAvailable': available})
    return jsonify({'status': 'no_availability', 'message': 'No rooms available', 'nextAvailableRoom': None})

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/upload/dataset', methods=['POST'])
def upload_dataset():
    """Upload a CSV dataset"""
    global custom_mode, uploaded_data, current_dataset_info, demo_mode
    if 'file' not in request.files:
        return jsonify({'status': 'error', 'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected file'}), 400
    if file:
        try:
            stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
            csv_input = csv.DictReader(stream)
            data_list = list(csv_input)
            if not data_list:
                return jsonify({'status': 'error', 'message': 'Empty CSV file'}), 400
            headers = set(data_list[0].keys())
            dataset_type = None
            if 'bed_id' in headers:
                dataset_type = 'hospital'
            elif 'shelf_id' in headers:
                dataset_type = 'warehouse'
            else:
                return jsonify({'status': 'error', 'message': 'Unknown dataset format'}), 400
            uploaded_data[dataset_type] = data_list
            custom_mode = True
            demo_mode = False
            current_dataset_info = {'type': dataset_type, 'count': len(data_list), 'filename': file.filename, 'timestamp': datetime.now().isoformat()}
            return jsonify({'status': 'success', 'message': f'Loaded {len(data_list)} rows for {dataset_type}'})
        except Exception as e:
            return jsonify({'status': 'error', 'message': f'Failed to parse CSV: {str(e)}'}), 500

@app.route('/api/dataset/current', methods=['GET'])
def get_current_dataset():
    """Get info about currently loaded dataset"""
    return jsonify({'status': 'success', 'isCustom': custom_mode, 'info': current_dataset_info})

@app.route('/api/demo/simulate', methods=['POST'])
def simulate_data():
    """Simulate random changes in uploaded data"""
    global uploaded_data, custom_mode
    if not custom_mode:
        return jsonify({'status': 'ignored', 'message': 'Not in custom mode'})
    changes = []
    try:
        if uploaded_data['hospital']:
            for _ in range(random.randint(1, 2)):
                idx = random.randint(0, len(uploaded_data['hospital']) - 1)
                bed = uploaded_data['hospital'][idx]
                bed['status'] = 'occupied' if bed.get('status', 'available').lower() == 'available' else 'available'
                changes.append(f"Bed {bed.get('bed_id', idx)} status toggled")
        if uploaded_data['warehouse']:
            for _ in range(random.randint(1, 2)):
                idx = random.randint(0, len(uploaded_data['warehouse']) - 1)
                shelf = uploaded_data['warehouse'][idx]
                try:
                    count = int(shelf.get('item_count', 0))
                    shelf['item_count'] = str(max(0, count + random.randint(-5, 5)))
                    changes.append(f"Shelf {shelf.get('shelf_id', idx)} count updated")
                except: pass
        return jsonify({'status': 'success', 'changes': changes})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
