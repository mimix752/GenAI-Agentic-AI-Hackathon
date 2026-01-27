"""
Interview Agent (Hybrid)
========================

Rôle :
- Générer des questions d’entretien de haute qualité à partir d’une analyse de CV.
- Combiner une logique métier explicable (rule-based)
  avec une génération linguistique avancée (LLaMA 3.1 8B via Groq).

Philosophie :
- Les règles décident QUOI évaluer (expérience, technique, progression, comportement).
- Le LLM décide COMMENT formuler les questions de manière humaine et contextuelle.
- Fallback sécurisé en cas d’échec du LLM.

Ce design garantit :
- Robustesse
- Explicabilité
- Effet WOW pour les jurys
"""

import os
from typing import List, Dict
from groq import Groq


class InterviewAgent:
    """
    Interview Agent Hybride (Rule-based + LLM)

    Input attendu (analysis):
    {
        "experiences": list[str],
        "matched_skills": list[str],
        "missing_skills": list[str],
        "compatibility_score": int
    }

    Output:
    {
        "questions": list[str]
    }
    """

    MAX_QUESTIONS = 3

    def __init__(self, use_llm: bool = True):
        """
        :param use_llm: Active ou non la génération via LLaMA.
                        En cas de problème, un fallback rule-based est utilisé.
        """
        self.use_llm = use_llm
        self.client = None

        if self.use_llm:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                raise ValueError(
                    "❌ GROQ_API_KEY manquant. "
                    "Définis la variable d’environnement avant de lancer l’application."
                )
            self.client = Groq(api_key=api_key)

    # ============================================================
    # 🧠 API PRINCIPALE
    # ============================================================

    def generate_questions(self, analysis: Dict) -> Dict[str, List[str]]:
        """
        Point d’entrée principal appelé par l’orchestrator.
        """
        context = self._build_context(analysis)

        # 🔥 Mode WOW : génération LLM
        if self.use_llm:
            try:
                prompt = self._build_prompt(context)
                questions = self._generate_with_llama(prompt)
                return {"questions": questions[: self.MAX_QUESTIONS]}
            except Exception as e:
                print("⚠️ LLM indisponible, fallback rule-based :", e)

        # 🛟 Fallback sécurisé
        return {"questions": self._rule_based_questions(context)}

    # ============================================================
    # 🧠 LOGIQUE MÉTIER (CERVEAU)
    # ============================================================

    def _build_context(self, analysis: Dict) -> Dict:
        """
        Construit un contexte structuré à partir de l’analyse du CV.
        Cette étape est déterministe et explicable.
        """
        return {
            "experience": analysis.get("experiences", []),
            "skill": analysis.get("matched_skills", [None])[0],
            "weakness": analysis.get("missing_skills", [None])[0],
            "score": analysis.get("compatibility_score", 0),
        }

    # ============================================================
    # ✍️ PROMPT ENGINEERING (PLUME)
    # ============================================================

    def _build_prompt(self, context: Dict) -> str:
        language = "French"  # ou "English"
        return f"""
    You are an experienced professional recruiter conducting a job interview.
    All questions MUST be written in {language}.
    Candidate profile (some fields may be empty):
    - Experience: {context['experience']}
    - Key skills: {context['skill']}
    - Identified improvement area: {context['weakness']}
    - Overall compatibility score: {context['score']}/100

    Task:
    Generate exactly 3 interview questions adapted to the candidate profile.

    Rules (VERY IMPORTANT):
    - Do NOT add any introduction, explanation, or commentary
    - Do NOT mention that these are interview questions
    - Do NOT use markdown, bullet points, or numbering
    - Each line must contain ONLY one question
    - Each question must be meaningful even if some profile fields are missing
    - Start each line directly with the question text

    The questions must:
    - Be specific to the candidate’s background
    - Be relevant regardless of the professional domain
    - Encourage concrete, real-world answers
    - Avoid generic or textbook formulations
    - Sound natural and human, as asked by an experienced recruiter

    Output format:
    - Exactly 3 lines
    - One question per line
    """

    # ============================================================
    # 🤖 APPEL LLaMA VIA GROQ
    # ============================================================

    def _generate_with_llama(self, prompt: str) -> List[str]:
        response = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.4,
            max_tokens=350,
        )

        content = response.choices[0].message.content

        raw_lines = content.split("\n")
        questions = []

        for line in raw_lines:
            clean = line.strip().lstrip("-•0123456789. ").strip()

            # Filtrage des phrases parasites
            if len(clean) < 25:
                continue
            lowered = clean.lower()
            if any(x in lowered for x in [
                "here are", "based on", "interview question", "questions:"
            ]):
                continue

            questions.append(clean)

        # Sécurité finale : garantir EXACTEMENT 3 questions
        return questions[: self.MAX_QUESTIONS]

    # ============================================================
    # 🛟 FALLBACK RULE-BASED (SAFE MODE)
    # ============================================================

    def _rule_based_questions(self, context: Dict) -> List[str]:
        """
        Génération déterministe utilisée en cas d’échec du LLM.
        """
        questions = []

        if context["experience"]:
            questions.append(
                "Pouvez-vous décrire votre rôle exact et vos responsabilités "
                "dans votre expérience la plus marquante ?"
            )

        if context["skill"]:
            questions.append(
                f"Pouvez-vous donner un exemple concret où vous avez utilisé {context['skill']} "
                "pour résoudre un problème réel en production ?"
            )

        questions.append(
            "Comment abordez-vous l’apprentissage d’une nouvelle technologie "
            "lorsqu’elle devient nécessaire dans un projet ?"
        )

        return questions[: self.MAX_QUESTIONS]
