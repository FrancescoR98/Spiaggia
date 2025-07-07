from flask import Flask, request, jsonify, send_from_directory
import os
import json
from datetime import datetime, timedelta

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

@app.route('/lettini/<data>.json', methods=['GET', 'POST'])
def gestisci_lettini(data):
    percorso = os.path.join('dati', f"lettini_{data}.json")

    if request.method == 'GET':
        if os.path.exists(percorso):
            return send_from_directory('dati', f"lettini_{data}.json")
        else:
            return jsonify([])

    elif request.method == 'POST':
        pren = request.get_json()
        if isinstance(pren, list):
            with open(percorso, 'w', encoding='utf-8') as f:
                json.dump(pren, f, ensure_ascii=False, indent=2)
            return jsonify({"status": "success"}), 200
        else:
            return jsonify({"status": "error", "message": "Formato dati non valido"}), 400

@app.route('/calendar')
def calendar_page():
    return send_from_directory('static', 'calendar.html')

@app.route('/dati-range/<start>/<end>')
def dati_range(start, end):
    try:
        start_date = datetime.fromisoformat(start).date()
        end_date = datetime.fromisoformat(end).date()
    except ValueError:
        return jsonify([])

    tasks = []
    open_tasks = {}
    day = start_date
    counter = 0

    while day <= end_date:
        fname = os.path.join('dati', f"{day.isoformat()}.json")
        if os.path.exists(fname):
            try:
                with open(fname, 'r', encoding='utf-8') as f:
                    records = {r['id']: r for r in json.load(f)}
            except Exception:
                records = {}
        else:
            records = {}

        # close or extend existing tasks
        for uid in list(open_tasks.keys()):
            rec = records.get(uid)
            ot = open_tasks[uid]
            if rec and rec.get('nome') == ot['nome'] and rec.get('stato') == ot['stato']:
                ot['end'] = day.isoformat()
            else:
                tasks.append(ot)
                del open_tasks[uid]

        # open new tasks
        for rec in records.values():
            nome = rec.get('nome') or ''
            stato = rec.get('stato')
            if nome and stato != 'libero' and rec['id'] not in open_tasks:
                open_tasks[rec['id']] = {
                    'id': f"{rec['id']}_{counter}",
                    'name': f"{nome} ({rec['id']})",
                    'start': day.isoformat(),
                    'end': day.isoformat(),
                    'stato': stato
                }
                counter += 1

        day += timedelta(days=1)

    tasks.extend(open_tasks.values())

    # make end date inclusive for gantt
    for t in tasks:
        try:
            e = datetime.fromisoformat(t['end']) + timedelta(days=1)
            t['end'] = e.date().isoformat()
        except Exception:
            pass

    return jsonify(tasks)

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)
