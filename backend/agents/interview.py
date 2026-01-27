class InterviewAgent:
    """
    Interview Agent
    ----------------
    Rôle :
    Générer des questions d'entretien pertinentes à partir d'une analyse de CV.

    Philosophie :
    - Raisonnement métier explicable (pas de LLM pour la décision)
    - Questions stables, cohérentes, et adaptées au profil
    - Prêt pour une intégration backend / frontend

    Contrat d'entrée (analysis):
    {
        "experiences": list[str],
        "matched_skills": list[str],
        "missing_skills": list[str],
        "compatibility_score": int
    }

    Sortie :
    {
        "questions": list[str]
    }
    """

    MAX_QUESTIONS = 5

    def generate_questions(self, analysis: dict) -> dict:
        questions = []

        experiences = analysis.get("experiences", [])
        matched_skills = analysis.get("matched_skills", [])
        missing_skills = analysis.get("missing_skills", [])
        score = int(analysis.get("compatibility_score", 0))

        # 1) Expérience (toujours en premier)
        if experiences:
            questions.append(self._experience_question())

        # 2) Technique (une compétence clé)
        if matched_skills:
            questions.append(self._technical_question(matched_skills[0]))

        # 3) Axe d'amélioration (formulation humaine et générique)
        if missing_skills:
            questions.append(self._improvement_question())

        # 4) Comportement / soft skills (adapté au score)
        questions.append(self._behavioral_question(score))

        # 5) Fallback si jamais tout est vide
        if not questions:
            questions.append(self._fallback_question())

        return {"questions": questions[: self.MAX_QUESTIONS]}

    # ---------- Templates de questions (lisibles & testables) ----------

    def _experience_question(self) -> str:
        return (
            "Pouvez-vous décrire votre rôle exact et vos responsabilités "
            "dans votre expérience la plus marquante ?"
        )

    def _technical_question(self, skill: str) -> str:
        return (
            f"Pouvez-vous donner un exemple concret où vous avez utilisé {skill} "
            "pour résoudre un problème réel ?"
        )

    def _improvement_question(self) -> str:
        return (
            "Nous avons identifié un axe d’amélioration dans votre profil. "
            "Comment envisagez-vous de renforcer cette compétence dans les prochains mois ?"
        )

    def _behavioral_question(self, score: int) -> str:
        if score >= 80:
            return (
                "Parlez-moi d’une situation où vous avez pris une initiative "
                "technique importante sans qu’on vous le demande."
            )
        return (
            "Comment réagissez-vous lorsque vous êtes confronté à une technologie "
            "ou un problème que vous ne maîtrisez pas encore ?"
        )

    def _fallback_question(self) -> str:
        return (
            "Pouvez-vous vous présenter brièvement et nous parler de votre parcours professionnel ?"
        )
