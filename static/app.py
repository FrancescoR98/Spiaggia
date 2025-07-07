from flask import Flask, request, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

DATA_DIR = "dati"
os.makedirs(DATA_DIR, exist_ok=True)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/save/<date>', methods=['POST'])
def save(date):
    data = request.get_json()
    filepath = os.path.join(DATA_DIR, f"{date}.json")
    with open(filepath, 'w') as f:
        json.dump(data, f)
    return '', 200

@app.route('/load/<date>')
def load(date):
    filepath = os.path.join(DATA_DIR, f"{date}.json")
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            return jsonify(json.load(f))
    else:
        return jsonify({})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')