import React, { useRef, useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import './UploadZone.css';

const UploadZone = ({ onFilesChange, files }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.name.endsWith('.pdf') || file.name.endsWith('.txt')
    );
    onFilesChange(validFiles);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFilesChange(selectedFiles);
  };

  const removeFile = (indexToRemove) => {
    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    onFilesChange(updatedFiles);
  };

  return (
    
    <div className="upload-section">
      <h2 className="section-title">
        Upload des CVs
      </h2>
      
      <div
        className={`upload-zone ${isDragging ? 'dragover' : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-icon-container">
          <div className="upload-icon-bg"></div>
          📁
        </div>
        <p className="upload-text">Cliquez ou glissez-déposez vos CVs ici</p>
        <p className="upload-hint">Formats acceptés: PDF, TXT • Maximum 10 fichiers</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div className="file-list">
          <div className="file-list-header">
            <strong className="file-list-title">
              {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
            </strong>
          </div>
          {files.map((file, idx) => (
            <div 
              key={idx} 
              className="file-item" 
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              <span className="file-info">
                <FileText size={20} color="#60a5fa" />
                <span className="file-name">{file.name}</span>
              </span>
              <span className="file-details">
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                <button 
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  aria-label="Supprimer le fichier"
                >
                  <X size={16} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
    
  );
};

export default UploadZone;