import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Loader2, FileText, UploadCloud } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export default function VerifyComponent() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'text' && !message.trim()) return;
    if (mode === 'file' && !file) return;
    if (!signature.trim()) return;

    setLoading(true);
    setError('');
    setIsValid(null);
    
    try {
      let response;
      if (mode === 'text') {
        response = await axios.post(`${API_URL}/verify`, { 
          message, 
          signature 
        });
      } else {
        const formData = new FormData();
        formData.append('file', file as Blob);
        formData.append('signature', signature);
        response = await axios.post(`${API_URL}/verify_file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsValid(response.data.valid);
    } catch (err) {
      setError('Erreur de validation. La signature est peut-être malformée ou l\'API est injoignable.');
      setIsValid(false);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleVerify}>
      <div className="mode-toggle" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: mode === 'text' ? 'var(--primary)' : 'var(--text-muted)' }}>
          <input type="radio" value="text" checked={mode === 'text'} onChange={() => setMode('text')} style={{ display: 'none' }} />
          <FileText size={20} /> Texte
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: mode === 'file' ? 'var(--primary)' : 'var(--text-muted)' }}>
          <input type="radio" value="file" checked={mode === 'file'} onChange={() => setMode('file')} style={{ display: 'none' }} />
          <UploadCloud size={20} /> Fichier (PDF, DOCX, etc.)
        </label>
      </div>

      {mode === 'text' ? (
        <div className="form-group">
          <label htmlFor="messageToVerify">Contenu original du document</label>
          <textarea
            id="messageToVerify"
            className="input-field"
            style={{ minHeight: '80px' }}
            placeholder="Entrez le texte exact du document..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="fileToVerify">Sélectionnez le fichier orignal</label>
          <input
            type="file"
            id="fileToVerify"
            className="input-field"
            style={{ padding: '0.75rem', cursor: 'pointer' }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && <p style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem' }}>Fichier chargé : {file.name}</p>}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="signatureToCheck">Signature numérique (Hexadécimal)</label>
        <textarea
          id="signatureToCheck"
          className="input-field"
          style={{ minHeight: '60px' }}
          placeholder="Collez la signature à vérifier..."
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      <button 
        type="submit" 
        className="primary-btn" 
        disabled={loading || (mode === 'text' && !message.trim()) || (mode === 'file' && !file) || !signature.trim()}
      >
        {loading ? <Loader2 className="animate-spin" /> : <Search />}
        {loading ? 'Vérification en cours...' : 'Vérifier l\'authenticité'}
      </button>

      {isValid !== null && (
        <div className="validation-result">
          {isValid ? (
            <div className="badge success">
              <CheckCircle size={24} />
              Document Authentique et Intègre
            </div>
          ) : (
            <div className="badge error">
              <XCircle size={24} />
              Signature Invalide ou Document Altéré
            </div>
          )}
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>
            {isValid 
              ? 'La signature correspond parfaitement au document fourni. Le contenu ou le fichier n\'a pas été altéré et a bien été signé par la source autorisée.'
              : 'La vérification a échoué. Le document/fichier a pu être modifié ou la signature ne lui correspond pas.'}
          </p>
        </div>
      )}
    </form>
  );
}
