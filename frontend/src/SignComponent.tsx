import React, { useState } from 'react';
import { PenTool, Copy, Check, Loader2, UploadCloud, FileText } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export default function SignComponent() {
  const [mode, setMode] = useState<'text' | 'file'>('text');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleSign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'text' && !message.trim()) return;
    if (mode === 'file' && !file) return;

    setLoading(true);
    setError('');
    
    try {
      if (mode === 'text') {
        const response = await axios.post(`${API_URL}/sign`, { message });
        setSignature(response.data.signature);
      } else {
        const formData = new FormData();
        formData.append('file', file as Blob);
        const response = await axios.post(`${API_URL}/sign_file`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setSignature(response.data.signature);
      }
    } catch (err) {
      setError('Erreur lors de la signature. Vérifiez que l\'API est lancée.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={handleSign}>
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
          <label htmlFor="messageToSign">Contenu du document à signer</label>
          <textarea
            id="messageToSign"
            className="input-field"
            placeholder="Entrez le texte de votre document ici..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="fileToSign">Sélectionnez un fichier à signer</label>
          <input
            type="file"
            id="fileToSign"
            className="input-field"
            style={{ padding: '0.75rem', cursor: 'pointer' }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          {file && <p style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem' }}>Fichier chargé : {file.name}</p>}
        </div>
      )}

      {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}

      <button 
        type="submit" 
        className="primary-btn" 
        disabled={loading || (mode === 'text' && !message.trim()) || (mode === 'file' && !file)}
      >
        {loading ? <Loader2 className="animate-spin" /> : <PenTool />}
        {loading ? 'Génération...' : 'Générer la signature numérique'}
      </button>

      {signature && (
        <div className="result-box">
          <div className="result-header">
            <span className="result-label">Signature Hexadécimale</span>
            <button type="button" onClick={copyToClipboard} className="copy-btn" title="Copier">
              {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
          <div className="result-content">
            {signature}
          </div>
        </div>
      )}
    </form>
  );
}
