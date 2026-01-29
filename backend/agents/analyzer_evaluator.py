"""
Analyzer Evaluator Agent
========================

Rôle :
- Analyser les données JSON du CV extraites par l'ExtractorAgent
- Comparer avec les job requirements du frontend
- Calculer un score de compatibilité
- Prendre une décision d'interview (accepté/rejeté)
- Fournir une fourchette de salaire et un résumé pour le recruteur

Utilise Groq (LLaMA 3.1 8B) pour l'analyse intelligente.
"""

import os
from typing import Dict, List
from dotenv import load_dotenv
from groq import Groq

# Charger les variables d'environnement depuis .env
load_dotenv()


class AnalyzerEvaluatorAgent:
    """
    Agent d'analyse et d'évaluation des candidats
    
    Input attendu:
    - cv_data: dict (données JSON de l'ExtractorAgent)
    - job_requirements: dict (exigences du poste du frontend)
    
    Output:
    {
        "score": int,
        "decision": str,  # "interview" ou "rejet"
        "salary_range": str,
        "strengths": list[str],
        "weaknesses": list[str],
        "summary": str
    }
    """
    
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("⚠️ GROQ_API_KEY manquant. Mode fallback activé.")
            print("💡 Pour utiliser Groq: configure ta clé dans le fichier .env")
            self.client = None
        else:
            self.client = Groq(api_key=api_key)
    
    def evaluate_candidate(self, cv_data: Dict, job_requirements: Dict) -> Dict:
        """
        Point d'entrée principal pour évaluer un candidat
        """
        # Test avec données fictives si pas de vraies données
        if not cv_data:
            cv_data = self._get_mock_cv_data()
        if not job_requirements:
            job_requirements = self._get_mock_job_requirements()
            
        prompt = self._build_evaluation_prompt(cv_data, job_requirements)
        
        if self.client:
            try:
                result = self._analyze_with_groq(prompt)
                return self._parse_analysis_result(result)
            except Exception as e:
                print(f"⚠️ Erreur Groq, fallback: {e}")
                return self._fallback_evaluation(cv_data, job_requirements)
        else:
            print("🔄 Utilisation du mode fallback (pas de clé API)")
            return self._fallback_evaluation(cv_data, job_requirements)
    
    def _get_mock_cv_data(self) -> Dict:
        """Données fictives pour test"""
        return {
            "name": "Jean Dupont",
            "skills": ["Python", "React", "SQL", "Git", "Docker"],
            "experiences": [
                "Développeur Full-Stack chez TechCorp (2021-2023)",
                "Développeur Junior chez StartupXYZ (2020-2021)"
            ],
            "education": ["Master Informatique - Université Paris"],
            "languages": ["Français", "Anglais"]
        }
    
    def _get_mock_job_requirements(self) -> Dict:
        """Exigences fictives pour test"""
        return {
            "title": "Développeur Full-Stack Senior",
            "required_skills": ["Python", "React", "PostgreSQL", "AWS"],
            "experience_years": 3,
            "salary_min": 45000,
            "salary_max": 65000,
            "description": "Développement d'applications web modernes"
        }
    
    def _build_evaluation_prompt(self, cv_data: Dict, job_requirements: Dict) -> str:
        return f"""
Tu es un expert RH qui évalue les candidats pour des postes techniques.

DONNÉES DU CANDIDAT:
{cv_data}

EXIGENCES DU POSTE:
{job_requirements}

TÂCHE:
Analyse ce candidat et fournis une évaluation complète.

FORMAT DE RÉPONSE (RESPECTE EXACTEMENT):
SCORE: [0-100]
DECISION: [interview/rejet]
SALAIRE: [fourchette en MAD si interview, vide si rejet]
FORCES: [3 points forts séparés par |]
FAIBLESSES: [3 points faibles séparés par |]
RÉSUMÉ: [paragraphe de 2-3 phrases pour le recruteur]

CRITÈRES D'ÉVALUATION:
- Adéquation des compétences techniques
- Niveau d'expérience requis
- Potentiel d'évolution
- Cohérence du parcours

Seuil d'interview: score ≥ 70
IMPORTANT: Si DECISION = rejet, ne pas écrire de salaire (laisser SALAIRE: vide)
"""
    
    def _analyze_with_groq(self, prompt: str) -> str:
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=500
        )
        return response.choices[0].message.content
    
    def _parse_analysis_result(self, result: str) -> Dict:
        """Parse la réponse structurée de Groq"""
        lines = result.strip().split('\n')
        parsed = {}
        
        for line in lines:
            if line.startswith('SCORE:'):
                parsed['score'] = int(line.split(':')[1].strip())
            elif line.startswith('DECISION:'):
                parsed['decision'] = line.split(':')[1].strip()
            elif line.startswith('SALAIRE:'):
                salary_text = line.split(':')[1].strip()
                # Si décision = rejet, pas de salaire
                if parsed.get('decision') == 'rejet':
                    parsed['salary_range'] = ""
                else:
                    parsed['salary_range'] = salary_text
            elif line.startswith('FORCES:'):
                parsed['strengths'] = line.split(':')[1].strip().split('|')
            elif line.startswith('FAIBLESSES:'):
                parsed['weaknesses'] = line.split(':')[1].strip().split('|')
            elif line.startswith('RÉSUMÉ:'):
                parsed['summary'] = line.split(':')[1].strip()
        
        return parsed
    
    def _fallback_evaluation(self, cv_data: Dict, job_requirements: Dict) -> Dict:
        """Évaluation de secours en cas d'échec Groq"""
        # Calcul simple du score basé sur les compétences
        required_skills = set(job_requirements.get('required_skills', []))
        candidate_skills = set(cv_data.get('skills', []))
        
        skill_match = len(required_skills.intersection(candidate_skills))
        total_required = len(required_skills)
        score = int((skill_match / max(total_required, 1)) * 100) if total_required > 0 else 50
        
        decision = "interview" if score >= 70 else "rejet"
        
        # Si rejet, pas de salaire
        salary_range = "450000-550000 MAD" if decision == "interview" else ""
        
        return {
            "score": score,
            "decision": decision,
            "salary_range": salary_range,
            "strengths": ["Compétences techniques", "Expérience pertinente", "Formation solide"],
            "weaknesses": ["Manque certaines compétences", "Expérience limitée", "À confirmer en entretien"],
            "summary": f"Candidat avec un score de {score}/100. Profil {'prometteur' if score >= 70 else 'insuffisant'} pour le poste."
        }

# ============================================================
# 🧪 TEST AVEC DONNÉES FICTIVES
# ============================================================

def test_analyzer_evaluator():
    """Test de l'agent avec données fictives"""
    print("🧪 Test AnalyzerEvaluatorAgent avec données fictives...")
    
    try:
        agent = AnalyzerEvaluatorAgent()
        
        # Test avec données vides (utilise les données fictives internes)
        result = agent.evaluate_candidate({}, {})
        
        print("\n✅ RÉSULTAT DE L'ÉVALUATION:")
        print(f"Score: {result.get('score', 'N/A')}/100")
        print(f"Décision: {result.get('decision', 'N/A')}")
        print(f"Salaire: {result.get('salary_range', 'N/A')}")
        print(f"Points forts: {result.get('strengths', [])}")
        print(f"Points faibles: {result.get('weaknesses', [])}")
        print(f"Résumé: {result.get('summary', 'N/A')}")
        
        return result
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {e}")
        return None


if __name__ == "__main__":
    test_analyzer_evaluator()
