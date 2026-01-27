# from langchain_openai import ChatOpenAI
from typing import List, Dict, Any
import os
from pathlib import Path

# Imports des autres agents (à adapter selon votre structure)
# from agents.extractor import ExtractorAgent
# from agents.analyzer_evaluator import AnalyzerEvaluatorAgent
from backend.agents.interview import InterviewAgent


class OrchestratorAgent:
    """
    Agent orchestrateur qui coordonne l'analyse complète des CVs.
    Gère le flux: Extraction → Analyse → Interview → Résultat final
    """

    def __init__(self):
        """Initialise l'orchestrateur et tous les agents sous-jacents."""
        # self.llm = ChatOpenAI(
        #    model="gpt-4o-mini",
        #    temperature=0,
        #    api_key=os.getenv("OPENAI_API_KEY")
        # )

        # Initialisation des agents (décommenter quand prêts)
        # self.extractor = ExtractorAgent()
        # self.analyzer = AnalyzerEvaluatorAgent()
        self.interview = InterviewAgent()

    def validate_inputs(self, cv_files: List[str], job_description: str) -> bool:
        """
        Valide les entrées avant traitement.

        Args:
            cv_files: Liste des chemins vers les CVs
            job_description: Description du poste

        Returns:
            bool: True si valide, False sinon
        """
        if not cv_files:
            raise ValueError("❌ Aucun CV fourni")

        if not job_description or len(job_description.strip()) < 10:
            raise ValueError("❌ Description du poste invalide ou trop courte")

        for cv_file in cv_files:
            if not Path(cv_file).exists():
                raise FileNotFoundError(f"❌ Fichier introuvable: {cv_file}")

            if not cv_file.lower().endswith(('.pdf', '.txt')):
                raise ValueError(f"❌ Format non supporté: {cv_file}")

        return True

    def process_single_cv(self, cv_file: str, job_description: str) -> Dict[str, Any]:
        """
        Traite un CV individuel à travers tous les agents.

        Args:
            cv_file: Chemin vers le CV
            job_description: Description du poste

        Returns:
            dict: Résultat complet de l'analyse
        """
        try:
            print(f"📄 Traitement de: {Path(cv_file).name}")

            # ÉTAPE 1: Extraction
            print("  → Extraction des données...")
            # extracted_data = self.extractor.run(cv_file)
            extracted_data = {
                "name": "Candidat Test",
                "skills": ["Python", "AI"],
                "experiences": ["Experience 1"],
                "education": ["Diplôme 1"],
                "languages": ["Français", "Anglais"]
            }  # MOCK - à remplacer

            # ÉTAPE 2: Analyse & Évaluation
            print("  → Analyse et évaluation...")
            # analysis_result = self.analyzer.run(extracted_data, job_description)
            analysis_result = {
                "compatibility_score": 75,
                "ats_compatible": True,
                "feedback": "Candidat prometteur",
                "strengths": ["Python", "AI"],
                "weaknesses": ["Manque expérience cloud"]
            }

            # ÉTAPE 3: Génération questions d'entretien
            print("  → Génération questions d'entretien...")

            analysis_for_interview = {
                "experiences": extracted_data.get("experiences", []),
                "matched_skills": analysis_result.get("strengths", []),
                "missing_skills": analysis_result.get("weaknesses", []),
                "compatibility_score": analysis_result.get("compatibility_score", 0)
            }
            interview_result = self.interview.generate_questions(
                analysis_for_interview)
            interview_questions = interview_result.get("questions", [])

            # MOCK - à remplacer

            # Combinaison des résultats
            complete_result = {
                "name": extracted_data.get("name", "Nom inconnu"),
                "score": analysis_result.get("compatibility_score", 0),
                "skills": extracted_data.get("skills", []),
                "experiences": extracted_data.get("experiences", []),
                "education": extracted_data.get("education", []),
                "languages": extracted_data.get("languages", []),
                "ats_compatible": analysis_result.get("ats_compatible", False),
                "feedback": analysis_result.get("feedback", ""),
                "strengths": analysis_result.get("strengths", []),
                "weaknesses": analysis_result.get("weaknesses", []),
                "interview_questions": interview_questions,
                "status": "success"
            }

            print(f"  ✅ Score: {complete_result['score']}/100\n")
            return complete_result

        except Exception as e:
            print(f"  ❌ Erreur: {str(e)}\n")
            return {
                "name": Path(cv_file).stem,
                "score": 0,
                "status": "error",
                "error_message": str(e),
                "feedback": f"Erreur lors du traitement: {str(e)}"
            }

    def run(self, cv_files: List[str], job_description: str) -> Dict[str, Any]:
        """
        Point d'entrée principal pour analyser plusieurs CVs.

        Args:
            cv_files: Liste des chemins vers les CVs
            job_description: Description du poste

        Returns:
            dict: Résultats complets pour tous les candidats
        """
        print("\n" + "="*60)
        print("🚀 ORCHESTRATOR AGENT - Démarrage de l'analyse")
        print("="*60 + "\n")

        # Validation des entrées
        try:
            self.validate_inputs(cv_files, job_description)
            print(f"✅ {len(cv_files)} CV(s) à analyser")
            print(
                f"✅ Description du poste validée ({len(job_description)} caractères)\n")
        except (ValueError, FileNotFoundError) as e:
            return {
                "status": "error",
                "error_message": str(e),
                "candidates": []
            }

        # Traitement de chaque CV
        candidates = []
        for cv_file in cv_files:
            result = self.process_single_cv(cv_file, job_description)
            candidates.append(result)

        # Tri par score décroissant
        candidates_sorted = sorted(
            candidates,
            key=lambda x: x.get("score", 0),
            reverse=True
        )

        # Statistiques globales
        successful_analyses = [
            c for c in candidates if c.get("status") == "success"]
        avg_score = sum(c.get("score", 0) for c in successful_analyses) / \
            len(successful_analyses) if successful_analyses else 0

        print("\n" + "="*60)
        print("📊 RÉSULTATS GLOBAUX")
        print("="*60)
        print(
            f"✅ CVs traités avec succès: {len(successful_analyses)}/{len(candidates)}")
        print(f"📈 Score moyen: {avg_score:.1f}/100")
        if candidates_sorted:
            print(
                f"🏆 Meilleur candidat: {candidates_sorted[0].get('name')} ({candidates_sorted[0].get('score')}/100)")
        print("="*60 + "\n")

        # Résultat final
        return {
            "status": "success",
            "job_description": job_description,
            "total_candidates": len(candidates),
            "successful_analyses": len(successful_analyses),
            "average_score": round(avg_score, 2),
            "candidates": candidates_sorted
        }


# ========== FONCTION POUR LE FRONTEND ==========

def analyze_candidates(cv_files: List[str], job_description: str) -> Dict[str, Any]:
    """
    Fonction d'interface pour le frontend Streamlit.

    Args:
        cv_files: Liste des chemins vers les CVs uploadés
        job_description: Description du poste (texte)

    Returns:
        dict: Résultats formatés pour affichage dans Streamlit
    """
    orchestrator = OrchestratorAgent()
    return orchestrator.run(cv_files, job_description)


# ========== TEST LOCAL ==========

if __name__ == "__main__":
    # Test avec des CVs fictifs
    test_cv_files = [
        "data/cv_test1.txt",
        "data/cv_test2.txt"
    ]

    test_job_description = """
    Nous recherchons un développeur Python avec une expérience en IA.
    Compétences requises:
    - Python avancé
    - Machine Learning / Deep Learning
    - LangChain ou frameworks similaires
    - Expérience avec des projets d'IA
    """

    try:
        orchestrator = OrchestratorAgent()
        results = orchestrator.run(test_cv_files, test_job_description)

        print("\n📋 RÉSULTATS JSON:")
        import json
        print(json.dumps(results, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"\n❌ Erreur lors du test: {str(e)}")
