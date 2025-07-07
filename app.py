from flask import Flask, request, jsonify, send_from_directory
import os
import json

app = Flask(__name__, static_folder='static', static_url_path='')

# Assicurati che esistano le cartelle
os.makedirs('dati', exist_ok=True)
os.makedirs('static', exist_ok=True)

@app.route('/')
def home():
    return send_from_directory('static', 'index.html')

# Route per recuperare o salvare prenotazioni
@app.route('/dati/<data>.json', methods=['GET', 'POST'])
def gestisci_json(data):
    percorso_file = os.path.join('dati', f"{data}.json")

    if request.method == 'GET':
        if os.path.exists(percorso_file):
            return send_from_directory('dati', f"{data}.json")
        else:
            return jsonify({}), 404

    elif request.method == 'POST':
        aggiornamenti = request.get_json()

        # Caso 1: oggetto singolo (sovrascrivi)
        if isinstance(aggiornamenti, dict):
            with open(percorso_file, 'w', encoding='utf-8') as f:
                json.dump(aggiornamenti, f, ensure_ascii=False, indent=4)

        # Caso 2: lista (merge)
        elif isinstance(aggiornamenti, list):
            if os.path.exists(percorso_file):
                with open(percorso_file, 'r', encoding='utf-8') as f:
                    try:
                        esistenti = {el["id"]: el for el in json.load(f)}
                    except Exception:
                        esistenti = {}
            else:
                esistenti = {}

            for nuovo in aggiornamenti:
                esistenti[nuovo["id"]] = nuovo

            with open(percorso_file, "w", encoding="utf-8") as f:
                json.dump(list(esistenti.values()), f, ensure_ascii=False, indent=2)

        else:
            return jsonify({"status": "error", "message": "Formato dati non valido"}), 400

        return jsonify({"status": "success"}), 200

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
