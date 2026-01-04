from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from typing import List, Optional
import pdfplumber
import os


# --------- JSON Schema (Contract) ----------

class CVStructuredData(BaseModel):
    name: Optional[str] = Field(description="Candidate full name")
    skills: List[str] = Field(description="Technical and soft skills")
    experiences: List[str] = Field(description="Professional experiences")
    education: List[str] = Field(description="Degrees and education")
    languages: List[str] = Field(description="Languages spoken")


# --------- Extractor Agent ----------

class ExtractorAgent:
    def __init__(self):
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )

    # 1️⃣ Lire PDF
    def read_pdf(self, file_path: str) -> str:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        return text

    # 2️⃣ Lire TXT
    def read_txt(self, file_path: str) -> str:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()

    # 3️⃣ Prompt
    def build_prompt(self, cv_text: str) -> str:
        return f"""
SYSTEM:
You are an AI resume parsing expert.

USER:
Extract structured information from the CV below.
Clean, normalize, and deduplicate data.

Return ONLY valid JSON matching this schema:
{CVStructuredData.model_json_schema()}

CV:
{cv_text}
"""

    # 4️⃣ Run agent
    def run(self, file_path: str) -> dict:
        if file_path.lower().endswith(".pdf"):
            cv_text = self.read_pdf(file_path)
        elif file_path.lower().endswith(".txt"):
            cv_text = self.read_txt(file_path)
        else:
            raise ValueError("Unsupported file format")

        result = self.llm.with_structured_output(
            CVStructuredData,
            strict=True
        ).invoke(self.build_prompt(cv_text))

        return result.model_dump()
