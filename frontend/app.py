import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path
import sys
import json
import tempfile
import os

# Ajouter le chemin du backend pour les imports
sys.path.append(str(Path(__file__).parent.parent))

# Import de l'orchestrator
try:
    from backend.agents.orchestrator import analyze_candidates
except ImportError:
    st.error("⚠️ Impossible d'importer l'orchestrator. Vérifiez la structure du projet.")
    analyze_candidates = None


# ========== CONFIGURATION PAGE ==========
st.set_page_config(
    page_title="Analyseur Intelligent de CVs",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ========== CSS CUSTOM ==========
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        color: #1f77b4;
        margin-bottom: 2rem;
    }
    .score-card {
        padding: 1.5rem;
        border-radius: 10px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .high-score {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }
    .medium-score {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
    }
    .low-score {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
    }
</style>
""", unsafe_allow_html=True)


# ========== FONCTIONS UTILITAIRES ==========

def save_uploaded_file(uploaded_file):
    """Sauvegarde temporairement un fichier uploadé."""
    try:
        temp_dir = tempfile.mkdtemp()
        file_path = os.path.join(temp_dir, uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        return file_path
    except Exception as e:
        st.error(f"Erreur lors de la sauvegarde du fichier: {str(e)}")
        return None


def get_score_color(score):
    """Retourne la classe CSS selon le score."""
    if score >= 75:
        return "high-score"
    elif score >= 50:
        return "medium-score"
    else:
        return "low-score"


def create_radar_chart(candidate_data, job_skills):
    """Crée un graphique radar pour les compétences."""
    skills = candidate_data.get("skills", [])[:5]  # Top 5 compétences
    
    # Simulation de scores pour la démo (à adapter avec vraie logique)
    skill_scores = {skill: 80 + (hash(skill) % 20) for skill in skills}
    
    fig = go.Figure()
    
    fig.add_trace(go.Scatterpolar(
        r=list(skill_scores.values()),
        theta=list(skill_scores.keys()),
        fill='toself',
        name=candidate_data.get("name", "Candidat")
    ))
    
    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 100])
        ),
        showlegend=True,
        title="Compétences Clés"
    )
    
    return fig


def create_score_chart(candidates):
    """Crée un graphique à barres des scores."""
    df = pd.DataFrame([
        {
            "Candidat": c.get("name", "Inconnu"),
            "Score": c.get("score", 0)
        }
        for c in candidates if c.get("status") == "success"
    ])
    
    if df.empty:
        return None
    
    fig = px.bar(
        df,
        x="Candidat",
        y="Score",
        color="Score",
        color_continuous_scale="Viridis",
        title="Scores de Compatibilité",
        labels={"Score": "Score (/100)"}
    )
    
    fig.update_layout(
        xaxis_title="Candidats",
        yaxis_title="Score de Compatibilité",
        yaxis_range=[0, 100]
    )
    
    return fig


# ========== INTERFACE PRINCIPALE ==========

def main():
    # En-tête
    st.markdown('<h1 class="main-header">📄 Analyseur Intelligent de CVs</h1>', unsafe_allow_html=True)
    st.markdown("---")
    
    # Sidebar - Instructions
    with st.sidebar:
        st.header("📋 Instructions")
        st.markdown("""
        1. **Uploadez** un ou plusieurs CVs (PDF ou TXT)
        2. **Saisissez** la description du poste
        3. **Cliquez** sur "Analyser les CVs"
        4. **Consultez** les résultats et recommandations
        """)
        
        st.markdown("---")
        st.info("💡 **Astuce**: Plus la description du poste est détaillée, meilleurs seront les résultats!")
    
    # Section 1: Upload CVs
    st.header("1️⃣ Upload des CVs")
    uploaded_files = st.file_uploader(
        "Sélectionnez un ou plusieurs CVs",
        type=["pdf", "txt"],
        accept_multiple_files=True,
        help="Formats acceptés: PDF, TXT"
    )
    
    if uploaded_files:
        st.success(f"✅ {len(uploaded_files)} fichier(s) chargé(s)")
        with st.expander("📂 Voir les fichiers"):
            for file in uploaded_files:
                st.write(f"- {file.name} ({file.size / 1024:.1f} KB)")
    
    st.markdown("---")
    
    # Section 2: Description du poste
    st.header("2️⃣ Description du Poste")
    job_description = st.text_area(
        "Décrivez le poste recherché",
        placeholder="""Exemple:
Nous recherchons un Développeur Python Senior avec:
- 5+ ans d'expérience en Python
- Expertise en Machine Learning et Deep Learning
- Connaissance de LangChain, TensorFlow
- Expérience avec des projets IA en production
- Compétences en Cloud (AWS/GCP)
- Anglais courant""",
        height=200
    )
    
    st.markdown("---")
    
    # Section 3: Bouton d'analyse
    st.header("3️⃣ Analyse")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        analyze_button = st.button(
            "Analyser les CVs",
            type="primary",
            use_container_width=True
        )
    
    # ========== TRAITEMENT ==========
    
    if analyze_button:
        # Validation
        if not uploaded_files:
            st.error("❌ Veuillez uploader au moins un CV")
            return
        
        if not job_description or len(job_description.strip()) < 20:
            st.error("❌ Veuillez fournir une description du poste plus détaillée (minimum 20 caractères)")
            return
        
        if analyze_candidates is None:
            st.error("❌ L'orchestrator n'est pas disponible. Vérifiez votre configuration.")
            return
        
        # Sauvegarde temporaire des fichiers
        st.info("⏳ Traitement en cours... Cela peut prendre quelques secondes.")
        
        temp_files = []
        with st.spinner("📂 Préparation des fichiers..."):
            for uploaded_file in uploaded_files:
                temp_path = save_uploaded_file(uploaded_file)
                if temp_path:
                    temp_files.append(temp_path)
        
        if not temp_files:
            st.error("❌ Erreur lors de la préparation des fichiers")
            return
        
        # Appel de l'orchestrator
        with st.spinner("Analyse des CVs par l'IA..."):
            try:
                results = analyze_candidates(temp_files, job_description)
            except Exception as e:
                st.error(f"❌ Erreur lors de l'analyse: {str(e)}")
                return
        
        # Nettoyage des fichiers temporaires
        for temp_file in temp_files:
            try:
                os.remove(temp_file)
            except:
                pass
        
        # ========== AFFICHAGE RÉSULTATS ==========
        
        if results.get("status") == "error":
            st.error(f"❌ {results.get('error_message', 'Erreur inconnue')}")
            return
        
        st.success("✅ Analyse terminée avec succès!")
        st.markdown("---")
        
        # Section 4: Statistiques globales
        st.header("Statistiques Globales")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric(
                "CVs Analysés",
                results.get("successful_analyses", 0),
                f"sur {results.get('total_candidates', 0)}"
            )
        
        with col2:
            avg_score = results.get("average_score", 0)
            st.metric("Score Moyen", f"{avg_score:.1f}/100")
        
        with col3:
            candidates = results.get("candidates", [])
            best_candidate = candidates[0] if candidates else None
            if best_candidate:
                st.metric(
                    "Meilleur Candidat",
                    best_candidate.get("name", "N/A"),
                    f"{best_candidate.get('score', 0)}/100"
                )
        
        st.markdown("---")
        
        # Section 5: Graphiques
        st.header("Visualisations")
        
        candidates = results.get("candidates", [])
        successful_candidates = [c for c in candidates if c.get("status") == "success"]
        
        if successful_candidates:
            col1, col2 = st.columns(2)
            
            with col1:
                score_chart = create_score_chart(successful_candidates)
                if score_chart:
                    st.plotly_chart(score_chart, use_container_width=True)
            
            with col2:
                if successful_candidates:
                    radar_chart = create_radar_chart(successful_candidates[0], job_description)
                    st.plotly_chart(radar_chart, use_container_width=True)
        
        st.markdown("---")
        
        # Section 6: Tableau détaillé des candidats
        st.header("Résultats Détaillés")
        
        for idx, candidate in enumerate(candidates, 1):
            if candidate.get("status") == "error":
                with st.expander(f"❌ {candidate.get('name', f'Candidat {idx}')} - Erreur"):
                    st.error(candidate.get("error_message", "Erreur inconnue"))
                continue
            
            score = candidate.get("score", 0)
            score_class = get_score_color(score)
            
            with st.expander(f"{'🥇' if idx == 1 else '🥈' if idx == 2 else '🥉' if idx == 3 else '📄'} {candidate.get('name', f'Candidat {idx}')} - Score: {score}/100"):
                
                # Score Card
                st.markdown(f"""
                <div class="score-card {score_class}">
                    <h2>Score de Compatibilité: {score}/100</h2>
                    <p>{'✅ Compatible ATS' if candidate.get('ats_compatible') else '⚠️ Optimisation ATS recommandée'}</p>
                </div>
                """, unsafe_allow_html=True)
                
                st.markdown("---")
                
                # Détails en colonnes
                col1, col2 = st.columns(2)
                
                with col1:
                    st.subheader("Compétences")
                    skills = candidate.get("skills", [])
                    if skills:
                        for skill in skills[:10]:  # Top 10
                            st.write(f"• {skill}")
                    else:
                        st.write("_Aucune compétence extraite_")
                    
                    st.subheader("Formation")
                    education = candidate.get("education", [])
                    if education:
                        for edu in education:
                            st.write(f"• {edu}")
                    else:
                        st.write("_Aucune formation extraite_")
                
                with col2:
                    st.subheader("Points Forts")
                    strengths = candidate.get("strengths", [])
                    if strengths:
                        for strength in strengths:
                            st.success(f"✅ {strength}")
                    else:
                        st.write("_Non disponible_")
                    
                    st.subheader("⚠️ Points d'Amélioration")
                    weaknesses = candidate.get("weaknesses", [])
                    if weaknesses:
                        for weakness in weaknesses:
                            st.warning(f"⚠️ {weakness}")
                    else:
                        st.write("_Non disponible_")
                
                st.markdown("---")
                
                # Feedback
                st.subheader("📝 Feedback Global")
                st.info(candidate.get("feedback", "Aucun feedback disponible"))
                
                # Questions d'entretien
                st.subheader("❓ Questions Suggérées pour l'Entretien")
                questions = candidate.get("interview_questions", [])
                if questions:
                    for i, question in enumerate(questions, 1):
                        st.write(f"{i}. {question}")
                else:
                    st.write("_Aucune question générée_")
        
        st.markdown("---")
        
        # Section 7: Export des résultats
        st.header("Export des Résultats")
        
        col1, col2 = st.columns(2)
        
        with col1:
            # Export JSON
            json_str = json.dumps(results, indent=2, ensure_ascii=False)
            st.download_button(
                label="Télécharger JSON",
                data=json_str,
                file_name="resultats_analyse_cvs.json",
                mime="application/json"
            )
        
        with col2:
            # Export CSV
            if successful_candidates:
                df_export = pd.DataFrame([
                    {
                        "Nom": c.get("name"),
                        "Score": c.get("score"),
                        "Compatible ATS": "Oui" if c.get("ats_compatible") else "Non",
                        "Compétences": ", ".join(c.get("skills", [])[:5]),
                        "Feedback": c.get("feedback", "")[:100] + "..."
                    }
                    for c in successful_candidates
                ])
                
                csv = df_export.to_csv(index=False).encode('utf-8')
                st.download_button(
                    label="Télécharger CSV",
                    data=csv,
                    file_name="resultats_analyse_cvs.csv",
                    mime="text/csv"
                )


# ========== LANCEMENT ==========

if __name__ == "__main__":
    main()