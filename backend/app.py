from flask import Flask, render_template, request, jsonify, send_file
import sys
from pathlib import Path
import json
import os
import tempfile
from werkzeug.utils import secure_filename

# Ajouter le chemin du backend
sys.path.append(str(Path(__file__).parent.parent))

# Import de l'orchestrator
try:
    from backend.agents.orchestrator import analyze_candidates
except ImportError:
    analyze_candidates = None
    print("⚠️ Impossible d'importer l'orchestrator")

app = Flask(
    __name__,
    template_folder="../frontend/templates"
    
)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max
app.config['UPLOAD_FOLDER'] = tempfile.mkdtemp()

# Extensions autorisées
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    """Page d'accueil avec le formulaire d'upload."""
    return render_template('index.html')


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Endpoint API pour analyser les CVs.
    Reçoit: fichiers CVs + description du poste
    Retourne: JSON avec les résultats
    """
    try:
        # Vérifier l'orchestrator
        if analyze_candidates is None:
            return jsonify({
                'status': 'error',
                'message': 'Orchestrator non disponible'
            }), 500
        
        # Récupérer les fichiers uploadés
        if 'cv_files' not in request.files:
            return jsonify({
                'status': 'error',
                'message': 'Aucun fichier uploadé'
            }), 400
        
        files = request.files.getlist('cv_files')
        job_description = request.form.get('job_description', '')
        
        # Validation
        if not files or files[0].filename == '':
            return jsonify({
                'status': 'error',
                'message': 'Aucun fichier sélectionné'
            }), 400
        
        if len(job_description.strip()) < 20:
            return jsonify({
                'status': 'error',
                'message': 'Description du poste trop courte (minimum 20 caractères)'
            }), 400
        
        # Sauvegarder les fichiers temporairement
        temp_files = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                temp_files.append(filepath)
        
        if not temp_files:
            return jsonify({
                'status': 'error',
                'message': 'Aucun fichier valide (formats acceptés: PDF, TXT)'
            }), 400
        
        # Appeler l'orchestrator
        results = analyze_candidates(temp_files, job_description)
        
        # Nettoyer les fichiers temporaires
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500


@app.route('/api/export/json', methods=['POST'])
def export_json():
    """Exporte les résultats en JSON."""
    try:
        data = request.get_json()
        
        # Créer un fichier temporaire
        temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        json.dump(data, temp_file, indent=2, ensure_ascii=False)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            mimetype='application/json',
            as_attachment=True,
            download_name='resultats_analyse_cvs.json'
        )
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/export/csv', methods=['POST'])
def export_csv():
    """Exporte les résultats en CSV."""
    try:
        import pandas as pd
        data = request.get_json()
        
        candidates = data.get('candidates', [])
        successful_candidates = [c for c in candidates if c.get('status') == 'success']
        
        df = pd.DataFrame([
            {
                "Nom": c.get("name"),
                "Score": c.get("score"),
                "Compatible ATS": "Oui" if c.get("ats_compatible") else "Non",
                "Compétences": ", ".join(c.get("skills", [])[:5]),
                "Feedback": c.get("feedback", "")[:100] + "..."
            }
            for c in successful_candidates
        ])
        
        # Créer un fichier temporaire
        temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.csv')
        df.to_csv(temp_file.name, index=False)
        temp_file.close()
        
        return send_file(
            temp_file.name,
            mimetype='text/csv',
            as_attachment=True,
            download_name='resultats_analyse_cvs.csv'
        )
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)