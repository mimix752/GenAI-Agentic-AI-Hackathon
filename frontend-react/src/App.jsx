import React, { useState } from 'react';
import Hero from './components/Hero/Hero';
import HowItWorks from './components/HowItWorks/HowItWorks';
import Pricing from './components/Pricing/Pricing'; // ← AJOUTER
import Navbar from './components/Navbar/Navbar'; // ← AJOUTER
import Features from './components/Features/Features';

import UploadZone from './components/UploadZone/UploadZone';
import JobDescription from './components/JobDescription/JobDescription';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import Results from './components/Results/Results';
import ScoreChart from './components/Charts/ScoreChart';
import RadarChart from './components/Charts/RadarChart';
import './App.css';
import FAQ from './components/FAQ/FAQ';

function App() {
  const [files, setFiles] = useState([]);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      alert('⚠️ Veuillez sélectionner au moins un CV');
      return;
    }

    if (jobDescription.length < 20) {
      alert('⚠️ La description du poste doit contenir au moins 20 caractères');
      return;
    }

    setIsLoading(true);
    setResults(null);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('cv_files', file);
    });
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/analyze', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Erreur lors de l\'analyse');
      }

      setResults(data);
      
      setTimeout(() => {
        document.querySelector('.results-container')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);

    } catch (error) {
      alert(`❌ Erreur: ${error.message}`);
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportJSON = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
      });
      const blob = await response.blob();
      downloadBlob(blob, 'resultats_analyse_cvs.json');
    } catch (error) {
      alert(`❌ Erreur lors de l'export: ${error.message}`);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/export/csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(results)
      });
      const blob = await response.blob();
      downloadBlob(blob, 'resultats_analyse_cvs.csv');
    } catch (error) {
      alert(`❌ Erreur lors de l'export: ${error.message}`);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      
        <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      
      
        
      <div className="container">
        <div className="main-card">
          <form onSubmit={handleAnalyze}>
            <UploadZone onFilesChange={setFiles} files={files} />
            <JobDescription value={jobDescription} onChange={setJobDescription} />
            
            <button 
              type="submit" 
              className="analyze-btn" 
              disabled={isLoading || files.length === 0 || jobDescription.length < 20}
            >
              {isLoading ? (
                <>
                  <span className="btn-spinner"></span>
                  Analyse en cours...
                </>
              ) : (
                <>
                   Analyser les CVs
                </>
              )}
            </button>
          </form>

          {isLoading && <LoadingSpinner />}

          {!isLoading && results && results.candidates && results.candidates.length > 0 && (
            <>
              <div className="charts-section">
                <h2 className="section-title-main">Visualisations </h2>
                <div className="charts-grid">
                  <ScoreChart candidates={results.candidates} />
                  <RadarChart candidates={results.candidates} />
                </div>
              </div>

              <Results 
                results={results}
                onExportJSON={exportJSON}
                onExportCSV={exportCSV}
              />
            </>
          )}
        </div>
      </div>
<Pricing />
<FAQ />
      <footer className="app-footer">
        <p>© 2026 CV Analyzer. All rights reserved.
</p>
      </footer>
    </div>
  );
}

export default App;